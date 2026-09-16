# LessonsHub - Development Guide

## Getting Started

### Prerequisites

- **Docker & Docker Compose** (recommended for simplicity)
- **Node.js 18+** (if running services locally without Docker)
- **Git** for version control

---

## Quick Start (Using Docker)

### 1. Clone & Setup

```bash
# Copy the workspace to your local machine
cd LessonsHub

# Create environment file
cp .env.example .env

# You can use the default .env values for local development
```

### 2. Start All Services

```bash
# Start PostgreSQL, Backend, and Frontend
npm run dev

# This will:
# - Build Docker images for backend and frontend
# - Start PostgreSQL database on port 5432
# - Start Express backend on port 3001
# - Start Next.js frontend on port 3000
```

### 3. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Database:** localhost:5432

### 4. Demo Login

Use these credentials to test the system:

| Role | Email | Password |
|------|-------|----------|
| Teacher | `teacher1@devschool.local` | (any password) |
| Coordinator | `coordinator@devschool.local` | (any password) |
| Admin | `admin@devschool.local` | (any password) |

**Note:** Authentication is stubbed in development. Any password will work with these emails.

---

## Local Development (Without Docker)

If you prefer running services locally:

### Terminal 1: Start PostgreSQL (via Docker)

```bash
docker-compose up postgres
```

### Terminal 2: Start Backend

```bash
cd backend
npm install
npm run dev

# Backend will run on http://localhost:3001
```

### Terminal 3: Start Frontend

```bash
cd frontend
npm install
npm run dev

# Frontend will run on http://localhost:3000
```

---

## Project Structure

```
LessonsHub/
├── PRODUCT_SPECIFICATION.md    # Product requirements & vision
├── README.md                    # User-facing project info
├── DEV_GUIDE.md                 # This file
├── docker-compose.yml           # Docker orchestration
├── .env.example                 # Environment template
├── package.json                 # Root dependencies
│
├── frontend/                    # Next.js React app
│   ├── src/
│   │   ├── app/                # Next.js app directory (pages)
│   │   │   ├── layout.tsx      # Root layout with sidebar
│   │   │   ├── login/          # Login page
│   │   │   ├── dashboard/      # Main dashboard
│   │   │   ├── plans/          # Plans listing
│   │   │   ├── plans/create/   # Plan creation form
│   │   │   └── page.tsx        # Home (redirects to dashboard)
│   │   ├── components/         # Reusable components
│   │   ├── lib/                # Utilities
│   │   │   └── api.ts          # API client (axios wrapper)
│   │   ├── store/              # Zustand state management
│   │   │   └── index.ts        # Auth & UI stores
│   │   ├── types/              # TypeScript types
│   │   │   └── index.ts        # Shared types
│   │   └── styles/             # Global styles
│   ├── next.config.js          # Next.js configuration
│   ├── tsconfig.json           # TypeScript config
│   └── package.json
│
├── backend/                     # Express.js API server
│   ├── src/
│   │   ├── server.ts           # Express app setup
│   │   ├── routes/             # API endpoints
│   │   │   ├── auth.ts         # /api/auth (login, register)
│   │   │   ├── users.ts        # /api/users (get user info)
│   │   │   └── plans.ts        # /api/plans (CRUD operations)
│   │   ├── models/             # Database queries
│   │   │   ├── User.ts         # User model
│   │   │   └── Plan.ts         # Plan model
│   │   ├── middleware/         # Express middleware
│   │   │   └── auth.ts         # JWT authentication
│   │   ├── utils/              # Utility functions
│   │   │   └── jwt.ts          # JWT token handling
│   │   └── config/
│   │       └── database.ts     # PostgreSQL connection
│   ├── Dockerfile              # Production image
│   ├── tsconfig.json           # TypeScript config
│   └── package.json
│
└── database/                    # Database configuration
    ├── init.sql                 # Initial schema (auto-runs on startup)
    └── migrations/              # Future migration scripts
```

---

## Common Development Tasks

### View Application Logs

```bash
# All services
npm run dev:logs

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f postgres
```

### Stop Services

```bash
npm run dev:down
# Or press Ctrl+C in the terminal running 'npm run dev'
```

