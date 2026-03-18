import type { NextRequest } from 'next/server';
import { getBearerToken, verifyAccessToken } from '@/src/lib/auth';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export async function requireAuth(req: NextRequest): Promise<AuthUser> {
  const token = getBearerToken(req) ?? req.cookies.get('docsort_token')?.value ?? null;
  if (!token) {
    throw new Error('UNAUTHORIZED');
  }

  const payload = await verifyAccessToken(token);
  return { id: payload.sub, email: payload.email, name: payload.name };
}
