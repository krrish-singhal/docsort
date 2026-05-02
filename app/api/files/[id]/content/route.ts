import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase, isMongoConnectivityError } from "@/src/lib/db";
import { requireAuth } from "@/src/lib/requestAuth";
import { FileModel } from "@/src/models/File";
import { getFileBuffer, isLocalStorageMode } from "@/src/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

function contentTypeForFilename(
  filename: string,
  fallback?: string | null,
): string {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".txt")) return "text/plain; charset=utf-8";
  if (lower.endsWith(".docx")) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  if (lower.endsWith(".doc")) return "application/msword";
  return fallback && typeof fallback === "string"
    ? fallback
    : "application/octet-stream";
}

function dispositionForFilename(filename: string): "inline" | "attachment" {
  const lower = filename.toLowerCase();
  return lower.endsWith(".pdf") || lower.endsWith(".txt")
    ? "inline"
    : "attachment";
}

function extensionFromFilename(filename: string): string | null {
  const base = filename.split("/").pop() ?? filename;
  const idx = base.lastIndexOf(".");
  if (idx <= 0 || idx === base.length - 1) return null;
  return base.slice(idx + 1).toLowerCase();
}

function parseCloudinaryResourceType(
  url: string | null | undefined,
): "image" | "raw" | "video" {
  if (!url) return "raw";
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/").filter(Boolean);
    const candidate = parts[1];
    if (candidate === "image" || candidate === "raw" || candidate === "video")
      return candidate;
  } catch {
    // ignore
  }
  return "raw";
}

function parseCloudinaryType(url: string | null | undefined): string {
  if (!url) return "upload";
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/").filter(Boolean);
    // format: /<cloud_name>/<resource_type>/<type>/...
    const candidate = parts[2];
    return candidate || "upload";
  } catch {
    return "upload";
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const debug = process.env.DOCSORT_DEBUG === "1";
    const user = await requireAuth(req);
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid id" },
        { status: 400 },
      );
    }

    try {
      await connectToDatabase();
    } catch (error) {
      if (isMongoConnectivityError(error)) {
        if (debug)
          console.error(
            "[api/files/:id/content] mongo connectivity error",
            error,
          );
        return NextResponse.json(
          {
            success: false,
            error: "Database unavailable",
            detail:
              "MongoDB is not reachable. If you use MongoDB Atlas, add your server IP to the Network Access allowlist (or use 0.0.0.0/0 for development).",
          },
          { status: 503 },
        );
      }
      throw error;
    }

    const file = await FileModel.findById(id)
      .select({
        userId: 1,
        fileName: 1,
        fileUrl: 1,
        cloudinaryPublicId: 1,
        mimeType: 1,
      })
      .lean();

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 },
      );
    }

    if (!file.userId || file.userId.toString() !== user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }

    // ── Local storage mode: serve file directly from public/uploads ──────────
    // In local mode the fileUrl is already a web-accessible path like /uploads/…
    // We serve it via a redirect so the browser (or download client) fetches it
    // directly from Next.js static file serving — no buffer copy needed.
    if (isLocalStorageMode()) {
      const localUrl = file.fileUrl;
      const contentType = contentTypeForFilename(
        file.fileName,
        file.mimeType ?? null,
      );
      const disposition = dispositionForFilename(file.fileName);

      // If available, stream from disk for correctness; fall back to redirect.
      try {
        const { buffer } = await getFileBuffer(
          file.cloudinaryPublicId ?? localUrl,
          localUrl,
        );
        const headers = new Headers();
        headers.set("Content-Type", contentType);
        headers.set(
          "Content-Disposition",
          `${disposition}; filename*=UTF-8''${encodeURIComponent(file.fileName)}`,
        );
        headers.set("Cache-Control", "no-store");
        headers.set("Content-Length", String(buffer.byteLength));
        return new NextResponse(new Uint8Array(buffer), {
          status: 200,
          headers,
        });
      } catch {
        // Couldn't read from disk — redirect to static asset
        return NextResponse.redirect(new URL(localUrl, req.nextUrl.origin));
      }
    }

    // ── Cloud storage mode: fetch from Cloudinary ──────────────────────────────
    const storageKey = file.cloudinaryPublicId;
    if (!storageKey) {
      return NextResponse.json(
        { success: false, error: "No storage key" },
        { status: 404 },
      );
    }

    let fileBuffer: Buffer;
    let upstreamContentType: string | undefined;
    try {
      const result = await getFileBuffer(storageKey, file.fileUrl ?? "");
      fileBuffer = result.buffer;
      upstreamContentType = result.contentType;
    } catch (err) {
      if (debug)
        console.error("[api/files/:id/content] getFileBuffer failed", err);
      return NextResponse.json(
        { success: false, error: "Failed to fetch file content" },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    const contentType = contentTypeForFilename(
      file.fileName,
      upstreamContentType ?? file.mimeType ?? null,
    );
    const disposition = dispositionForFilename(file.fileName);

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set(
      "Content-Disposition",
      `${disposition}; filename*=UTF-8''${encodeURIComponent(file.fileName)}`,
    );
    headers.set("Cache-Control", "no-store");
    headers.set("Content-Length", String(fileBuffer.byteLength));

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (process.env.DOCSORT_DEBUG === "1")
      console.error("[api/files/:id/content GET] error", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
