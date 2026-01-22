@echo off
echo Stopping server...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Starting server...
start "IKM JUARA Server" cmd /k "node server/app.js"

echo Server restarted successfully!
echo Access admin panel at: http://localhost:3000/admin
echo Access public website at: http://localhost:3000/public
pause