import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  void request;
  return NextResponse.json(
    {
      success: false,
      error: "This endpoint is deprecated. Use /api/files (per-user).",
    },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}
