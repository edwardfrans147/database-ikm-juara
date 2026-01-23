# Deploy perbaikan NIB dan tombol edit/hapus ke Vercel
Write-Host "🚀 Deploying perbaikan NIB dan tombol edit/hapus ke Vercel..." -ForegroundColor Green

# Deploy to Vercel
Write-Host "📦 Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod

Write-Host "✅ Deploy selesai!" -ForegroundColor Green
Write-Host "🌐 Website: https://apkfixikmjuara.vercel.app" -ForegroundColor Cyan
Write-Host "📊 Admin: https://apkfixikmjuara.vercel.app/admin" -ForegroundColor Cyan
Write-Host "🔗 API Test: https://apkfixikmjuara.vercel.app/api/test" -ForegroundColor Cyan

Write-Host "`n🔧 Perbaikan yang di-deploy:" -ForegroundColor Yellow
Write-Host "✅ NIB sekarang muncul di semua layanan IKM" -ForegroundColor Green
Write-Host "✅ Tombol Edit berfungsi dengan API Supabase" -ForegroundColor Green
Write-Host "✅ Tombol Hapus berfungsi dengan recycle bin" -ForegroundColor Green
Write-Host "✅ API CRUD lengkap untuk semua layanan" -ForegroundColor Green
Write-Host "✅ Error handling yang lebih baik" -ForegroundColor Green

Write-Host "`n⏰ Tunggu 1-2 menit untuk propagasi cache Vercel" -ForegroundColor Yellow
Write-Host "🔄 Refresh browser dengan Ctrl+F5 untuk clear cache" -ForegroundColor Yellow