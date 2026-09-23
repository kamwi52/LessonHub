/**
 * LessonsHub database diagnostics.
 *
 *   npm run db:check          (inside the frontend folder)
 *
 * Reads DATABASE_URL from the environment, falling back to .env.local, then:
 *   1. warns about the most common Supabase setup mistakes
 *   2. checks the database is reachable
 *   3. checks the users / plans tables exist
 *   4. checks the demo accounts can actually log in with devpass123
 *
 * Everything is read-only. Safe to run any time.
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  const file = join(here, '..', '.env.local');
  if (!existsSync(file)) return;
  for (const raw of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const DEMO_PASSWORD = 'devpass123';
const DEMO_EMAILS = [
  'teacher1@devschool.local',
  'teacher2@devschool.local',
  'coordinator@devschool.local',
  'admin@devschool.local',
];

function fail(message) {
  console.error(`\n  x ${message}\n`);
  process.exit(1);
}

console.log('\nLessonsHub database check\n=========================');

const url = process.env.DATABASE_URL;

if (!url) {
  fail('DATABASE_URL is not set. Add it to frontend/.env.local (see .env.example).');
}

console.log('  DATABASE_URL   set');

// --- the two mistakes that cause almost every "500" on Vercel -------------
let host = '';
try {
  host = new URL(url).hostname;
} catch {
  fail('DATABASE_URL is not a valid URL. It must start with postgresql://');
}

if (/^db\..*\.supabase\.co$/.test(host)) {
  fail(
    `DATABASE_URL points at "${host}", which is IPv6-only.\n` +
      '    Vercel servers are IPv4-only, so every request fails with 500.\n' +
      '    Use the Connection Pooler host instead:\n' +
      '      postgresql://postgres.<project-ref>:<password>@aws-1-<region>.pooler.supabase.com:6543/postgres'
  );
}

if (!/\.pooler\.supabase\.com$/.test(host) && /supabase\.co$/.test(host)) {
  console.log(`  ! host "${host}" is not a Supabase pooler host - this may not work on Vercel`);
}

console.log(`  host           ${host}`);

// --- connect --------------------------------------------------------------
const { Client } = await import('pg');

const client = new Client({
  connectionString: url,
  ssl: url.includes('sslmode=disable') ? false : { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
});

try {
  await client.connect();
} catch (error) {
  const message = error?.message ?? String(error);
  if (/ENOTFOUND|ETIMEDOUT|EHOSTUNREACH/.test(message)) {
    fail(
      `${message}\n` +
        '    The host cannot be reached from here. If this is a Supabase\n' +
        '    `db.<ref>.supabase.co` host, switch to the pooler host.'
    );
  }
  if (/password authentication failed|28000/.test(message)) {
    fail(
      `${message}\n` +
        '    The password is wrong or not URL-encoded. Encode:\n' +
        '      @ -> %40   ? -> %3F   # -> %23   % -> %25   ! -> %21   + -> %2B'
    );
  }
  fail(message);
}

console.log('  connected      yes');

// --- schema ---------------------------------------------------------------
const tablesResult = await client.query(
  `SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public' AND table_name IN ('users','plans')
   ORDER BY table_name`
);
const tables = tablesResult.rows.map((r) => r.table_name);
const missing = ['users', 'plans'].filter((t) => !tables.includes(t));

console.log(`  tables         ${tables.join(', ') || '(none)'}`);

if (missing.length) {
  console.log('\n  x Missing tables: ' + missing.join(', '));
  console.log('    Fix: open Supabase -> SQL Editor, paste database/schema.sql, press Run.\n');
  await client.end();
  process.exit(1);
}

// --- demo accounts --------------------------------------------------------
const bcrypt = (await import('bcryptjs')).default;

const users = await client.query('SELECT id, email, password_hash FROM users ORDER BY id');
console.log(`  users          ${users.rowCount}`);

let broken = 0;
for (const email of DEMO_EMAILS) {
  const row = users.rows.find((u) => u.email === email);
  if (!row) {
    console.log(`    -  ${email}  (missing)`);
    broken++;
    continue;
  }
  const valid = bcrypt.compareSync(DEMO_PASSWORD, row.password_hash);
  console.log(`    ${valid ? '+' : 'x'}  ${email}  login ${valid ? 'works' : 'BROKEN'}`);
  if (!valid) broken++;
}

await client.end();

if (broken) {
  console.log(
    `\n  ! ${broken} demo account(s) need repair.\n` +
      '    Fix: re-run database/schema.sql in the Supabase SQL editor.\n' +
      '    It uses ON CONFLICT DO UPDATE to reset the demo passwords.\n'
  );
  process.exit(1);
}

console.log('\n  All good. Start the app with: npm run dev\n');
