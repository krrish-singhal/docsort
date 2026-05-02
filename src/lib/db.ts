import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var __mongooseConn:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined;
}

const globalForMongoose = globalThis as typeof globalThis & {
  __mongooseConn?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

const cached = globalForMongoose.__mongooseConn ?? {
  conn: null,
  promise: null,
};

globalForMongoose.__mongooseConn = cached;

export function isMongoConnectivityError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const name =
    "name" in error ? String((error as { name?: unknown }).name ?? "") : "";
  const message =
    "message" in error
      ? String((error as { message?: unknown }).message ?? "")
      : "";

  if (
    name === "MongooseServerSelectionError" ||
    name === "MongoServerSelectionError" ||
    name === "MongoNetworkError" ||
    name === "MongooseError"
  )
    return true;

  if (
    /could not connect/i.test(message) ||
    /server selection timed? ?out/i.test(message) ||
    /connection timed? ?out/i.test(message) ||
    /ECONNREFUSED/i.test(message) ||
    /network.*error/i.test(message) ||
    /whitelist|allowlist|ip.*not.*allowed/i.test(message)
  )
    return true;

  return false;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 6_000,
      connectTimeoutMS: 6_000,
      socketTimeoutMS: 12_000,
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    throw error;
  }
}
