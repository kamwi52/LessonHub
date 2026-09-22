import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, TokenPayload } from './jwt';

// Extend NextRequest to include user property
declare module 'next/server' {
  interface NextRequest {
    user?: TokenPayload;
  }
}

export async function authMiddleware(request: NextRequest) {
  const authorization = request.headers.get('authorization');

  if (!authorization) {
    return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 });
  }

  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer') {
    return NextResponse.json({ error: 'Invalid authorization scheme' }, { status: 401 });
  }

  try {
    const payload = verifyToken(token);
    request.user = payload;
    return null; // Continue to handler
  } catch (error) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}

export function requireRole(...roles: string[]) {
  return async (request: NextRequest) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }
    return null; // Continue to handler
  };
}
