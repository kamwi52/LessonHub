import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/lib/server/auth';
import { createPlan } from '@/lib/server/models/Plan';

export async function POST(request: NextRequest) {
  // Check authentication
  const authError = await authMiddleware(request);
  if (authError) return authError;

  if (!request.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const planData = {
      ...body,
      school_id: request.user.schoolId,
      teacher_id: request.user.userId,
    };

    const plan = await createPlan(planData);
    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error('Create plan error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
