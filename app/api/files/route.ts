import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, isMongoConnectivityError } from "@/src/lib/db";
import { requireAuth } from "@/src/lib/requestAuth";
import { FileModel } from "@/src/models/File";
import { CATEGORIES, isCategory, type Category } from "@/src/lib/categories";

export const runtime = "nodejs";

type FileResponse = {
  id: string;
  fileName: string;
  fileUrl: string;
  category: Category;
  uploadedAt: Date;
};

export async function GET(req: NextRequest) {
  try {
    const debug = process.env.DOCSORT_DEBUG === "1";
    const user = await requireAuth(req);

    try {
      await connectToDatabase();
    } catch (error) {
      if (isMongoConnectivityError(error)) {
        if (debug)
          console.error("[api/files GET] mongo connectivity error", error);
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

    const files = await FileModel.find({ userId: user.id })
      .sort({ uploadedAt: -1 })
      .select({ fileName: 1, fileUrl: 1, category: 1, uploadedAt: 1 })
      .lean();

    const normalized: FileResponse[] = files.map((f) => {
      const raw = typeof f.category === "string" ? f.category : "Others";
      const mapped = raw === "Agreements" ? "Legal" : raw;
      const safeCategory: Category = isCategory(mapped) ? mapped : "Others";

      return {
        id: f._id.toString(),
        fileName: f.fileName,
        fileUrl: f.fileUrl,
        category: safeCategory,
        uploadedAt: f.uploadedAt,
      };
    });

    const grouped = CATEGORIES.map((category) => ({
      category,
      files: normalized.filter((f) => f.category === category),
    })).filter((g) => g.files.length > 0);

    return NextResponse.json({ success: true, grouped }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (process.env.DOCSORT_DEBUG === "1")
      console.error("[api/files GET] error", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
