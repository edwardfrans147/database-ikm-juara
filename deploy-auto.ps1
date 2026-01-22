# SCRIPT DEPLOYMENT OTOMATIS - DATABASE IKM JUARA
# Deploy 2 website terpisah ke Vercel

Write-Host "🚀 STARTING AUTOMATIC DEPLOYMENT - DATABASE IKM JUARA" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""

# Function to check command existence
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Function to install npm package globally
function Install-GlobalPackage($packageName) {
    Write-Host "📦 Installing $packageName globally..." -ForegroundColor Yellow
    npm install -g $packageName
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $packageName installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install $packageName" -ForegroundColor Red
        exit 1
    }
}

# Check prerequisites
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Blue

# Check Node.js
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    Write-Host "   Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check npm
if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-Host "✅ npm found: v$npmVersion" -ForegroundColor Green
} else {
    Write-Host "❌ npm not found. Please install npm first." -ForegroundColor Red
    exit 1
}

# Check/Install Vercel CLI
if (Test-Command "vercel") {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} else {
    Write-Host "📦 Vercel CLI not found. Installing..." -ForegroundColor Yellow
    Install-GlobalPackage "vercel"
}

Write-Host ""
Write-Host "📋 DEPLOYMENT PLAN:" -ForegroundColor Cyan
Write-Host "1. Admin Website: ikm-juara-admin.vercel.app"
Write-Host "2. Public Website: ikm-juara-public.vercel.app"
Write-Host ""

# Confirm deployment
$confirm = Read-Host "Ready to deploy both websites? (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "❌ Deployment cancelled by user." -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "🚀 STARTING DEPLOYMENT PROCESS..." -ForegroundColor Green
Write-Host ""

# Backup original vercel.json if exists
$originalConfig = $null
if (Test-Path "vercel.json") {
    Write-Host "💾 Backing up original vercel.json..." -ForegroundColor Blue
    Copy-Item "vercel.json" "vercel-original-backup.json"
    $originalConfig = "vercel-original-backup.json"
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed!" -ForegroundColor Green
Write-Host ""

# Deploy Admin Website
Write-Host "DEPLOYING ADMIN WEBSITE..." -ForegroundColor Blue
Write-Host "================================" -ForegroundColor Blue

# Use admin config
Copy-Item "vercel-admin.json" "vercel.json" -Force
Write-Host "📝 Using admin configuration..." -ForegroundColor Yellow

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod --yes --name ikm-juara-admin --confirm

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ ADMIN WEBSITE DEPLOYED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "URL: https://ikm-juara-admin.vercel.app" -ForegroundColor Cyan
} else {
    Write-Host "❌ Admin website deployment failed!" -ForegroundColor Red
    if ($originalConfig) {
        Move-Item $originalConfig "vercel.json" -Force
    }
    exit 1
}

Write-Host ""
Start-Sleep -Seconds 3

# Deploy Public Website
Write-Host "DEPLOYING PUBLIC WEBSITE..." -ForegroundColor Blue
Write-Host "================================" -ForegroundColor Blue

# Use public config
Copy-Item "vercel-public.json" "vercel.json" -Force
Write-Host "📝 Using public configuration..." -ForegroundColor Yellow

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod --yes --name ikm-juara-public --confirm

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ PUBLIC WEBSITE DEPLOYED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "URL: https://ikm-juara-public.vercel.app" -ForegroundColor Cyan
} else {
    Write-Host "❌ Public website deployment failed!" -ForegroundColor Red
    if ($originalConfig) {
        Move-Item $originalConfig "vercel.json" -Force
    }
    exit 1
}

# Restore original config if exists
if ($originalConfig) {
    Write-Host ""
    Write-Host "🔄 Restoring original configuration..." -ForegroundColor Blue
    Move-Item $originalConfig "vercel.json" -Force
    Write-Host "✅ Original configuration restored!" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "DEPLOYMENT SUMMARY:" -ForegroundColor Cyan
Write-Host ""
Write-Host "ADMIN WEBSITE (Master Admin):" -ForegroundColor Yellow
Write-Host "   URL: https://ikm-juara-admin.vercel.app" -ForegroundColor Cyan
Write-Host "   Login: BidIndustri08# / DisnakerKUKM2024!" -ForegroundColor White
Write-Host "   Features: Dashboard, CRUD, Import/Export, Management" -ForegroundColor Gray
Write-Host ""
Write-Host "PUBLIC WEBSITE (Masyarakat Umum):" -ForegroundColor Yellow
Write-Host "   URL: https://ikm-juara-public.vercel.app" -ForegroundColor Cyan
Write-Host "   Login: Guest (Nama + NIK 16 digit)" -ForegroundColor White
Write-Host "   Features: Penelusuran, Informasi, Export" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Both websites are now live and ready to use!" -ForegroundColor Green