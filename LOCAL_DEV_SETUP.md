# LessonsHub - Local Development Setup (Without Docker)

This guide walks you through setting up LessonsHub to run locally on Windows without Docker.

---

## 📋 Prerequisites

You'll need to install:
- **Node.js 18+** - For frontend and backend
- **PostgreSQL 15** - For database
- **Git** - For version control (likely already have)

---

## 🔧 Step 1: Install Node.js

### Check if you have Node.js
```powershell
node --version
npm --version
```

If you see version numbers (v18+), skip to Step 2.

### Install Node.js
1. Go to **https://nodejs.org/**
2. Download **LTS (Long Term Support)** version
3. Run the installer and accept defaults
4. Restart PowerShell
5. Verify: `node --version`

---

## 🗄️ Step 2: Install PostgreSQL

### Download PostgreSQL
1. Go to **https://www.postgresql.org/download/windows/**
2. Click **"Download the installer"**
3. Choose **PostgreSQL 15** (latest stable)

### Run the Installer
1. Run `postgresql-15-x64-installer.exe`
2. Follow the installer with these settings:
   - **Installation Directory:** Keep default (C:\Program Files\PostgreSQL\15)
   - **Components:** Keep all checked (includes pgAdmin)
   - **Data Directory:** Keep default
   - **Superuser Password:** Set to `postgres` (you'll need this)
   - **Port:** Keep as **5432** (default)
   - **Locale:** Keep default

3. Click **"Next"** through all screens
4. **Finish** - don't launch Stack Builder
5. Restart PowerShell

### Verify PostgreSQL Installation
```powershell
psql --version
```

### Create the LessonsHub Database
```powershell
# Connect to PostgreSQL (you'll be prompted for password - use: postgres)
psql -U postgres

# In psql prompt, create database and user:
CREATE USER lessonshub_user WITH PASSWORD 'lessonshub_password';
CREATE DATABASE lessonshub_dev OWNER lessonshub_user;

# Give permissions
ALTER ROLE lessonshub_user CREATEDB;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO lessonshub_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO lessonshub_user;

# Exit psql
\q
```

### Initialize Database Schema
```powershell
# Connect as the new user
psql -U lessonshub_user -d lessonshub_dev -h localhost

# In psql, load the schema from the init.sql file
# Navigate to your LessonsHub directory first:
cd C:\Users\Administrator\Documents\GitHub\LessonsHUb

# Then in PowerShell, run:
psql -U lessonshub_user -d lessonshub_dev -h localhost -f database/init.sql
```

### Verify Database Setup
```powershell
psql -U lessonshub_user -d lessonshub_dev -h localhost

# In psql, verify tables exist:
\dt

# Should show these tables:
# schools, users, plans, plan_sharing, plan_comments, plan_versions

# Exit
\q
```

---

## 💾 Step 3: Update Environment File

Edit `.env` in your LessonsHub root directory:

```env
# Database (local PostgreSQL)
DATABASE_URL=postgresql://lessonshub_user:lessonshub_password@localhost:5432/lessonshub_dev
POSTGRES_USER=lessonshub_user
POSTGRES_PASSWORD=lessonshub_password
POSTGRES_DB=lessonshub_dev

# Backend
NODE_ENV=development
PORT=3001
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRY=7d
CORS_ORIGIN=http://localhost:3000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🚀 Step 4: Install Dependencies

### Install Root Dependencies
```powershell
cd C:\Users\Administrator\Documents\GitHub\LessonsHUb
npm install
```

### Install Backend Dependencies
```powershell
cd backend
npm install
cd ..
```

### Install Frontend Dependencies
```powershell
cd frontend
npm install
cd ..
```

---

## ▶️ Step 5: Run Services Locally

You'll open **3 PowerShell windows** and run these commands:

### Terminal 1: Start Backend
```powershell
cd C:\Users\Administrator\Documents\GitHub\LessonsHUb\backend
npm run dev
```

You should see:
```
✓ Database connected
✓ Server running on http://localhost:3001
```

### Terminal 2: Start Frontend
```powershell
cd C:\Users\Administrator\Documents\GitHub\LessonsHUb\frontend
npm run dev
```

You should see:
```
 ▲ Next.js 14.x.x
 - Local: http://localhost:3000
```

### Terminal 3: Keep Available (Optional)
You can run database commands here if needed:
```powershell
cd C:\Users\Administrator\Documents\GitHub\LessonsHUb

# View logs from backend/frontend as needed
# Or run psql commands temporarily
```

---

## ✅ Verify Everything Works

### Check All Services Running
1. **Backend:** Open http://localhost:3001/health
   - Should see: `{"status":"ok","timestamp":"..."}`

2. **Frontend:** Open http://localhost:3000
   - Should see login page

3. **Database:** In PowerShell:
   ```powershell
   psql -U lessonshub_user -d lessonshub_dev -h localhost
   SELECT COUNT(*) FROM users;  -- Should return 4 (sample users)
   \q
   ```

### Test Login
1. Go to http://localhost:3000
2. Login with: `teacher1@devschool.local` / (any password)
3. Should see dashboard

---

## 📝 Daily Development Workflow

### Start Services (Every Day)

**Terminal 1:**
```powershell
cd C:\Users\Administrator\Documents\GitHub\LessonsHUb\backend
npm run dev
```

**Terminal 2:**
```powershell
cd C:\Users\Administrator\Documents\GitHub\LessonsHUb\frontend
npm run dev
```

**Then Edit Code**
- Frontend changes auto-reload at http://localhost:3000
- Backend changes require manual restart (Ctrl+C, then `npm run dev`)

### Stop Services
Press `Ctrl+C` in each terminal window.

### Restart PostgreSQL (If Needed)
```powershell
# On Windows, PostgreSQL runs as a service
# To restart:
Restart-Service -Name postgresql-x64-15

# Or use Services GUI:
# Press Win+R, type "services.msc", find "postgresql-x64-15", right-click restart
```

---

## 🗄️ Database Management

### Access Database Directly
```powershell
# Connect to database
psql -U lessonshub_user -d lessonshub_dev -h localhost

# Common commands:
\dt              -- List all tables
SELECT * FROM users;        -- View all users
SELECT * FROM plans;        -- View all plans
\d plans         -- Show plans table structure
\q              -- Exit
```

### Reset Database (Delete All Data)
```powershell
# Drop and recreate
psql -U postgres

DROP DATABASE lessonshub_dev;
CREATE DATABASE lessonshub_dev OWNER lessonshub_user;
\q

# Reload schema
psql -U lessonshub_user -d lessonshub_dev -h localhost -f database/init.sql
```

### View Logs
Both frontend and backend output logs directly to the terminal they're running in. Just check those windows.

---

## 🐛 Troubleshooting

### "psql: command not found"
- PostgreSQL not installed or not in PATH
- Try: `"C:\Program Files\PostgreSQL\15\bin\psql" --version`
- Add to PATH: See PostgreSQL installation documentation

### "connection refused on localhost:5432"
```powershell
# Check if PostgreSQL is running
Get-Service postgresql-x64-15 | Select Status

# Start it if stopped
Start-Service postgresql-x64-15
```

### "EADDRINUSE error" on port 3001 or 3000
- Another app is using the port
- Kill the process:
```powershell
# Find process on port 3001
netstat -ano | findstr :3001

# Kill by PID
taskkill /PID <PID> /F

# Alternative: Change PORT in .env or npm script
```

### Backend can't connect to database
1. Verify PostgreSQL is running
2. Check .env DATABASE_URL
3. Test connection:
```powershell
psql -U lessonshub_user -d lessonshub_dev -h localhost -c "SELECT NOW();"
```

### Frontend can't reach backend API
- Check backend is running: http://localhost:3001/health
- Check NEXT_PUBLIC_API_URL in .env
- Check CORS_ORIGIN in backend .env

### "npm: command not found"
- Node.js not installed or not in PATH
- Restart PowerShell after installing Node.js

---

## 📊 Local Development Stack Summary

| Service | Technology | Port | How to Start |
|---------|-----------|------|-------------|
| **Frontend** | Next.js 14 + React 18 | 3000 | `cd frontend && npm run dev` |
| **Backend** | Express.js + Node.js | 3001 | `cd backend && npm run dev` |
| **Database** | PostgreSQL 15 | 5432 | Runs as Windows service (auto-starts) |

All three must be running for the app to work. If one stops, the app will error.

---

## 🔄 Creating/Modifying Features

### Add a New Backend Endpoint
1. Create file in `backend/src/routes/` (or edit existing)
2. Define the route
3. Backend hot-reload won't work - restart with Ctrl+C then `npm run dev`
4. Test at http://localhost:3001

### Add a New Frontend Page
1. Create file in `frontend/src/app/`
2. Save - hot-reload happens automatically
3. Navigate to page or check console for errors

### Modify Database Schema
1. Edit `database/init.sql` or create migration
2. Backup data if needed
3. Run reset: See "Reset Database" section above
4. Reload tables

---

## 📈 Performance Tips

- Keep only 1 instance of each service running
- Close unused applications to free RAM
- PostgreSQL uses ~100MB RAM when idle
- Node.js (backend + frontend combined) use ~200-300MB

---

## 🆘 Getting Help

| Issue | Check |
|-------|-------|
| API errors in console | Check backend terminal for errors |
| Page won't load | Is frontend running? http://localhost:3000 |
| Can't log in | Is backend running? http://localhost:3001/health |
| Database errors | Can you connect? `psql -U lessonshub_user -d lessonshub_dev` |
| Port conflicts | `netstat -ano \| findstr :PORT` |

---

## ✨ Next Steps

1. ✅ Verify all services running
2. ✅ Test login at http://localhost:3000
3. See [QUICK_START.md](QUICK_START.md) for what to build next
4. See [DEV_GUIDE.md](DEV_GUIDE.md) for development patterns

---

**Happy local development!** 🎉
