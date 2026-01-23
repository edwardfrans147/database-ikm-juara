
# 🚀 DEPLOY WITH INFINITE LOOP FIX

Write-Host "🔧 Deploying with infinite loop fixes..." -ForegroundColor Green

# Clear local cache
Write-Host "🧹 Clearing local cache..." -ForegroundColor Yellow
if (Test-Path ".vercel") {
    Remove-Item -Recurse -Force ".vercel"
}

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Green
vercel --prod

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Test at: https://apkfixikmjuara.vercel.app/admin/login.html" -ForegroundColor Cyan

Write-Host ""
Write-Host "📋 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Clear browser cache (Ctrl+Shift+R)" -ForegroundColor White
Write-Host "2. Test in incognito window" -ForegroundColor White
Write-Host "3. Check console for errors" -ForegroundColor White
Write-Host "4. Verify no 'Maximum call stack' errors" -ForegroundColor White
