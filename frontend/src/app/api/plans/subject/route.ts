import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware, requireRole } from '@/lib/server/auth';
import { getPlansByGradeSubjectTerm } from '@/lib/server/models/Plan';

export async function GET(request: NextRequest) {
  // Check authentication
  const authError = await authMiddleware(request);
  if (authError) return authError;

  if (!request.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check role permission
  const roleError = await requireRole('coordinator', 'admin')(request);
  if (roleError) return roleError;

  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const grade = searchParams.get('grade');
    const term = searchParams.get('term');

    if (!subject || !grade || !term) {
      return NextResponse.json({ error: 'Missing query parameters: subject, grade, term' }, { status: 400 });
    }

    const plans = await getPlansByGradeSubjectTerm(
      request.user.schoolId,
      subject,
      parseInt(grade),
      parseInt(term)
    );

    return NextResponse.json(plans);
  } catch (error) {
    console.error('Get plans by subject error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
