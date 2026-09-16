@echo off
REM LessonsHub - Start Frontend (port 3000)
cd /d "%~dp0frontend"
echo ============================================
echo  LessonsHub Frontend - http://localhost:3000
echo  Login: teacher1@devschool.local / devpass123
echo  Close this window to stop. Ctrl+C to stop.
echo ============================================
set NEXT_PUBLIC_API_URL=http://localhost:3001
set PORT=3000
npm run dev
pause
