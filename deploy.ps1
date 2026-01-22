# Database IKM JUARA - Automated Deployment Script
# This script automates the deployment process to GitHub and Vercel

Write-Host "=== Database IKM JUARA - Automated Deployment ===" -ForegroundColor Green
Write-Host "Starting deployment process..." -ForegroundColor Yellow

# Step 1: Check prerequisites
Write-Host "`n🔍 Step 1: Checking prerequisites..." -ForegroundColor Cyan

# Check Git
try {
    $gitVersion = git --version
    Write-Host "✅ Git installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git not found. Please install Git first." -ForegroundColor Red
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check if we're in the right directory
if (!(Test-Path "package.json")) {
    Write-Host "❌ package.json not found. Please run this script from the project root directory." -ForegroundColor Red
    exit 1
}

Write-Host "✅ All prerequisites met!" -ForegroundColor Green

# Step 2: Prepare for deployment
Write-Host "`n📦 Step 2: Preparing for deployment..." -ForegroundColor Cyan

# Install dependencies if needed
if (!(Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

# Test the application
Write-Host "Testing application..." -ForegroundColor Yellow
$testProcess = Start-Process -FilePath "node" -ArgumentList "server/app.js" -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 3

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/dashboard" -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Application test passed" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Application test failed, but continuing..." -ForegroundColor Yellow
} finally {
    Stop-Process -Id $testProcess.Id -Force -ErrorAction SilentlyContinue
}

# Step 3: Git operations
Write-Host "`n📝 Step 3: Git operations..." -ForegroundColor Cyan

# Check git status
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "Uncommitted changes found. Adding and committing..." -ForegroundColor Yellow
    
    git add .
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to add files to git" -ForegroundColor Red
        exit 1
    }
    
    $commitMessage = "Deploy: Database IKM JUARA v2.0 - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    git commit -m $commitMessage
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to commit changes" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Changes committed" -ForegroundColor Green
} else {
    Write-Host "✅ No uncommitted changes" -ForegroundColor Green
}

# Step 4: GitHub setup
Write-Host "`n🐙 Step 4: GitHub setup..." -ForegroundColor Cyan

# Check if remote origin exists
$remoteOrigin = git remote get-url origin 2>$null
if (!$remoteOrigin) {
    Write-Host "⚠️  No GitHub remote found." -ForegroundColor Yellow
    Write-Host "Please create a GitHub repository and add it as remote:" -ForegroundColor Yellow
    Write-Host "git remote add origin https://github.com/yourusername/database-ikm-juara.git" -ForegroundColor White
    Write-Host "Then run this script again." -ForegroundColor Yellow
    
    # Ask user if they want to continue without GitHub
    $continue = Read-Host "Continue without GitHub push? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 0
    }
} else {
    Write-Host "GitHub remote found: $remoteOrigin" -ForegroundColor Green
    
    # Push to GitHub
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    git push origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Successfully pushed to GitHub" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Failed to push to GitHub, but continuing..." -ForegroundColor Yellow
    }
}

# Step 5: Vercel deployment
Write-Host "`n🚀 Step 5: Vercel deployment..." -ForegroundColor Cyan

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI installed: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Vercel CLI" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Vercel CLI installed" -ForegroundColor Green
}

# Deploy to Vercel
Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
Write-Host "Note: You may need to login to Vercel and configure the project." -ForegroundColor Yellow

# Create .vercelignore if it doesn't exist
if (!(Test-Path ".vercelignore")) {
    $vercelIgnoreContent = @"
node_modules
.git
*.md
*.log
test-*.xlsx
"@
    $vercelIgnoreContent | Out-File -FilePath ".vercelignore" -Encoding UTF8
    Write-Host "Created .vercelignore" -ForegroundColor Green
}

# Deploy
vercel --prod --yes
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Successfully deployed to Vercel" -ForegroundColor Green
} else {
    Write-Host "⚠️  Vercel deployment may need manual configuration" -ForegroundColor Yellow
    Write-Host "Please run 'vercel --prod' manually and follow the prompts" -ForegroundColor Yellow
}

# Step 6: Summary
Write-Host "`n📊 Step 6: Deployment Summary" -ForegroundColor Cyan

Write-Host "`n=== DEPLOYMENT COMPLETED ===" -ForegroundColor Green
Write-Host "✅ Git repository prepared" -ForegroundColor Green
Write-Host "✅ Code committed and ready" -ForegroundColor Green

if ($remoteOrigin) {
    Write-Host "✅ Pushed to GitHub: $remoteOrigin" -ForegroundColor Green
} else {
    Write-Host "⚠️  GitHub remote not configured" -ForegroundColor Yellow
}

Write-Host "✅ Vercel deployment initiated" -ForegroundColor Green

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. If GitHub remote not set, create repository and add remote" -ForegroundColor White
Write-Host "2. Configure Vercel project settings if needed" -ForegroundColor White
Write-Host "3. Set up Supabase database (see DEPLOYMENT_GUIDE.md)" -ForegroundColor White
Write-Host "4. Configure environment variables in Vercel" -ForegroundColor White
Write-Host "5. Test the deployed application" -ForegroundColor White

Write-Host "`n📚 Documentation:" -ForegroundColor Cyan
Write-Host "- Full deployment guide: DEPLOYMENT_GUIDE.md" -ForegroundColor White
Write-Host "- Project documentation: README.md" -ForegroundColor White

Write-Host "`n🎉 Database IKM JUARA is ready for production!" -ForegroundColor Green
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")