# Database IKM JUARA - Simple Deployment Script

Write-Host "=== Database IKM JUARA - Deployment Script ===" -ForegroundColor Green

# Step 1: Check Git status
Write-Host "Checking Git status..." -ForegroundColor Yellow
git status

# Step 2: Add and commit changes
Write-Host "Adding and committing changes..." -ForegroundColor Yellow
git add .
git commit -m "Deploy: Database IKM JUARA v2.0 - Ready for production"

# Step 3: Check if we have remote
Write-Host "Checking GitHub remote..." -ForegroundColor Yellow
$remote = git remote -v
if ($remote) {
    Write-Host "GitHub remote found:" -ForegroundColor Green
    Write-Host $remote
    
    # Push to GitHub
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Successfully pushed to GitHub!" -ForegroundColor Green
    } else {
        Write-Host "Failed to push to GitHub" -ForegroundColor Red
    }
} else {
    Write-Host "No GitHub remote found." -ForegroundColor Yellow
    Write-Host "Please add GitHub remote manually:" -ForegroundColor White
    Write-Host "git remote add origin https://github.com/yourusername/database-ikm-juara.git" -ForegroundColor Cyan
}

# Step 4: Install Vercel CLI if needed
Write-Host "Checking Vercel CLI..." -ForegroundColor Yellow
try {
    vercel --version
    Write-Host "Vercel CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Step 5: Create .vercelignore
Write-Host "Creating .vercelignore..." -ForegroundColor Yellow
$vercelIgnore = @"
node_modules
.git
*.md
*.log
test-*.xlsx
uploads/*
"@
$vercelIgnore | Out-File -FilePath ".vercelignore" -Encoding UTF8

Write-Host "Deployment preparation completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Create GitHub repository if not done yet" -ForegroundColor White
Write-Host "2. Run: vercel --prod" -ForegroundColor White
Write-Host "3. Follow Vercel setup prompts" -ForegroundColor White
Write-Host "4. Configure environment variables in Vercel dashboard" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see DEPLOYMENT_GUIDE.md" -ForegroundColor Yellow