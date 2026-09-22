# LessonsHub - Digital Lesson Plan & Scheme of Work System

A comprehensive web application for teachers to create, organize, and share lesson plans with built-in curriculum tracking and compliance auditing.

## Tech Stack

- **Frontend & API:** Next.js 14+ (React), TypeScript, Tailwind CSS
- **API Routes:** Next.js API Routes (Serverless Functions)
- **Database:** PostgreSQL 15
- **Deployment:** Vercel (single platform)

## Prerequisites

- Node.js 18+ (for local development)
- Git
- PostgreSQL database (local or managed like Neon/Supabase)

## Quick Start

### 1. Clone and Setup

```bash
# Copy environment variables
cp .env.example .env

# Install dependencies
cd frontend
npm install
```

### 2. Start Development Environment

```bash
# Start the app (frontend + API + database connection)
npm run dev

# App will be at: http://localhost:3000
# API routes at: http://localhost:3000/api/*
```

### 3. View Logs

```bash
# Frontend logs are shown in the terminal
# For database logs, check your PostgreSQL provider's dashboard
```

## Project Structure

```
LessonsHub/
├── frontend/                 # Next.js web application + API routes
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/         # API routes (replaces Express backend)
│   │   │   │   ├── auth/    # Authentication endpoints
│   │   │   │   ├── plans/   # Plan management endpoints
│   │   │   │   └── users/   # User endpoints
│   │   │   ├── components/  # Reusable React components
│   │   │   ├── lib/         # Utilities and API clients
│   │   │   │   └── server/  # Server-side utilities (DB, JWT, auth)
│   │   │   ├── styles/      # Global styles
│   │   │   └── types/       # TypeScript types
│   │   ├── package.json
│   │   └── next.config.js
│   │
├── .env.example              # Environment template
├── vercel.json               # Vercel deployment config
└── PRODUCT_SPECIFICATION.md  # Product requirements doc
```

## Development Workflow

### Local Development (Without Docker)

If you prefer running services locally:

```bash
# Terminal 1: Start PostgreSQL (via Docker)
docker-compose up postgres

# Terminal 2: Start Backend
cd backend
npm install
npm run dev

# Terminal 3: Start Frontend
cd frontend
npm install
npm run dev
```

### Database Migrations

Migrations run automatically on container startup. To manually reset:

```bash
npm run db:reset
```

### API Documentation

API endpoints are documented in `backend/API.md` (will be created during development)

## Features (MVP - Phase 1)

- [x] User authentication (JWT-based)
- [x] Plan creation with structured forms
- [x] Hierarchical plan organization (School > Subject > Grade > Term)
- [x] Plan reusability (copy & adapt from past years)
- [x] Within-school sharing & permissions
- [x] PDF export
- [x] Coordinator curriculum mapping dashboard
- [x] Comments & feedback on plans
- [x] Role-based access control (Teacher/Coordinator/Admin)
- [x] Plan versioning & audit trails

## Future Phases

**Phase 2 (0-6 months post-launch):**
- Advanced search & filtering
- Template library
- Bulk plan upload (OCR)
- Curriculum alignment tagging
- Cross-school sharing (read-only)
- Mobile app (read-only)

**Phase 3+ (6+ months):**
- AI-powered suggestions
- Lesson delivery integration
- Student outcome tracking
- Differentiation assistant
- SIS integration

## Deployment

### Production Build

```bash
# Build Docker images for production
docker-compose -f docker-compose.prod.yml build

# Push to Docker registry (configure accordingly)
docker push your-registry/lessonshub:latest
```

### Environment Variables (Production)

Before deploying, update these critical variables:

```
JWT_SECRET=<strong_random_key>
DATABASE_URL=<production_postgres_url>
CORS_ORIGIN=<production_domain>
NODE_ENV=production
```

## Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm run test:backend
npm run test:frontend

# Watch mode
npm run test:backend -- --watch
```

## Contributing

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Commit changes: `git commit -m 'Add feature'`
3. Push to branch: `git push origin feature/feature-name`
4. Open a Pull Request

## Troubleshooting

### PostgreSQL Connection Refused

```bash
# Restart database service
docker-compose restart postgres

# Or reset completely
npm run db:reset
```

### Port Already in Use

```bash
# Kill process on port 3000 (frontend)
# Windows: netstat -ano | findstr :3000

# Change ports in docker-compose.yml if needed
```

### Hot Reload Not Working

```bash
# Check volume mounts in docker-compose.yml
# Restart services
npm run dev:down
npm run dev
```

## Support

For issues or questions, refer to the PRODUCT_SPECIFICATION.md for context on the vision and requirements.

## License

TBD

---

## Deploy to Vercel (Frontend)

This project's frontend (Next.js) is ready for Vercel deployment. The backend is a separate Express server that needs its own hosting.

### Frontend Deployment (Vercel)

1. **Push to GitHub** - Commit and push your code
2. **Import in Vercel** - Go to [vercel.com](https://vercel.com), click "Add New Project", select your repo
3. **Configure Environment Variables** in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-api-url.com
   ```
   (This should point to your deployed backend)
4. **Deploy** - Vercel auto-detects Next.js and builds automatically

Or deploy from CLI:
```bash
cd frontend
vercel --prod
```

### Backend Deployment (Separate Service)

The backend uses Express with PostgreSQL - deploy it on:

- **Render** (render.com) - Easy Node.js + PostgreSQL hosting
- **Railway** (railway.app)
- **Fly.io**
- Any VPS with Node.js + PostgreSQL

Backend requirements:
- Node.js 18+
- PostgreSQL database
- Environment variables: `DATABASE_URL`, `JWT_SECRET`, `PORT`

### Connecting Frontend to Backend

Once both are deployed:
1. Get your backend URL (e.g., `https://api.yourapp.onrender.com`)
2. Set `NEXT_PUBLIC_API_URL` to that URL in Vercel's environment variables
3. Redeploy frontend

### Local Development

```bash
# Start everything locally
npm run dev

# Frontend: http://localhost:3000
# Backend:  http://localhost:3001
# PostgreSQL: localhost:5432

# Login credentials (password for all): devpass123
# - teacher1@devschool.local
# - teacher2@devschool.local
# - coordinator@devschool.local
# - admin@devschool.local
```
