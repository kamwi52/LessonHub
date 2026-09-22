import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/lib/server/auth';
import { getPlanById, duplicatePlan } from '@/lib/server/models/Plan';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ planId: string }> }
) {
  // Check authentication
  const authError = await authMiddleware(request);
  if (authError) return authError;

  if (!request.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { planId } = await params;
    const body = await request.json();
    const { newTerm, newWeek } = body;

    if (newTerm === undefined) {
      return NextResponse.json({ error: 'newTerm is required' }, { status: 400 });
    }

    const originalPlan = await getPlanById(parseInt(planId));
    if (!originalPlan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Create duplicate with new term/week
    const newPlan = await duplicatePlan(
      parseInt(planId),
      newTerm,
      newWeek
    );

    return NextResponse.json(newPlan, { status: 201 });
  } catch (error) {
    console.error('Duplicate plan error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
