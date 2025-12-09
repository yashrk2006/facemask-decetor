@echo off
echo ====================================
echo Starting HTTPS Server for Camera
echo ====================================
echo.
echo This will open: https://localhost:3443/
echo.
echo You'll see a security warning - that's normal!
echo Just click "Advanced" then "Proceed to localhost"
echo.
echo Press any key to start server...
pause >nul

cd /d "%~dp0"
python server_https.py

pause
