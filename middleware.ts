import { NextResponse, type NextRequest } from 'next/server';
import { getBearerToken, verifyAccessToken } from '@/src/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect folder browsing/preview APIs (must be logged in to view folders/files)
  if (pathname.startsWith('/api/sorted')) {
    if (req.method === 'OPTIONS') return NextResponse.next();

    const token = getBearerToken(req) ?? req.cookies.get('docsort_token')?.value ?? null;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      await verifyAccessToken(token);
    } catch {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/sorted/:path*'],
};
