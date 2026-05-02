import { randomUUID } from "crypto";
import path from "path";
import fs from "fs/promises";

export type UploadResult = {
  publicId: string;
  secureUrl: string;
  resourceType: string;
  format: string;
  bytes: number;
};

export function isLocalStorageMode(): boolean {
  return process.env.STORAGE_MODE === "local";
}

export async function uploadFile(
  buffer: Buffer,
  options: { filename: string; mimeType: string; folder?: string },
): Promise<UploadResult> {
  return isLocalStorageMode()
    ? uploadLocalFile(buffer, options)
    : uploadCloudinaryFile(buffer, options);
}

export async function deleteFile(storageKey: string): Promise<void> {
  if (isLocalStorageMode()) {
    await deleteLocalFile(storageKey);
  } else {
    await deleteCloudinaryFile(storageKey);
  }
}

export async function getFileBuffer(
  storageKey: string,
  fileUrl: string,
): Promise<{ buffer: Buffer; contentType?: string }> {
  if (isLocalStorageMode()) {
    return getLocalFileBuffer(storageKey);
  }
  return getCloudinaryFileBuffer(storageKey, fileUrl);
}

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

async function uploadLocalFile(
  buffer: Buffer,
  options: { filename: string; mimeType: string; folder?: string },
): Promise<UploadResult> {
  const folder = options.folder ?? "misc";
  const ext = path.extname(options.filename) || mimeTypeToExt(options.mimeType);
  const baseName = `${randomUUID()}${ext}`;
  const dir = path.join(UPLOADS_DIR, folder);
  await fs.mkdir(dir, { recursive: true });

  const filePath = path.join(dir, baseName);
  await fs.writeFile(filePath, buffer);

  const webPath = `/uploads/${folder}/${baseName}`;

  return {
    publicId: webPath,
    secureUrl: webPath,
    resourceType: "raw",
    format: ext.replace(".", ""),
    bytes: buffer.byteLength,
  };
}

async function deleteLocalFile(storageKey: string): Promise<void> {
  try {
    const filePath = path.join(process.cwd(), "public", storageKey);
    await fs.unlink(filePath);
  } catch {
    // File may already be deleted — ignore
  }
}

async function getLocalFileBuffer(
  storageKey: string,
): Promise<{ buffer: Buffer; contentType?: string }> {
  const filePath = path.join(process.cwd(), "public", storageKey);
  const buffer = await fs.readFile(filePath);
  return { buffer };
}

async function uploadCloudinaryFile(
  buffer: Buffer,
  options: { filename: string; mimeType: string; folder?: string },
): Promise<UploadResult> {
  const { getCloudinary } = await import("@/src/lib/cloudinary");
  const cloud = getCloudinary();

  const result = await new Promise<Record<string, unknown>>(
    (resolve, reject) => {
      const uploadStream = cloud.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: options.folder ? `uploads/${options.folder}` : "docsort",
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error || !result)
            return reject(error ?? new Error("Cloudinary upload failed"));
          resolve(result as Record<string, unknown>);
        },
      );
      uploadStream.end(buffer);
    },
  );

  return {
    publicId: result.public_id as string,
    secureUrl: result.secure_url as string,
    resourceType: result.resource_type as string,
    format: result.format as string,
    bytes: result.bytes as number,
  };
}

async function deleteCloudinaryFile(storageKey: string): Promise<void> {
  const { getCloudinary } = await import("@/src/lib/cloudinary");
  const cloud = getCloudinary();
  const tryDestroy = (rt: "raw" | "image" | "video") =>
    cloud.uploader.destroy(storageKey, { resource_type: rt }).catch(() => null);
  await tryDestroy("raw");
  await tryDestroy("image");
  await tryDestroy("video");
}

async function getCloudinaryFileBuffer(
  storageKey: string,
  fileUrl: string,
): Promise<{ buffer: Buffer; contentType?: string }> {
  const { getCloudinary } = await import("@/src/lib/cloudinary");
  const cloud = getCloudinary();

  const parts = (() => {
    try {
      return new URL(fileUrl).pathname.split("/").filter(Boolean);
    } catch {
      return [];
    }
  })();
  const rt = (
    ["image", "raw", "video"].includes(parts[1] ?? "") ? parts[1] : "raw"
  ) as "image" | "raw" | "video";
  const dtype = parts[2] ?? "upload";

  const signedUrl = cloud.url(storageKey, {
    secure: true,
    sign_url: true,
    resource_type: rt,
    type: dtype,
  });

  const tryFetch = async (url: string) =>
    fetch(url, { cache: "no-store", headers: { Accept: "*/*" } });

  let res = await tryFetch(signedUrl);
  if (!res.ok && fileUrl && fileUrl !== signedUrl)
    res = await tryFetch(fileUrl);

  if (!res.ok || !res.body) {
    throw new Error(
      `Failed to fetch file from Cloudinary (status ${res.status})`,
    );
  }

  const ab = await res.arrayBuffer();
  return {
    buffer: Buffer.from(ab),
    contentType: res.headers.get("content-type") ?? undefined,
  };
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function mimeTypeToExt(mimeType: string): string {
  const map: Record<string, string> = {
    "application/pdf": ".pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      ".docx",
    "application/msword": ".doc",
    "text/plain": ".txt",
    "image/jpeg": ".jpg",
    "image/png": ".png",
  };
  return map[mimeType] ?? "";
}
