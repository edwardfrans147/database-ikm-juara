# ===== DEPLOY FIXED VERSION TO VERCEL =====
# Script untuk deploy perbaikan ke Vercel
# Versi: 3.0 - Complete Data Display Fix

Write-Host "🚀 Deploying Fixed IKM JUARA to Vercel..." -ForegroundColor Green
Write-Host "📅 Date: $(Get-Date)" -ForegroundColor Cyan
Write-Host ""

# Check if git is available
try {
    $gitVersion = git --version
    Write-Host "✅ Git version: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git not found! Please install Git first." -ForegroundColor Red
    exit 1
}

# Check if vercel CLI is available
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI version: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found! Installing..." -ForegroundColor Yellow
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Vercel CLI!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🔧 FIXES APPLIED IN THIS DEPLOYMENT:" -ForegroundColor Magenta
Write-Host "   ✅ Field name mismatch fixed (camelCase vs snake_case)" -ForegroundColor Green
Write-Host "   ✅ Response format handling improved" -ForegroundColor Green
Write-Host "   ✅ Error handling enhanced" -ForegroundColor Green
Write-Host "   ✅ Data display issues resolved" -ForegroundColor Green
Write-Host "   ✅ API endpoints standardized" -ForegroundColor Green
Write-Host "   ✅ Supabase integration improved" -ForegroundColor Green
Write-Host ""

# Add all changes to git
Write-Host "📦 Adding changes to git..." -ForegroundColor Yellow
git add .

# Commit changes
$commitMessage = "fix: Complete data display fix - field names and API response handling"
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  No changes to commit or commit failed" -ForegroundColor Yellow
}

# Push to GitHub
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push to GitHub!" -ForegroundColor Red
    Write-Host "   Please check your git configuration and try again." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
Write-Host ""

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Your fixed website is now live at:" -ForegroundColor Cyan
    Write-Host "   https://database-ikm-juara.vercel.app" -ForegroundColor White
    Write-Host ""
    Write-Host "🔐 Login with:" -ForegroundColor Cyan
    Write-Host "   Username: admin" -ForegroundColor White
    Write-Host "   Password: admin123" -ForegroundColor White
    Write-Host ""
    Write-Host "✅ FIXES DEPLOYED:" -ForegroundColor Green
    Write-Host "   • Data now displays correctly in all tables" -ForegroundColor White
    Write-Host "   • Field names are properly mapped (camelCase)" -ForegroundColor White
    Write-Host "   • API responses are handled consistently" -ForegroundColor White
    Write-Host "   • Error handling provides clear feedback" -ForegroundColor White
    Write-Host "   • Dashboard shows real statistics" -ForegroundColor White
    Write-Host ""
    Write-Host "🎯 Test the fixes:" -ForegroundColor Yellow
    Write-Host "   1. Login to admin panel" -ForegroundColor White
    Write-Host "   2. Check Dashboard - should show real numbers" -ForegroundColor White
    Write-Host "   3. Visit IKM Binaan - data should display in table" -ForegroundColor White
    Write-Host "   4. Check Layanan IKM - all tabs should show data" -ForegroundColor White
    Write-Host "   5. Visit Pelatihan - training data should be visible" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ DEPLOYMENT FAILED!" -ForegroundColor Red
    Write-Host "   Please check the error messages above and try again." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔧 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "   1. Make sure you're logged in to Vercel: vercel login" -ForegroundColor White
    Write-Host "   2. Check your internet connection" -ForegroundColor White
    Write-Host "   3. Verify your Vercel project settings" -ForegroundColor White
    Write-Host "   4. Try deploying manually: vercel --prod" -ForegroundColor White
}

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")