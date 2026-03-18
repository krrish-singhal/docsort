import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase, isMongoConnectivityError } from "@/src/lib/db";
import { User } from "@/src/models/User";
import { signAccessToken } from "@/src/lib/auth";
import { FileModel } from "@/src/models/File";

const GUEST_COOKIE = "docsort_guest";

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

    const body = (await req.json()) as { email?: string; password?: string };

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password required" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email }).lean();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 },
      );
    }

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
      { status: 200 },
    );

    res.cookies.set("docsort_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60,
    });

    if (guestId) {
      res.cookies.set(GUEST_COOKIE, "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
      });
    }

    return res;
  } catch (error) {
    console.error("[auth/login] error", error);
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