### Reset Database

```bash
# Reset PostgreSQL (deletes all data)
npm run db:reset

# This stops the postgres container and restarts it
```

### Database Access (psql)

```bash
# If PostgreSQL is running in Docker:
docker-compose exec postgres psql -U lessonshub_user -d lessonshub_dev

# Then you can run SQL commands:
# \dt                           # List all tables
# SELECT * FROM users;          # View users
# SELECT * FROM plans;          # View plans
# \q                            # Exit psql
```

### Run Tests

```bash
# All tests
npm test

# Backend tests only
npm run test:backend

# Frontend tests only
npm run test:frontend

# Watch mode
npm run test:backend -- --watch
```

---

## Development Workflow

### Creating a New API Endpoint

1. **Define the route in `backend/src/routes/`**
   ```typescript
   // e.g., backend/src/routes/mycustom.ts
   import { Router, Request, Response } from 'express';
   import { authMiddleware } from '../middleware/auth';

   const router = Router();

   router.post('/', authMiddleware, async (req: Request, res: Response) => {
     // Your logic here
     res.json({ message: 'Success' });
   });

   export default router;
   ```

2. **Register the route in `backend/src/server.ts`**
   ```typescript
   import myCustomRoutes from './routes/mycustom';
   app.use('/api/mycustom', myCustomRoutes);
   ```

3. **Restart the backend**
   ```bash
   docker-compose restart backend
   ```

### Creating a New Frontend Page

1. **Create file in `frontend/src/app/`**
   ```typescript
   // e.g., frontend/src/app/mypage/page.tsx
   'use client';
   
   export default function MyPage() {
     return <div>My Page</div>;
   }
   ```

2. **Add navigation link in `frontend/src/app/layout.tsx`**
   ```typescript
   <NavLink href="/mypage" icon="🔧" label="My Page" open={sidebarOpen} />
   ```

### Working with TypeScript

- Frontend types: `frontend/src/types/index.ts`
- Backend types: Inline in route files or create `backend/src/types/`
- Share types between frontend and backend when needed

### Debugging

**Backend:**
```bash
# Add console.log statements
console.log('Debug info:', variable);

# View in logs:
npm run dev:logs
```

**Frontend:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Use React DevTools browser extension

---

## Key Architecture Patterns

### Authentication Flow

```
1. User enters email/password on login page
2. Frontend sends POST /api/auth/login
3. Backend validates credentials, returns JWT token
4. Frontend stores token in localStorage
5. API client automatically includes token in all requests
6. Backend middleware (authMiddleware) validates token on protected routes
7. Token expires after 7 days (configurable via JWT_EXPIRY)
```

### API Client Pattern

The frontend uses an `apiClient` instance (`frontend/src/lib/api.ts`) that:
- Wraps axios with automatic token injection
- Handles response errors (redirect to login on 401)
- Provides typed methods for each API endpoint

**Usage in components:**
```typescript
import { apiClient } from '@/lib/api';

// Login
await apiClient.login(email, password);

// Get plans
const response = await apiClient.getPlans({ limit: 10 });

// Create plan
await apiClient.createPlan(planData);
```

### State Management

**Zustand stores** (`frontend/src/store/index.ts`):
- `useAuthStore`: Current user, authentication state
- `useUIStore`: Sidebar open/closed, UI state

**Usage in components:**
```typescript
'use client';
import { useAuthStore } from '@/store';

export default function MyComponent() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  
  return <div>{user?.first_name}</div>;
}
```

---

## Database Schema Overview

### Main Tables

**`schools`**
- School information (name, location, type)

**`users`**
- Teachers, coordinators, admins
- Fields: email, first_name, last_name, role, subjects_taught

**`plans`**
- Lesson plans with all content
- Fields: title, subject, grade, term, week, learning_objectives, activities, assessment, etc.
- Status: draft, in_progress, published, archived

**`plan_sharing`**
- Permissions for sharing plans with colleagues
- Fields: plan_id, shared_with_user_id, permission (view/comment/edit)

**`plan_comments`**
- Feedback on plans
- Fields: plan_id, author_id, content, is_resolved

