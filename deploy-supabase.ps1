# Deploy with Supabase Integration
Write-Host "🚀 DEPLOYING DATABASE IKM JUARA WITH SUPABASE..." -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Check environment variables
Write-Host "🔧 Checking environment variables..." -ForegroundColor Yellow
$envFile = ".env.local"
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile -Raw
    if ($envContent -match "krylvwwguczwwoyqghlc") {
        Write-Host "✅ Supabase credentials found" -ForegroundColor Green
    } else {
        Write-Host "❌ Supabase credentials not found" -ForegroundColor Red
        Write-Host "Please update .env.local with Supabase credentials" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "❌ .env.local file not found" -ForegroundColor Red
    exit 1
}

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Blue
vercel --prod --confirm

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host "🌐 Your application is now running with Supabase database" -ForegroundColor Cyan
} else {
    Write-Host "❌ Deployment failed" -ForegroundColor Red
    exit 1
}
