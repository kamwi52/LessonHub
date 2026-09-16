@echo off
REM LessonsHub - Start both Backend + Frontend in separate windows
REM Usage: double-click this file, or run: start-all.bat
echo Starting LessonsHub (local mode, no Docker)...
echo Backend  -^> http://localhost:3001/health
echo Frontend -^> http://localhost:3000
start "LessonsHub Backend :3001" "%~dp0start-backend.bat"
timeout /t 5 /nobreak >nul
start "LessonsHub Frontend :3000" "%~dp0start-frontend.bat"
echo.
echo Two windows opened. Wait ~15 seconds, then open http://localhost:3000
echo Login: teacher1@devschool.local / devpass123
pause
