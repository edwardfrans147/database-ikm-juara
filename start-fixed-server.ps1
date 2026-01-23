# ===== IKM JUARA - START FIXED SERVER =====
# Script untuk menjalankan server yang sudah diperbaiki
# Versi: 3.0 - Complete Data Display Fix

Write-Host "🚀 Starting IKM JUARA Fixed Server..." -ForegroundColor Green
Write-Host "📅 Date: $(Get-Date)" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found! Please install Node.js first." -ForegroundColor Red
    Write-Host "   Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

Write-Host ""

# Check data directory and files
Write-Host "📋 Checking data files..." -ForegroundColor Yellow

$dataDir = "data"
if (-not (Test-Path $dataDir)) {
    Write-Host "📁 Creating data directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
}

$dataFiles = @(
    "ikm-binaan.json",
    "hki-merek.json", 
    "sertifikat-halal.json",
    "tkdn-ik.json",
    "siinas.json",
    "uji-nilai-gizi.json",
    "kurasi-produk.json",
    "pelatihan-pemberdayaan.json",
    "activity-logs.json",
    "admin-users.json",
    "buku-tamu.json",
    "recycle-bin.json",
    "website-content.json"
)

foreach ($file in $dataFiles) {
    $filePath = Join-Path $dataDir $file
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw | ConvertFrom-Json
        $count = if ($content -is [array]) { $content.Count } else { 1 }
        Write-Host "   ✅ $file : $count records" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  $file : Not found, will be created" -ForegroundColor Yellow
    }
}

Write-Host ""

# Start the fixed server
Write-Host "🚀 Starting Fixed Server..." -ForegroundColor Green
Write-Host "📍 Server will run on: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📊 Dashboard: http://localhost:3000/admin/index-fixed.html" -ForegroundColor Cyan
Write-Host "🔐 Login: http://localhost:3000/admin/login-fixed.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔧 FIXES APPLIED:" -ForegroundColor Magenta
Write-Host "   ✅ Field name mismatch fixed (camelCase vs snake_case)" -ForegroundColor Green
Write-Host "   ✅ Response format handling improved" -ForegroundColor Green
Write-Host "   ✅ Error handling enhanced" -ForegroundColor Green
Write-Host "   ✅ Data display issues resolved" -ForegroundColor Green
Write-Host "   ✅ API endpoints standardized" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan

# Start the server using the fixed version
node server/app-fixed.js