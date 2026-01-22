# DEPLOYMENT OTOMATIS - DATABASE IKM JUARA
Write-Host "STARTING AUTOMATIC DEPLOYMENT" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green

# Check Vercel CLI
if (!(Get-Command "vercel" -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Blue
npm install

# Backup original vercel.json
if (Test-Path "vercel.json") {
    Copy-Item "vercel.json" "vercel-backup.json"
}

# Deploy Admin Website
Write-Host "DEPLOYING ADMIN WEBSITE..." -ForegroundColor Blue
Copy-Item "vercel-admin.json" "vercel.json" -Force
vercel --prod --yes --name ikm-juara-admin

if ($LASTEXITCODE -eq 0) {
    Write-Host "ADMIN DEPLOYED: https://ikm-juara-admin.vercel.app" -ForegroundColor Green
} else {
    Write-Host "Admin deployment failed!" -ForegroundColor Red
    exit 1
}

# Deploy Public Website
Write-Host "DEPLOYING PUBLIC WEBSITE..." -ForegroundColor Blue
Copy-Item "vercel-public.json" "vercel.json" -Force
vercel --prod --yes --name ikm-juara-public

if ($LASTEXITCODE -eq 0) {
    Write-Host "PUBLIC DEPLOYED: https://ikm-juara-public.vercel.app" -ForegroundColor Green
} else {
    Write-Host "Public deployment failed!" -ForegroundColor Red
    exit 1
}

# Restore backup
if (Test-Path "vercel-backup.json") {
    Move-Item "vercel-backup.json" "vercel.json" -Force
}

Write-Host ""
Write-Host "DEPLOYMENT COMPLETED!" -ForegroundColor Green
Write-Host "Admin: https://ikm-juara-admin.vercel.app" -ForegroundColor Cyan
Write-Host "Public: https://ikm-juara-public.vercel.app" -ForegroundColor Cyan
Write-Host "Login Admin: BidIndustri08# / DisnakerKUKM2024!" -ForegroundColor Yellow