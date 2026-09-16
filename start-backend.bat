@echo off
REM LessonsHub - Start Backend (port 3001)
cd /d "%~dp0backend"
echo ============================================
echo  LessonsHub Backend - http://localhost:3001
echo  Health: http://localhost:3001/health
echo  Close this window to stop. Ctrl+C to stop.
echo ============================================
set DATABASE_URL=postgresql://lessonshub_user:lessonshub_password@localhost:5432/lessonshub_dev
set PORT=3001
set JWT_SECRET=dev-secret-key-change-in-production
set JWT_EXPIRY=7d
set CORS_ORIGIN=http://localhost:3000
npm run dev
pause
