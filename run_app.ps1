# Phishing Shield AI - Unified Startup Script
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "    Phishing Shield AI - AWS Project Expo Launcher        " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Start Python Backend
Write-Host "[1/2] Starting FastAPI Backend on http://localhost:8000..." -ForegroundColor Green
$pythonPath = "$env:LOCALAPPDATA\Programs\Python\Python311\python.exe"
if (-not (Test-Path $pythonPath)) {
    $pythonPath = "python"
}

Start-Process -FilePath $pythonPath -ArgumentList "-m uvicorn app:app --app-dir backend --host 0.0.0.0 --port 8000 --reload"

# Wait for backend to initialize
Start-Sleep -Seconds 2

# 2. Start Frontend
Write-Host "[2/2] Starting React + Vite Frontend on http://localhost:5173..." -ForegroundColor Green
Set-Location "frontend"
npm run dev

