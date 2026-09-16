# LessonsHub - Project Documentation Index

Welcome to the LessonsHub development workspace! This file serves as a navigation hub for all project documentation.

## 📚 Documentation Files (Read in This Order)

### 1. **Choose Your Setup Path**

**You have Node.js + HeidiSQL? (Fastest Setup)**
→ **[QUICK_LOCAL_SETUP.md](QUICK_LOCAL_SETUP.md)** ⭐ START HERE

**You have Docker installed?**
→ [QUICK_START.md](QUICK_START.md)

**You want detailed local setup?**
→ [LOCAL_DEV_SETUP.md](LOCAL_DEV_SETUP.md)

### 2. **README.md** 
- **For:** Users and deployment info
- **Duration:** 10 minutes
- **Contains:** Project overview, features, prerequisites
- **Best for:** Understanding what this system is and does

### 5. **PRODUCT_SPECIFICATION.md** 
- **For:** Product managers, stakeholders, architects
- **Duration:** 30 minutes (detailed)  •  10 minutes (skim)
- **Contains:** Complete product vision, user personas, features, business model
- **Best for:** Understanding the WHY and WHAT of the system

### 6. **DEV_GUIDE.md**
- **For:** Developers building the system
- **Duration:** 20 minutes initial  •  Reference throughout
- **Contains:** Architecture, tech stack, how to add features, troubleshooting
- **Best for:** Daily development work and problem-solving

### 7. **SETUP_SUMMARY.md**
- **For:** Project overview after setup
- **Duration:** 15 minutes
- **Contains:** What was built, file listing, architecture diagram
- **Best for:** Understanding the project structure

---

## 🚀 Quick Reference

### Getting Started - Choose Your Path

#### **Option A: Fastest (You have Node.js + HeidiSQL) ⭐**
```powershell
# 1. Install PostgreSQL (5 min)
# 2. Create database with HeidiSQL (5 min)
# 3. Install dependencies (5 min)
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Terminal 1: Start Backend
cd backend && npm run dev

# Terminal 2: Start Frontend  
cd frontend && npm run dev

# Open: http://localhost:3000
```
→ See [QUICK_LOCAL_SETUP.md](QUICK_LOCAL_SETUP.md) for detailed steps

**Total setup time: 15 minutes**

---

#### **Option B: Docker (All-in-one)**
```bash
# Setup (one time)
cp .env.example .env
npm install

# Start everything (one command)
npm run dev

# Open: http://localhost:3000
```
→ See [QUICK_START.md](QUICK_START.md)

**Prerequisites:** Docker Desktop installed

---

#### **Option C: Local Development (Detailed Guide)**
→ See [LOCAL_DEV_SETUP.md](LOCAL_DEV_SETUP.md)

**Total setup time: 30 minutes**

---

### Access Points
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001
- **Database:** HeidiSQL or `localhost:5432`

### Demo Credentials
- **Email:** teacher1@devschool.local
- **Password:** any value (dev mode)

---

## 📁 Project Structure at a Glance

```
LessonsHub/
├── PRODUCT_SPECIFICATION.md    ← Product vision & requirements
├── README.md                   ← User-facing overview
├── DEV_GUIDE.md                ← Developer guide
├── QUICK_START.md              ← Getting started (5 min read)
├── SETUP_SUMMARY.md            ← What was built
├── docker-compose.yml          ← Services orchestration
├── .env.example                ← Configuration template
│
├── frontend/                   ← Next.js React app
│   ├── src/
│   │   ├── app/               ← Pages (login, dashboard, plans)
│   │   ├── lib/api.ts         ← API client
│   │   ├── store/             ← State management (Zustand)
│   │   ├── types/             ← TypeScript types
│   │   └── globals.css        ← Tailwind + custom styles
│   └── package.json
│
├── backend/                    ← Express.js API
│   ├── src/
│   │   ├── routes/            ← API endpoints (auth, users, plans)
│   │   ├── models/            ← Database queries
│   │   ├── middleware/        ← JWT auth & roles
│   │   ├── config/            ← Database connection
│   │   ├── utils/             ← JWT utilities
│   │   └── server.ts          ← Express setup
│   └── package.json
│
└── database/                   ← PostgreSQL setup
    ├── init.sql               ← Database schema
    └── migrations/            ← Migration scripts
```

---

## ✅ What's Done

| Component | Status | Details |
|-----------|--------|---------|
| **Infrastructure** | ✅ 100% | Docker, environment, config files |
| **Backend API** | ✅ 80% | Auth, routes scaffolded; ready for feature building |
| **Frontend** | ✅ 75% | Pages created; forms need API connection |
| **Database** | ✅ 100% | Schema defined, initialized, sample data |
| **Documentation** | ✅ 100% | All guides written |
| **Ready to develop** | ✅ YES | Can start building features now |

---

## 🔄 Development Workflow

### For Frontend Developers
1. Open `frontend/src/app/` to see pages
2. Check `frontend/src/lib/api.ts` to understand API calls
3. Look at `frontend/src/app/layout.tsx` for layout structure
4. Edit components and see live changes via hot reload

### For Backend Developers
1. Edit `backend/src/routes/` for API endpoints
2. Update `backend/src/models/` for database queries
3. Changes reflect immediately via hot reload
4. Test with Postman or `curl` commands

