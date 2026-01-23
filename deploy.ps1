# Clean Deployment Script for IKM JUARA Database
# This script deploys the cleaned up version to Vercel

Write-Host "🚀 Starting clean deployment to Vercel..." -ForegroundColor Green

# Check if vercel CLI is installed
if (!(Get-Command "vercel" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

# Deploy to Vercel
Write-Host "📦 Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod

Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host "🌐 Your website should be available at your Vercel domain" -ForegroundColor Cyan

# Show final structure
Write-Host "`n📁 Final project structure:" -ForegroundColor Blue
Write-Host "├── admin/          (Admin dashboard pages)" -ForegroundColor Gray
Write-Host "├── api/            (API endpoints - simple-api.js only)" -ForegroundColor Gray  
Write-Host "├── data/           (JSON data files)" -ForegroundColor Gray
Write-Host "├── lib/            (Supabase client)" -ForegroundColor Gray
Write-Host "├── public/         (Public website)" -ForegroundColor Gray
Write-Host "├── shared/         (CSS styles)" -ForegroundColor Gray
Write-Host "├── .env.local      (Environment variables)" -ForegroundColor Gray
Write-Host "├── package.json    (Dependencies)" -ForegroundColor Gray
Write-Host "├── vercel.json     (Deployment config)" -ForegroundColor Gray
Write-Host "└── README.md       (Documentation)" -ForegroundColor Gray

Write-Host "`n🎉 Clean deployment ready!" -ForegroundColor Green