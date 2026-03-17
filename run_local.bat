@echo off
title Self-Healing App Monitor
color 0a
cls

echo ===================================================
echo   Self-Healing Web App - DEMO RUNNER
echo ===================================================
echo   [INFO] Simulating Docker 'restart: always' policy
echo   [INFO] If app crashes, this script will restart it.
echo ===================================================
echo.

cd app
if not exist "node_modules" (
    echo [SETUP] Installing dependencies...
    call npm install
)

:loop
echo.
echo [MONITOR] Starting Application Service...
node index.js
echo.
echo [!CRITICAL!] SYSTEM CRASH DETECTED (Exit Code: %errorlevel%)
echo [RECOVERY]  Initiating auto-recovery sequence...
echo [RECOVERY]  Restarting in 2 seconds...
timeout /t 2 >nul
goto loop
