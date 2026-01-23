
Write-Host "🚀 Deploying data rendering fixes..." -ForegroundColor Green

# Deploy to Vercel
vercel --prod

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Test at: https://apkfixikmjuara.vercel.app/admin/ikm-binaan.html" -ForegroundColor Cyan

Write-Host ""
Write-Host "📋 TESTING STEPS:" -ForegroundColor Yellow
Write-Host "1. Clear browser cache (Ctrl+Shift+R)" -ForegroundColor White
Write-Host "2. Login to admin panel" -ForegroundColor White
Write-Host "3. Go to IKM Binaan page" -ForegroundColor White
Write-Host "4. Check console for debug logs" -ForegroundColor White
Write-Host "5. Verify data is displayed in table" -ForegroundColor White
