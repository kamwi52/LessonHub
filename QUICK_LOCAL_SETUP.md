# LessonsHub - Quick Local Setup (You Have Node.js + HeidiSQL)

Since you already have Node.js and a SQL tool, here's the streamlined setup.

---

## Step 1: Install PostgreSQL (If Not Already Installed)

### Check if you have PostgreSQL
```powershell
psql --version
```

If you see a version number, skip this step.

### Install PostgreSQL
1. Go to **https://www.postgresql.org/download/windows/**
2. Download PostgreSQL 15 installer
3. Run installer:
   - Accept defaults for most steps
   - **Set superuser password to:** `postgres`
   - **Port:** 5432 (default)
4. Restart PowerShell when done

---

## Step 2: Create Database in HeidiSQL

1. **Open HeidiSQL**
2. Click **"New"** to create a connection:
   - **Hostname:** localhost
   - **Port:** 5432
   - **User:** postgres
   - **Password:** postgres (what you set during install)
3. **Click "Open"**

### Create User & Database
In HeidiSQL query window, run:

```sql
-- Create user
CREATE USER lessonshub_user WITH PASSWORD 'lessonshub_password';

-- Create database
CREATE DATABASE lessonshub_dev OWNER lessonshub_user;

-- Grant permissions
ALTER ROLE lessonshub_user CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE lessonshub_dev TO lessonshub_user;
```

### Create Tables
1. Right-click on **lessonshub_dev** → **"Select database"**
2. Open a new query window
3. Copy the entire contents of `database/init.sql` from this workspace
4. Run the query

**Verify tables exist:**
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

Should show: schools, users, plans, plan_comments, plan_sharing, plan_versions

---

## Step 3: Update .env File

Edit `.env` in root directory:

```env
# Database
DATABASE_URL=postgresql://lessonshub_user:lessonshub_password@localhost:5432/lessonshub_dev
POSTGRES_USER=lessonshub_user
POSTGRES_PASSWORD=lessonshub_password
POSTGRES_DB=lessonshub_dev

# Backend
NODE_ENV=development
PORT=3001
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRY=7d
CORS_ORIGIN=http://localhost:3000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Step 4: Install Dependencies

```powershell
cd C:\Users\Administrator\Documents\GitHub\LessonsHUb

# Install all
npm install

# Install backend
cd backend
npm install
cd ..

# Install frontend
cd frontend
npm install
cd ..
```

This takes 2-3 minutes.

---

## Step 5: Start Backend & Frontend

### Terminal 1: Start Backend
```powershell
cd C:\Users\Administrator\Documents\GitHub\LessonsHUb\backend
npm run dev
```

Should see:
```
✓ Database connected
✓ Server running on http://localhost:3001
```

### Terminal 2: Start Frontend
```powershell
cd C:\Users\Administrator\Documents\GitHub\LessonsHUb\frontend
npm run dev
```

Should see:
```
▲ Next.js 14.x.x
- Local: http://localhost:3000
```

---

## Step 6: Test It

### Test Backend
```powershell
# In a new terminal or browser
curl http://localhost:3001/health

# Should return: {"status":"ok","timestamp":"..."}
```

### Test Frontend
Go to **http://localhost:3000**
- Should see login page

### Test Login
- **Email:** teacher1@devschool.local
- **Password:** (any value)
- Should see dashboard

---

## Daily Development

**Every day, open 2 PowerShell windows:**

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

**Edit code:**
- Frontend changes auto-reload
- Backend changes need restart: Ctrl+C, then `npm run dev`

---

## Using HeidiSQL for Development

### View/Edit Data
1. Select **lessonshub_dev** database
2. Expand **Tables**
3. Right-click table → **"Edit table"** or **"New record"**

### Run SQL Queries
1. Right-click database → **"New query"**
2. Write SQL
3. Press **Ctrl+Enter** or click execute

### Common Development Queries
```sql
-- View all users
SELECT * FROM users;

-- View all plans
SELECT * FROM plans;

-- View plans by teacher
SELECT * FROM plans WHERE teacher_id = 1;

-- Reset a table
DELETE FROM plans;
ALTER SEQUENCE plans_id_seq RESTART WITH 1;

-- Check indexes
SELECT * FROM pg_indexes WHERE tablename = 'plans';
```

---

## Troubleshooting

### Backend can't connect to database
1. Verify PostgreSQL is running
2. In HeidiSQL, verify connection works
3. Check DATABASE_URL in .env

### Frontend can't reach backend
1. Check backend is running: http://localhost:3001/health
2. Check NEXT_PUBLIC_API_URL = http://localhost:3001

### "npm: command not found"
- Node.js not in PATH
- Restart PowerShell
- Or verify: `node --version`

### Database permission errors
- In HeidiSQL, check user "lessonshub_user" has permissions on lessonshub_dev
- Run: `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO lessonshub_user;`

---

## You're Ready!

✅ Node.js installed  
✅ HeidiSQL installed  
✅ PostgreSQL needed (2 min install)  
✅ Database created (2 min with HeidiSQL)  
✅ Dependencies installed (3 min)  
✅ Services running (2 commands)

**Total setup time: 15 minutes**

---

## Next Steps

1. ✅ Complete setup above
2. ✅ Verify login at http://localhost:3000
3. See [QUICK_START.md](QUICK_START.md#-what-to-build-next) for feature priorities
4. Code in `frontend/src` and `backend/src`

Happy coding! 🚀
