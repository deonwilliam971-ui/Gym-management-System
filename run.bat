@echo off
echo Starting Gym Management System...

echo [1/2] Starting Django Backend on http://localhost:8000
start "Django Backend" cmd /k "cd backend && venv\Scripts\python.exe manage.py runserver"

echo [2/2] Starting React Frontend on http://localhost:5173
start "React Frontend" cmd /k "cd frontend && npm run dev"

echo Both servers are starting. Check the opened windows for output.
