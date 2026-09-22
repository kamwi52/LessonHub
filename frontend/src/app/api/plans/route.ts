import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/lib/server/auth';
import { getPlansByTeacher } from '@/lib/server/models/Plan';

export async function GET(request: NextRequest) {
  // Check authentication
  const authError = await authMiddleware(request);
  if (authError) return authError;

  if (!request.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const plans = await getPlansByTeacher(request.user.userId, limit, offset);

    return NextResponse.json({
      data: plans,
      limit,
      offset,
      total: plans.length,
    });
  } catch (error) {
    console.error('Get plans error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
