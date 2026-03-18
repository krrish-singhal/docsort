import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import type { Category } from "@/src/lib/categories";

const FileSchema = new Schema(
  {
    // Either `userId` (signed-in uploads) or `guestId` (anonymous uploads) will be set.
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
    guestId: { type: String, required: false, index: true },
    fileName: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String, required: true },
    category: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now, index: true },
    mimeType: { type: String },
    size: { type: Number },
  },
  { versionKey: false },
);

FileSchema.index({ userId: 1, category: 1, uploadedAt: -1 });
FileSchema.index({ guestId: 1, category: 1, uploadedAt: -1 });

export type FileDocument = InferSchemaType<typeof FileSchema> & {
  _id: mongoose.Types.ObjectId;
  category: Category;
};

export const FileModel: Model<FileDocument> =
  (mongoose.models.File as Model<FileDocument>) ||
  mongoose.model<FileDocument>("File", FileSchema);
