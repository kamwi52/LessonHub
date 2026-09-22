import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/lib/server/auth';
import { getPlanById, updatePlan, deletePlan } from '@/lib/server/models/Plan';

export async function GET(
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
    const plan = await getPlanById(parseInt(planId));

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Check authorization
    if (!request.user || (plan.teacher_id !== request.user.userId && request.user.role === 'teacher')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error('Get plan error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
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
    const plan = await getPlanById(parseInt(planId));

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Check authorization
    if (plan.teacher_id !== request.user.userId && request.user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const updatedPlan = await updatePlan(parseInt(planId), body);
    return NextResponse.json(updatedPlan);
  } catch (error) {
    console.error('Update plan error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
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
    const plan = await getPlanById(parseInt(planId));

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Check authorization
    if (plan.teacher_id !== request.user.userId && request.user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const deleted = await deletePlan(parseInt(planId));
    if (!deleted) {
      return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete plan error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

