import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase, isMongoConnectivityError } from "@/src/lib/db";
import { User } from "@/src/models/User";
import { signAccessToken } from "@/src/lib/auth";
import { FileModel } from "@/src/models/File";

const GUEST_COOKIE = "docsort_guest";

function isHttpsRequest(req: NextRequest): boolean {
  const forwarded = req.headers.get("x-forwarded-proto");
  const proto = (
    forwarded?.split(",")[0]?.trim() || req.nextUrl.protocol
  ).replace(":", "");
  return proto === "https";
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        {
          success: false,
          error: "Server misconfigured: JWT_SECRET is not set",
        },
        { status: 500 },
      );
    }

    const body = (await req.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!name || !email || !password || password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Invalid name/email/password (min 8 chars)" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const existing = await User.findOne({ email }).select("_id").lean();
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Email already in use" },
        { status: 409 },
      );
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed });

    const token = await signAccessToken({
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    const guestId = req.cookies.get(GUEST_COOKIE)?.value ?? null;
    if (guestId) {
      await FileModel.updateMany(
        { guestId },
        { $set: { userId: user._id }, $unset: { guestId: "" } },
      );
    }

    const res = NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
      { status: 201 },
    );

    res.cookies.set("docsort_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: isHttpsRequest(req),
      path: "/",
      maxAge: 60 * 60,
    });

    if (guestId) {
      res.cookies.set(GUEST_COOKIE, "", {
        httpOnly: true,
        sameSite: "lax",
        secure: isHttpsRequest(req),
        path: "/",
        maxAge: 0,
      });
    }

    return res;
  } catch (error) {
    console.error("[auth/signup] error", error);
    if (isMongoConnectivityError(error)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Database unavailable. If using MongoDB Atlas, ensure your IP is allowlisted and MONGODB_URI is correct.",
        },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
