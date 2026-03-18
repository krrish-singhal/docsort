import { v2 as cloudinary } from 'cloudinary';

let configured = false;

export function getCloudinary() {
  if (!configured) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Cloudinary env vars are not set');
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });

    configured = true;
  }

  return cloudinary;
}

export function cloudinaryPublicIdFromSecureUrl(url: string): string | null {
  // Cloudinary secure URLs typically: https://res.cloudinary.com/<cloud>/.../upload/v123/folder/file.ext
  // We store public_id explicitly in DB; this helper is best-effort fallback.
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/');
    const uploadIndex = parts.findIndex((p) => p === 'upload');
    if (uploadIndex === -1) return null;

    const afterUpload = parts.slice(uploadIndex + 1);
    const withoutVersion = afterUpload[0]?.startsWith('v') ? afterUpload.slice(1) : afterUpload;
    const joined = withoutVersion.join('/');
    const dot = joined.lastIndexOf('.');
    return dot > 0 ? joined.slice(0, dot) : joined;
  } catch {
    return null;
  }
}
