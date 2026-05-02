import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { connectToDatabase, isMongoConnectivityError } from "@/src/lib/db";
import { requireAuth } from "@/src/lib/requestAuth";
import { uploadFile } from "@/src/lib/storage";
import { FileModel } from "@/src/models/File";
import { normalizeCategory, type Category } from "@/src/lib/categories";
import { extractText } from "@/lib/services/extractors";
import { classifyDocument } from "@/lib/services/classifier";

export const runtime = "nodejs";

const GUEST_COOKIE = "docsort_guest";
const GUEST_MAX_AGE_SECONDS = 60 * 60 * 24; // 24h

function isPayloadTooLargeError(error: unknown): boolean {
  const message =
    typeof error === "object" && error && "message" in error
      ? String((error as { message?: unknown }).message ?? "")
      : String(error ?? "");

  return /request entity too large|payload too large|body.*too large|size limit|max(imum)? size/i.test(
    message,
  );
}

async function downloadAssetFromUrl(url: string): Promise<Buffer> {
  const res = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "*/*" },
  });
  if (!res.ok) throw new Error(`Failed to download asset from ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

function isHttpsRequest(req: NextRequest): boolean {
  const forwarded = req.headers.get("x-forwarded-proto");
  const proto = (
    forwarded?.split(",")[0]?.trim() || req.nextUrl.protocol
  ).replace(":", "");
  return proto === "https";
}

export async function POST(req: NextRequest) {
  try {
    const debug = process.env.DOCSORT_DEBUG === "1";

    let user: Awaited<ReturnType<typeof requireAuth>> | null = null;
    try {
      user = await requireAuth(req);
    } catch {
      user = null;
    }

    let guestId = req.cookies.get(GUEST_COOKIE)?.value ?? null;
    let shouldSetGuestCookie = false;
    if (!user) {
      if (!guestId) {
        guestId = randomUUID();
        shouldSetGuestCookie = true;
      }
    }

    const contentType = req.headers.get("content-type") || "";

    let fileName: string;
    let mimeType: string;
    let fileSize: number;
    let buffer: Buffer;
    let uploadResult: { secure_url: string; public_id: string } | null = null;

    if (contentType.includes("application/json")) {
      const body = (await req.json().catch(() => null)) as {
        fileUrl?: string;
        cloudinaryPublicId?: string;
        fileName?: string;
        mimeType?: string;
        size?: number;
      } | null;

      if (
        !body?.fileUrl ||
        !body.cloudinaryPublicId ||
        !body.fileName ||
        typeof body.fileName !== "string"
      ) {
        return NextResponse.json(
          { success: false, error: "Invalid upload payload" },
          { status: 400 },
        );
      }

      fileName = body.fileName;
      mimeType = body.mimeType || "";
      fileSize = typeof body.size === "number" ? body.size : 0;
      uploadResult = {
        secure_url: body.fileUrl,
        public_id: body.cloudinaryPublicId,
      };

      buffer = await downloadAssetFromUrl(body.fileUrl);
    } else {
      let formData: FormData;
      try {
        formData = await req.formData();
      } catch (error) {
        if (isPayloadTooLargeError(error)) {
          return NextResponse.json(
            {
              success: false,
              error: "File is too large to upload",
            },
            { status: 413 },
          );
        }
        throw error;
      }

      const file = formData.get("file");

      if (!(file instanceof File)) {
        return NextResponse.json(
          { success: false, error: "No file provided" },
          { status: 400 },
        );
      }

      fileName = file.name;
      mimeType = file.type || "";
      fileSize = file.size;

      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }

    // Extract + classify for best accuracy
    let extractedText = "";
    try {
      const extraction = await extractText(buffer, mimeType, fileName);
      extractedText = extraction.text;
    } catch (error) {
      // Extractors are intended to be best-effort; keep uploads reliable.
      if (debug) console.error("[files/upload] text extraction failed", error);
    }

    const classificationInput = [fileName, extractedText]
      .filter(Boolean)
      .join("\n\n");
    const classification = await classifyDocument(classificationInput);

    const category: Category = normalizeCategory(classification.category);

    try {
      await connectToDatabase();
    } catch (error) {
      if (isMongoConnectivityError(error)) {
        if (debug)
          console.error("[files/upload] mongo connectivity error", error);
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

    if (!uploadResult) {
      const ownerFolder = user ? user.id : `guest/${guestId}`;
      const stored = await uploadFile(buffer, {
        filename: fileName,
        mimeType,
        folder: `${ownerFolder}/${category}`,
      });
      uploadResult = {
        secure_url: stored.secureUrl,
        public_id: stored.publicId,
      };
    }

    const doc = await FileModel.create({
      ...(user ? { userId: user.id } : { guestId }),
      fileName,
      fileUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      category,
      uploadedAt: new Date(),
      mimeType: mimeType || undefined,
      size: fileSize,
    });

    const res = NextResponse.json(
      {
        success: true,
        file: {
          id: doc._id.toString(),
          fileName: doc.fileName,
          fileUrl: doc.fileUrl,
          category: doc.category,
          uploadedAt: doc.uploadedAt,
          confidence: classification.confidence,
          mode: classification.mode,
        },
      },
      { status: 201 },
    );

    if (shouldSetGuestCookie && guestId) {
      res.cookies.set(GUEST_COOKIE, guestId, {
        httpOnly: true,
        sameSite: "lax",
        secure: isHttpsRequest(req),
        path: "/",
        maxAge: GUEST_MAX_AGE_SECONDS,
      });
    }

    return res;
  } catch (error) {
    // Always log unexpected errors to help diagnose issues
    console.error(
      "[files/upload] unhandled error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
