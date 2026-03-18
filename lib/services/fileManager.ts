import fs from "fs";
import path from "path";
import { DocumentCategory } from "@/lib/types";

// For Vercel deployment, files are stored in /tmp
// For local development, use ./uploads
const BASE_UPLOAD_DIR =
  process.env.NODE_ENV === "production"
    ? "/tmp/uploads"
    : path.join(process.cwd(), "public", "uploads");

const BASE_SORTED_DIR =
  process.env.NODE_ENV === "production"
    ? "/tmp/sorted"
    : path.join(process.cwd(), "public", "sorted");

function sanitizeFilename(input: string): string {
  // Keep only the basename to prevent path traversal.
  const base = path.basename(input).replace(/\0/g, "");
  const ext = path.extname(base);
  const name = path.basename(base, ext);

  // Replace separators and unsafe characters.
  const safeName = name
    .replace(/[\\/]/g, "_")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);

  const safeExt = ext
    .replace(/[\\/]/g, "")
    .replace(/[^a-zA-Z0-9.]/g, "")
    .slice(0, 12);

  const finalName = safeName.length > 0 ? safeName : "file";
  return `${finalName}${safeExt || ""}`;
}

export function getUploadDir(): string {
  if (!fs.existsSync(BASE_UPLOAD_DIR)) {
    fs.mkdirSync(BASE_UPLOAD_DIR, { recursive: true });
  }
  return BASE_UPLOAD_DIR;
}

export function getSortedDir(): string {
  if (!fs.existsSync(BASE_SORTED_DIR)) {
    fs.mkdirSync(BASE_SORTED_DIR, { recursive: true });
  }
  return BASE_SORTED_DIR;
}

export function getCategoryPath(category: DocumentCategory): string {
  const categoryDir = path.join(getSortedDir(), category);
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }
  return categoryDir;
}

export function saveUploadedFile(
  buffer: Buffer,
  originalFilename: string,
): { filename: string; path: string } {
  const uploadDir = getUploadDir();

  const safeOriginalFilename = sanitizeFilename(originalFilename);

  // Generate unique filename
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const ext = path.extname(safeOriginalFilename);
  const name = path.basename(safeOriginalFilename, ext);
  const filename = `${name}-${timestamp}-${random}${ext}`;

  const filepath = path.join(uploadDir, filename);
  fs.writeFileSync(filepath, buffer);

  return { filename, path: filepath };
}

export function organizeFile(
  sourceFilePath: string,
  category: DocumentCategory,
  originalFilename: string,
): { filename: string; path: string } {
  const categoryPath = getCategoryPath(category);

  // Keep original filename but ensure uniqueness
  let targetFilename = sanitizeFilename(originalFilename);
  let targetPath = path.join(categoryPath, targetFilename);

  // If file exists, append timestamp
  if (fs.existsSync(targetPath)) {
    const ext = path.extname(targetFilename);
    const name = path.basename(targetFilename, ext);
    const timestamp = Date.now();
    targetFilename = `${name}-${timestamp}${ext}`;
    targetPath = path.join(categoryPath, targetFilename);
  }

  // Move the file
  fs.renameSync(sourceFilePath, targetPath);

  return { filename: targetFilename, path: targetPath };
}

export function readFileBuffer(filepath: string): Buffer {
  return fs.readFileSync(filepath);
}
