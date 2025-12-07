@echo off
echo Starting Quizzie Application...
echo.

REM Start Backend Server
echo [1/2] Starting Backend Server...
start "Quizzie Backend" cmd /k "cd backend && node index.js"

REM Wait a moment before starting frontend
timeout /t 2 /nobreak > nul

REM Start Frontend Server
echo [2/2] Starting Frontend Server...
start "Quizzie Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ============================================
echo Both servers are starting in separate windows
echo Backend: Running on default port
echo Frontend: Running on Vite dev server
echo ============================================
echo.
echo Press any key to exit this window...
pause > nul
