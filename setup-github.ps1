# SETUP GITHUB CONNECTION
Write-Host "🔗 SETTING UP GITHUB CONNECTION..." -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green

# Check if GitHub CLI is installed
if (!(Get-Command "gh" -ErrorAction SilentlyContinue)) {
    Write-Host "📦 GitHub CLI not found. Please install it first:" -ForegroundColor Yellow
    Write-Host "   Download from: https://cli.github.com/" -ForegroundColor Cyan
    Write-Host "   Or run: winget install --id GitHub.cli" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "After installation, run this script again." -ForegroundColor Yellow
    exit 1
}

# Check if user is logged in to GitHub
$ghStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "🔐 Please login to GitHub first:" -ForegroundColor Yellow
    Write-Host "   Run: gh auth login" -ForegroundColor Cyan
    Write-Host ""
    gh auth login
}

# Create GitHub repository
Write-Host "📁 Creating GitHub repository..." -ForegroundColor Blue
$repoName = "database-ikm-juara"
$repoDescription = "Database IKM JUARA - Sistem Informasi Industri Kecil Menengah Kota Madiun"

gh repo create $repoName --public --description $repoDescription --clone=false

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ GitHub repository created successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Repository might already exist, continuing..." -ForegroundColor Yellow
}

# Add remote origin
$username = gh api user --jq .login
$repoUrl = "https://github.com/$username/$repoName.git"

Write-Host "🔗 Adding remote origin..." -ForegroundColor Blue
git remote add origin $repoUrl

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Remote origin added successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Remote might already exist, updating..." -ForegroundColor Yellow
    git remote set-url origin $repoUrl
}

# Push to GitHub
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Blue
git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Code pushed to GitHub successfully!" -ForegroundColor Green
    Write-Host "🌐 Repository URL: https://github.com/$username/$repoName" -ForegroundColor Cyan
} else {
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 GITHUB SETUP COMPLETED!" -ForegroundColor Green
Write-Host "Repository: https://github.com/$username/$repoName" -ForegroundColor Cyan