import { NextResponse } from 'next/server';
import { query } from '@/lib/server/database';

export const dynamic = 'force-dynamic';

/**
 * Visit /api/health in the browser to see exactly what is misconfigured.
 * This turns an opaque "500 Internal Server Error" into an actionable message.
 */
export async function GET() {
  const env = {
    DATABASE_URL: process.env.DATABASE_URL ? 'set' : 'MISSING',
    JWT_SECRET: process.env.JWT_SECRET ? 'set' : 'MISSING',
    JWT_EXPIRY: process.env.JWT_EXPIRY ? 'set' : 'MISSING',
  };

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { ok: false, step: 'env', env, error: 'DATABASE_URL is not set on this deployment.' },
      { status: 500 }
    );
  }

  if (!/^postgres(ql)?:\/\//.test(process.env.DATABASE_URL)) {
    return NextResponse.json(
      {
        ok: false,
        step: 'env',
        env,
        error:
          'DATABASE_URL must start with postgresql:// - it currently looks like a website URL.',
      },
      { status: 500 }
    );
  }

  try {
    const db = await query('SELECT current_database() AS db, current_user AS usr, NOW() AS now');
    const tables = await query(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name IN ('users', 'plans')
       ORDER BY table_name`
    );
    let userCount: number | null = null;
    try {
      const users = await query('SELECT COUNT(*)::int AS count FROM users');
      userCount = users.rows[0].count;
    } catch {
      userCount = null; // table not created yet
    }

    const found = tables.rows.map((r: any) => r.table_name);
    const missing = ['users', 'plans'].filter((t) => !found.includes(t));

    return NextResponse.json({
      ok: missing.length === 0,
      step: missing.length === 0 ? 'ready' : 'schema',
      env,
      database: { connected: true, ...db.rows[0] },
      tables: { found, missing },
      seededUsers: userCount,
      hint:
        missing.length === 0
          ? 'Everything looks good.'
          : `Run database/schema.sql in the Supabase SQL editor to create: ${missing.join(', ')}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        step: 'database',
        env,
        database: { connected: false },
        error: error?.message || 'Unknown database error',
        hint:
          'Check the password in DATABASE_URL. Special characters must be URL-encoded ' +
          '(e.g. @ -> %40, ? -> %3F, # -> %23, % -> %25, ! -> %21).',
      },
      { status: 500 }
    );
  }
}