**`plan_versions`**
- Version history for plans
- Tracks all changes to a plan over time

---

## Frontend Stack Decisions

### Next.js App Directory
- Modern file-based routing
- Server and client components built-in
- Built-in API routes (though we use separate Express backend)

### Tailwind CSS
- Utility-first CSS framework
- Pre-configured with custom colors (primary, success, error, etc.)
- Responsive design out-of-the-box

### Zustand for State Management
- Lightweight alternative to Redux
- Simple store definition and usage
- Minimal boilerplate

### React Hook Form
- Efficient form handling
- Minimal re-renders
- Built-in validation

---

## Backend Stack Decisions

### Express.js
- Minimalist, unopinionated framework
- Perfect for custom API design
- Strong ecosystem for middleware

### PostgreSQL
- Relational database ideal for structured data (plans, schools, users)
- JSONB support for flexible fields (learning_objectives, curriculum_alignment)
- Excellent for transactional data

### JWT Authentication
- Stateless authentication
- Scales well (no server-side session storage needed)
- Can be extended to support refresh tokens

---

## Known Limitations & TODOs

### Phase 1 MVP (Current)
- ❌ Cross-school sharing (will add in Phase 2)
- ❌ AI suggestions (Phase 3)
- ❌ PDF export fully implemented (stub endpoint)
- ❌ Curriculum alignment auto-detection (Phase 2)
- ❌ Mobile app (Phase 3)
- ❌ SIS integration (Phase 3)
- ⚠️ Password authentication is stubbed (any password works in dev)

### Features to Build Next
1. Plan CRUD with all form fields
2. Sharing & permissions system
3. Comments/feedback on plans
4. Curriculum mapping dashboard for coordinators
5. PDF export implementation
6. Advanced search and filtering

---

## Troubleshooting

### "ERR_PEERLS_UNABLE_TO_VERIFY" or SSL Errors
Usually not a problem in development. If persistent:
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Refused
```bash
# Check if PostgreSQL container is running
docker-compose ps

# Restart database
docker-compose restart postgres

# Wait 10 seconds for it to be ready
docker-compose logs postgres | tail -20
```

### Frontend Can't Reach Backend
- Verify backend is running: `docker-compose logs backend`
- Check CORS_ORIGIN in .env matches your frontend URL
- Check NEXT_PUBLIC_API_URL in frontend env

### "Address already in use" Port Error
```bash
# See what's using the port
# Windows:
netstat -ano | findstr :3000

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or change ports in docker-compose.yml
```

### Tests Failing
```bash
# Make sure dependencies are installed
npm install

# Clear Jest cache
npm test -- --clearCache

# Run with verbose output
npm test -- --verbose
```

---

## Performance Tips

1. **Database Queries:**
   - Add indexes for frequently filtered columns (done in init.sql)
   - Use LIMIT/OFFSET for pagination
   - Profile slow queries with EXPLAIN

2. **Frontend:**
   - Use Next.js Image component for images
   - Lazy load components with React.lazy() + Suspense
   - Monitor bundle size: `npm run build`

3. **API:**
   - Implement caching for read-heavy endpoints
   - Compress responses (gzip middleware)
   - Rate limiting for auth endpoints

---

## Next Steps After MVP

1. **User testing:** Run with 2-3 pilot schools
2. **Feature feedback:** Iterate based on user research
3. **Phase 2 features:** Templates, advanced search, API integrations
4. **Deployment:** Set up CI/CD (GitHub Actions), production database, monitoring

---

## Resources & Documentation

- **Frontend:** [Next.js Docs](https://nextjs.org/docs), [React Docs](https://react.dev)
- **Backend:** [Express Docs](https://expressjs.com), [PostgreSQL Docs](https://www.postgresql.org/docs/)
- **Styling:** [Tailwind CSS Docs](https://tailwindcss.com/docs)
- **State:** [Zustand Docs](https://github.com/pmndrs/zustand)
- **Product Vision:** See PRODUCT_SPECIFICATION.md

---

## Questions?

Refer to PRODUCT_SPECIFICATION.md for product questions, or the README.md for general information about the system.

Happy coding! 🚀
