@echo off
echo Starting BookMyScreen Project...
echo.

echo Starting Server...
start "BookMyScreen Server" cmd /k "cd server && npm run server"

timeout /t 3 /nobreak >nul

echo Starting Client...
start "BookMyScreen Client" cmd /k "cd client && npm run dev"

echo.
echo Both server and client are starting...
echo Server: http://localhost:3000
echo Client: http://localhost:5173
echo.
echo Press any key to exit this window (servers will continue running)...
pause >nul