### For DevOps/Database
1. Database config in `docker-compose.yml`
2. Schema in `database/init.sql`
3. Migrations in `database/migrations/`
4. Run `npm run db:reset` to clear data

---

## 📊 Development Priorities

### MVP Phase (Weeks 1-4)
1. Connect form submission to backend (all forms)
2. Load and display plans on pages
3. Add sharing & permissions UI
4. Build coordinator dashboard
5. Implement comments system

### Post-MVP (Weeks 5-8)
6. PDF export
7. Plan templates
8. Advanced search
9. Bulk upload
10. Analytics

See **PRODUCT_SPECIFICATION.md** Section 9 for full roadmap.

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Services won't start | `npm run dev:down` then `npm run dev` |
| Database connection error | `docker-compose restart postgres` then wait 10s |
| Port already in use | Kill process on port or change in docker-compose.yml |
| Can't log in | Check docker logs: `npm run dev:logs` |
| Frontend can't reach backend | Check NEXT_PUBLIC_API_URL in .env |
| Hot reload not working | Restart containers and ensure volumes are mounted |

See **DEV_GUIDE.md** "Troubleshooting" section for more details.

---

## 💻 Technology Stack Summary

| Component | Technology | Why |
|-----------|-----------|-----|
| **Frontend** | Next.js 14 + React 18 | Modern, fast, built-in routing |
| **Styling** | Tailwind CSS | Utility-first, rapid development |
| **State** | Zustand | Lightweight, minimal boilerplate |
| **Backend** | Express.js | Minimal, flexible, well-established |
| **Language** | TypeScript | Type safety, better DX |
| **Database** | PostgreSQL | Relational, JSONB support, reliable |
| **DevOps** | Docker + Compose | Consistent environments, one-command setup |

---

## 📖 By Role

### Product Manager
1. Read **PRODUCT_SPECIFICATION.md** (priority)
2. Glance at **QUICK_START.md** to see it running
3. Reference **README.md** for user-facing messaging

### Developer (Frontend)
1. Read **QUICK_START.md** (5 min)
2. Run `npm run dev`
3. Reference **DEV_GUIDE.md** for how-tos
4. See **PRODUCT_SPECIFICATION.md** section 4 for feature details

### Developer (Backend)
1. Read **QUICK_START.md** (5 min)
2. Run `npm run dev`
3. Reference **DEV_GUIDE.md** section on API endpoints
4. Check `backend/src/models/` for database patterns

### DevOps / Infrastructure
1. Read **README.md** Deployment section
2. Check `docker-compose.yml` for service config
3. See **DEV_GUIDE.md** for local setup
4. Reference `database/init.sql` for schema

### Investor / Stakeholder
1. Read **PRODUCT_SPECIFICATION.md** (executive summary first)
2. Read **README.md** features section
3. See **SETUP_SUMMARY.md** architecture diagram

---

## 🎯 Common Tasks

### "I want to add a new page"
→ Create file in `frontend/src/app/` and add nav link in `layout.tsx`

### "I want to add a new API endpoint"
→ Create file in `backend/src/routes/` and import in `server.ts`

### "I want to understand the database"
→ Open `database/init.sql` and see the schema with comments

### "I want to change authentication"
→ See `backend/src/routes/auth.ts` for login/register logic

### "I want to understand the product vision"
→ Read **PRODUCT_SPECIFICATION.md** sections 1-3 (core problem & features)

### "Something is broken"
→ Run `npm run dev:logs` and check DEV_GUIDE.md troubleshooting

---

## 📞 Help Navigation

| Question | Answer In |
|----------|-----------|
| How do I start the app? | **QUICK_START.md** |
| What is this system? | **README.md** or **PRODUCT_SPECIFICATION.md** |
| How do features work? | **PRODUCT_SPECIFICATION.md** section 4 |
| How do I code? | **DEV_GUIDE.md** |
| How do I deploy? | **README.md** Deployment section |
| What was set up? | **SETUP_SUMMARY.md** |
| What's the vision? | **PRODUCT_SPECIFICATION.md** Executive Summary |
| What business model? | **PRODUCT_SPECIFICATION.md** section 6 |
| How do I debug? | **DEV_GUIDE.md** Debugging section |
| Why this tech? | **DEV_GUIDE.md** Stack Decisions |

---

## 🚀 The TL;DR

1. **Run:** `npm run dev`
2. **Go to:** http://localhost:3000
3. **Login:** teacher1@devschool.local / [any password]
4. **Explore:** Dashboard, create a plan
5. **Next:** See QUICK_START.md for what to build next

---

## 📅 Timeline

- **🟢 Now:** Fully functional dev environment
- **🟡 Week 1-2:** Connect forms, list plans, plan detail pages
- **🔵 Week 3-4:** Sharing, comments, coordinator dashboard
- **🟣 Week 5-8:** Templates, search, PDF export, analytics
- **🔴 Month 3+:** Phase 2 & 3 features (cross-school sharing, AI, etc.)

---

**Ready to build? Start with `npm run dev`** 🚀

For more about the vision, see [PRODUCT_SPECIFICATION.md](PRODUCT_SPECIFICATION.md).
