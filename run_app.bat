@echo off
title Phishing Shield AI - Unified Launcher
color 0B
echo ==========================================================
echo     Phishing Shield AI - AWS Project Expo Launcher        
echo ==========================================================

echo [1/2] Launching Python FastAPI Backend on port 8000...
start cmd /k "title Phishing Shield Backend && "%LOCALAPPDATA%\Programs\Python\Python311\python.exe" -m uvicorn app:app --app-dir backend --host 0.0.0.0 --port 8000 --reload"

timeout /t 2 /nobreak >nul

echo [2/2] Launching React Vite Frontend on port 5173...
cd frontend
npm run dev

