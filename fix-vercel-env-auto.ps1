# SCRIPT OTOMATIS: FIX VERCEL ENVIRONMENT VARIABLES
# Mengatasi error "Terjadi kesalahan saat menyimpan buku tamu"

Write-Host "🚀 MEMULAI FIX VERCEL ENVIRONMENT VARIABLES..." -ForegroundColor Green
Write-Host ""

# Cek apakah Vercel CLI terinstall
Write-Host "📋 Mengecek Vercel CLI..." -ForegroundColor Yellow
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI terdeteksi: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI tidak terinstall!" -ForegroundColor Red
    Write-Host "   Jalankan: npm install -g vercel" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🔧 SETTING ENVIRONMENT VARIABLES..." -ForegroundColor Cyan

# Set environment variables satu per satu
Write-Host "1️⃣ Setting NEXT_PUBLIC_SUPABASE_URL..." -ForegroundColor Yellow
vercel env add NEXT_PUBLIC_SUPABASE_URL production --value="https://krylvwwguczwwoyqghlc.supabase.co" --force

Write-Host "2️⃣ Setting NEXT_PUBLIC_SUPABASE_ANON_KEY..." -ForegroundColor Yellow
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeWx2d3dndWN6d3dveXFnaGxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNTg4NDEsImV4cCI6MjA4NDYzNDg0MX0.ikuvFZB4zjChsh-cM2MMMYYmWYTfC-P67gQZPBvCZqA" --force

Write-Host "3️⃣ Setting SUPABASE_SERVICE_ROLE_KEY..." -ForegroundColor Yellow
vercel env add SUPABASE_SERVICE_ROLE_KEY production --value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeWx2d3dndWN6d3dveXFnaGxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA1ODg0MSwiZXhwIjoyMDg0NjM0ODQxfQ.ysubAuDeIPshMww709q092yI37j1wZUIwK5vQttUsmE" --force

Write-Host ""
Write-Host "🔄 MEMULAI REDEPLOY..." -ForegroundColor Cyan
vercel --prod

Write-Host ""
Write-Host "✅ SELESAI! Environment variables telah diset dan website di-redeploy." -ForegroundColor Green
Write-Host ""
Write-Host "🧪 TESTING:" -ForegroundColor Yellow
Write-Host "   1. Buka: https://apkfixikmjuara.vercel.app/login.html" -ForegroundColor White
Write-Host "   2. Isi form buku tamu" -ForegroundColor White
Write-Host "   3. Klik 'Akses Data'" -ForegroundColor White
Write-Host "   4. Seharusnya berhasil tanpa error!" -ForegroundColor White
Write-Host ""
Write-Host "📊 Cek API Health: https://apkfixikmjuara.vercel.app/api/health" -ForegroundColor Cyan