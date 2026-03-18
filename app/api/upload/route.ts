import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: "This endpoint is deprecated. Use POST /api/files/upload instead.",
    },
    { status: 410 },
  );
}
