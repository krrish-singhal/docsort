import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";

const encoder = new TextEncoder();

type JwtPayload = {
  sub: string;
  email: string;
  name: string;
};

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return encoder.encode(secret);
}

export async function signAccessToken(payload: JwtPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(getJwtSecret());
}

export async function verifyAccessToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, getJwtSecret());
  const sub = payload.sub;
  const email = payload.email;
  const name = payload.name;

  if (
    typeof sub !== "string" ||
    typeof email !== "string" ||
    typeof name !== "string"
  ) {
    throw new Error("Invalid token payload");
  }

  return { sub, email, name };
}

export function getBearerToken(req: NextRequest): string | null {
  const header = req.headers.get("authorization");
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}
