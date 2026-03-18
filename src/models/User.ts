import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } },
);

export type UserDocument = InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };

export const User: Model<UserDocument> =
  (mongoose.models.User as Model<UserDocument>) || mongoose.model<UserDocument>('User', UserSchema);
