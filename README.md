# LessonsHub - Digital Lesson Plan & Scheme of Work System

A comprehensive web application for teachers to create, organize, and share lesson plans with built-in curriculum tracking and compliance auditing.

## Tech Stack

- **Frontend:** Next.js 14+ (React), TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL 15
- **DevOps:** Docker, Docker Compose

## Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Git

## Quick Start

### 1. Clone and Setup

```bash
# Copy environment variables
cp .env.example .env

# Install root dependencies
npm install
```

### 2. Start Development Environment

```bash
# Start all services (PostgreSQL, Backend, Frontend)
npm run dev

# Frontend will be at: http://localhost:3000
# Backend API at: http://localhost:3001
```

### 3. View Logs

```bash
# Watch all service logs
npm run dev:logs

# Or logs for specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f postgres
```

## Project Structure

```
LessonsHub/
├── frontend/                 # Next.js web application
│   ├── src/
│   │   ├── app/             # Next.js app directory
│   │   ├── components/      # Reusable React components
│   │   ├── lib/             # Utilities and API clients
│   │   ├── styles/          # Global styles
│   │   └── types/           # TypeScript types
│   ├── package.json
│   └── Dockerfile.dev       # Development Docker image
│
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── models/          # Database models & queries
│   │   ├── middleware/      # Express middleware
│   │   ├── utils/           # Helper functions
│   │   ├── config/          # Configuration
│   │   └── server.ts        # Express server setup
│   ├── package.json
│   └── Dockerfile           # Production Docker image
│
├── database/                # Database initialization & migrations
│   ├── init.sql             # Initial schema
│   └── migrations/          # Migration scripts
│
├── docker-compose.yml       # Orchestrates all services
├── .env.example             # Environment template
└── PRODUCT_SPECIFICATION.md # Product requirements doc
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
