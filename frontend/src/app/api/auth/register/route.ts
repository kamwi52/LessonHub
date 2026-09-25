import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/server/jwt';
import { getUserByEmail, createUser } from '@/lib/server/models/User';
import { isSelfRegisterRole, SELF_REGISTER_ROLES, Role } from '@/types';

/** Kept in sync with the client-side form validation in app/register/page.tsx. */
const MIN_PASSWORD_LENGTH = 6;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, first_name, last_name, school_id, role } = body;

    if (!email || !password || !first_name || !last_name || !school_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
        { status: 400 }
      );
    }

    // Only 'student' and 'teacher' may be self-registered. 'coordinator' and
    // 'admin' are provisioned directly in the database, so a request asking for
    // one is refused here rather than quietly downgraded. Omitting the field
    // falls back to 'teacher' so older clients keep working.
    const requestedRole: unknown = role ?? 'teacher';
    if (!isSelfRegisterRole(requestedRole)) {
      return NextResponse.json(
        { error: `Role must be one of: ${SELF_REGISTER_ROLES.join(', ')}` },
        { status: 400 }
      );
    }
    const assignedRole: Role = requestedRole;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await createUser({
      school_id,
      email,
      password_hash,
      first_name,
      last_name,
      role: assignedRole,
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      schoolId: user.school_id,
      role: user.role,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        school_id: user.school_id,
      },
      access_token: token,
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
