import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAuth } from "@/src/lib/requestAuth";

export const runtime = "nodejs";

const GUEST_COOKIE = "docsort_guest";
const GUEST_MAX_AGE_SECONDS = 60 * 60 * 24; // 24h

function isHttpsRequest(req: NextRequest): boolean {
  const forwarded = req.headers.get("x-forwarded-proto");
  const proto = (
    forwarded?.split(",")[0]?.trim() || req.nextUrl.protocol
  ).replace(":", "");
  return proto === "https";
}

export async function GET(req: NextRequest) {
  try {
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

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { success: false, error: "Cloudinary is not configured" },
        { status: 500 },
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const ownerFolder = user ? user.id : `guest/${guestId}`;
    const folder = `uploads/${ownerFolder}/incoming`;

    // Cloudinary requires signing the exact set of params sent (excluding file/api_key/signature).
    // Use string values for booleans for compatibility with Cloudinary signing.
    const paramsToSign: Record<string, string | number> = {
      folder,
      timestamp,
      use_filename: "true",
      unique_filename: "true",
    };

    // Import lazily to avoid configuring Cloudinary globally in edge runtimes.
    const { v2: cloudinary } = await import("cloudinary");
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      apiSecret,
    );

    const res = NextResponse.json(
      {
        success: true,
        cloudName,
        apiKey,
        timestamp,
        folder,
        signature,
        useFilename: true,
        uniqueFilename: true,
        resourceType: "auto",
      },
      { status: 200 },
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
    if (process.env.DOCSORT_DEBUG === "1")
      console.error("[files/upload/signature] error", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
