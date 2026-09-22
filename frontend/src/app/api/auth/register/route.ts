import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/server/jwt';
import { getUserByEmail, createUser } from '@/lib/server/models/User';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, first_name, last_name, school_id } = body;

    if (!email || !password || !first_name || !last_name || !school_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

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
      role: 'teacher',
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
