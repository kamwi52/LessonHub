# LessonsHub

Digital Lesson Plan & Scheme of Work system for teachers.

**One app, one platform.** The UI and the API live in the same Next.js project,
so there is a single thing to run, a single thing to deploy, and only three
environment variables.

- **App + API:** Next.js 14 (React, TypeScript, Tailwind)
- **Database:** PostgreSQL (Supabase)
- **Hosting:** Vercel

---

## Quick start

```bash
npm run install:all                    # install dependencies
cp .env.example frontend/.env.local    # then edit frontend/.env.local
npm run dev                            # http://localhost:3000
```

The API is served from the same origin at `/api/*` — there is no second server,
no CORS setup, and no API URL to configure.

### Environment variables

Only three, read from `frontend/.env.local` locally and from
**Vercel → Settings → Environment Variables** in production:

| Variable | Notes |
| --- | --- |
| `DATABASE_URL` | Postgres connection string. See the Supabase note below. |
| `JWT_SECRET` | Any long random string: `node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"` |
| `JWT_EXPIRY` | e.g. `7d` |

### ⚠️ Supabase: use the pooler host, not `db.<ref>.supabase.co`

`db.<your-ref>.supabase.co` has an **IPv6-only** DNS record. Vercel's servers
are IPv4-only, so the connection hangs and every API call returns
`500 Internal Server Error`.

Use the **Connection Pooler** string instead (Supabase → **Connect** → Transaction pooler):

```
postgresql://postgres.<project-ref>:<URL-ENCODED-PASSWORD>@aws-1-<region>.pooler.supabase.com:6543/postgres
```

**URL-encode the password**, otherwise the connection string is misparsed:

| char | `@` | `?` | `#` | `%` | `!` | `+` | `/` | `:` | `&` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| encode | `%40` | `%3F` | `%23` | `%25` | `%21` | `%2B` | `%2F` | `%3A` | `%26` |

---

## Database setup

Paste [`database/schema.sql`](database/schema.sql) into the Supabase **SQL
Editor** and press Run. It creates the `users` and `plans` tables, the indexes,
and four demo accounts:

| Email | Role |
| --- | --- |
| `teacher1@devschool.local` | teacher |
| `teacher2@devschool.local` | teacher |
| `coordinator@devschool.local` | coordinator |
| `admin@devschool.local` | admin |

Password for all four: `devpass123`.

The file is idempotent — running it again repairs the demo passwords instead of
duplicating rows.

### Verify the connection

```bash
npm run db:check
```

Read-only. It warns about the IPv6 trap above, checks the tables exist, and
confirms each demo account can really log in.

---

## Deploy

Push to `master` — Vercel builds automatically once the repo is connected. Or:

```bash
npm run deploy          # vercel --prod
```

Set the three environment variables in Vercel and tick **both** Production and
Preview, or preview deployments will fail.

### If something breaks in production

Open **`https://<your-app>.vercel.app/api/health`**. It reports whether each
variable is set, whether the database is reachable, and whether the tables
exist — turning an opaque 500 into a specific message.

---

## Project structure

```
LessonsHub/
├── frontend/                     # the whole application
│   ├── scripts/db-check.mjs      # npm run db:check
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/              # the API (serverless route handlers)
│   │   │   │   ├── health/       # diagnostics — start here when debugging
│   │   │   │   ├── auth/         # login, register
│   │   │   │   ├── users/        # current user
│   │   │   │   └── plans/        # list, create, read, update, delete, duplicate
│   │   │   └── ...               # pages (login, register, dashboard, plans, learn)
│   │   ├── lib/server/           # server-only: database, jwt, auth, models
│   │   ├── lib/api.ts            # browser API client
│   │   └── store/                # zustand state (persisted auth session)
│   └── package.json
├── database/schema.sql           # the entire schema + demo data
└── .env.example
```

---

## API reference

All endpoints are same-origin and — except health, login and register — require
an `Authorization: Bearer <token>` header.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Deployment diagnostics |
| `POST` | `/api/auth/register` | Create an account, returns a token |
| `POST` | `/api/auth/login` | Sign in, returns a token |
| `GET` | `/api/users/me` | Current user |
| `GET` | `/api/plans` | Plans for the signed-in teacher (`limit`, `offset`) |
| `POST` | `/api/plans/create` | Create a plan |
| `GET` | `/api/plans/[planId]` | One plan |
| `PUT` | `/api/plans/[planId]` | Update a plan |
| `DELETE` | `/api/plans/[planId]` | Delete a plan |
| `POST` | `/api/plans/[planId]/duplicate` | Copy a plan to another term/week |
| `GET` | `/api/plans/subject` | By subject/grade/term (coordinator, admin) |

---

## Removed in the simplification

The project previously ran an Express backend plus Postgres in Docker and
needed two or three hosting accounts. Those are gone: no `backend/`, no
`docker-compose.yml`, no Docker, no `NEXT_PUBLIC_API_URL`, no CORS setup.

## License

TBD
