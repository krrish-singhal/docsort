import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase, isMongoConnectivityError } from "@/src/lib/db";
import { requireAuth } from "@/src/lib/requestAuth";
import { getCloudinary } from "@/src/lib/cloudinary";
import { FileModel } from "@/src/models/File";

export const runtime = "nodejs";

function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const debug = process.env.DOCSORT_DEBUG === "1";
    const user = await requireAuth(req);
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid id" },
        { status: 400 },
      );
    }

    try {
      await connectToDatabase();
    } catch (error) {
      if (isMongoConnectivityError(error)) {
        if (debug)
          console.error("[api/files/:id GET] mongo connectivity error", error);
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

    const file = await FileModel.findById(id)
      .select({
        userId: 1,
        fileName: 1,
        fileUrl: 1,
        category: 1,
        uploadedAt: 1,
      })
      .lean();

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 },
      );
    }

    if (file.userId.toString() !== user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        file: {
          id: file._id.toString(),
          fileName: file.fileName,
          fileUrl: file.fileUrl,
          category: file.category,
          uploadedAt: file.uploadedAt,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (process.env.DOCSORT_DEBUG === "1")
      console.error("[api/files/:id GET] error", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const debug = process.env.DOCSORT_DEBUG === "1";
    const user = await requireAuth(req);
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid id" },
        { status: 400 },
      );
    }

    try {
      await connectToDatabase();
    } catch (error) {
      if (isMongoConnectivityError(error)) {
        if (debug)
          console.error(
            "[api/files/:id DELETE] mongo connectivity error",
            error,
          );
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

    const file = await FileModel.findById(id)
      .select({ userId: 1, cloudinaryPublicId: 1 })
      .lean();
    if (!file) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 },
      );
    }

    if (file.userId.toString() !== user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }

    const cloud = getCloudinary();
    await cloud.uploader
      .destroy(file.cloudinaryPublicId, { resource_type: "raw" })
      .catch(async () => {
        // If raw fails, try auto (Cloudinary sometimes stores PDFs/images as different types)
        await cloud.uploader
          .destroy(file.cloudinaryPublicId, { resource_type: "image" })
          .catch(() => null);
        await cloud.uploader
          .destroy(file.cloudinaryPublicId, { resource_type: "video" })
          .catch(() => null);
      });

    await FileModel.deleteOne({ _id: id });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (process.env.DOCSORT_DEBUG === "1")
      console.error("[api/files/:id DELETE] error", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
