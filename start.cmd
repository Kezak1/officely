@echo off
setlocal
cd /d "%~dp0"
if exist "%~dp0.tools\node-v24.22.2-win-x64\node.exe" set "PATH=%~dp0.tools\node-v24.22.2-win-x64;%PATH%"
where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo Please install Node.js 24 LTS, then run this file again.
  pause
  exit /b 1
)
if not exist "node_modules\vite\bin\vite.js" (
  call npm.cmd install
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
echo Starting Officely. Keep this window open. Press Ctrl+C to stop.
call npm.cmd run dev -- --open
if errorlevel 1 pause
