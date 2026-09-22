import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/lib/server/auth';
import { getUserById } from '@/lib/server/models/User';

export async function GET(request: NextRequest) {
  // Check authentication
  const authError = await authMiddleware(request);
  if (authError) return authError;

  if (!request.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await getUserById(request.user.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      school_id: user.school_id,
      subjects_taught: user.subjects_taught || [],
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
