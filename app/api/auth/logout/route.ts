import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function isHttpsRequest(req: NextRequest): boolean {
  const forwarded = req.headers.get("x-forwarded-proto");
  const proto = (
    forwarded?.split(",")[0]?.trim() || req.nextUrl.protocol
  ).replace(":", "");
  return proto === "https";
}

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ success: true }, { status: 200 });
  res.cookies.set("docsort_token", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttpsRequest(req),
    path: "/",
    maxAge: 0,
  });
  return res;
}
