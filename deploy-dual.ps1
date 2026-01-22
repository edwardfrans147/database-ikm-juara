# Script untuk deploy 2 website terpisah
Write-Host "🚀 DEPLOYING 2 SEPARATE WEBSITES - IKM JUARA" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Check if Vercel CLI is installed
if (!(Get-Command "vercel" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

Write-Host ""
Write-Host "📋 DEPLOYMENT OPTIONS:" -ForegroundColor Yellow
Write-Host "1. Deploy Admin Website Only"
Write-Host "2. Deploy Public Website Only" 
Write-Host "3. Deploy Both Websites"
Write-Host ""

$choice = Read-Host "Choose option (1-3)"

switch ($choice) {
    "1" {
        Write-Host "🔧 Deploying Admin Website..." -ForegroundColor Blue
        
        # Backup current vercel.json
        if (Test-Path "vercel.json") {
            Copy-Item "vercel.json" "vercel-backup.json"
        }
        
        # Use admin config
        Copy-Item "vercel-admin.json" "vercel.json"
        
        # Deploy admin
        Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
        vercel --prod --name ikm-juara-admin
        
        # Restore original config
        if (Test-Path "vercel-backup.json") {
            Move-Item "vercel-backup.json" "vercel.json" -Force
        }
        
        Write-Host "✅ Admin website deployed successfully!" -ForegroundColor Green
        Write-Host "🌐 Admin URL: https://ikm-juara-admin.vercel.app" -ForegroundColor Cyan
    }
    
    "2" {
        Write-Host "🔧 Deploying Public Website..." -ForegroundColor Blue
        
        # Backup current vercel.json
        if (Test-Path "vercel.json") {
            Copy-Item "vercel.json" "vercel-backup.json"
        }
        
        # Use public config
        Copy-Item "vercel-public.json" "vercel.json"
        
        # Deploy public
        Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
        vercel --prod --name ikm-juara-public
        
        # Restore original config
        if (Test-Path "vercel-backup.json") {
            Move-Item "vercel-backup.json" "vercel.json" -Force
        }
        
        Write-Host "✅ Public website deployed successfully!" -ForegroundColor Green
        Write-Host "🌐 Public URL: https://ikm-juara-public.vercel.app" -ForegroundColor Cyan
    }
    
    "3" {
        Write-Host "🔧 Deploying Both Websites..." -ForegroundColor Blue
        
        # Backup current vercel.json
        if (Test-Path "vercel.json") {
            Copy-Item "vercel.json" "vercel-backup.json"
        }
        
        # Deploy Admin first
        Write-Host "📱 Deploying Admin Website..." -ForegroundColor Yellow
        Copy-Item "vercel-admin.json" "vercel.json"
        vercel --prod --name ikm-juara-admin
        
        Write-Host "✅ Admin deployed!" -ForegroundColor Green
        Start-Sleep -Seconds 3
        
        # Deploy Public second
        Write-Host "🌐 Deploying Public Website..." -ForegroundColor Yellow
        Copy-Item "vercel-public.json" "vercel.json"
        vercel --prod --name ikm-juara-public
        
        Write-Host "✅ Public deployed!" -ForegroundColor Green
        
        # Restore original config
        if (Test-Path "vercel-backup.json") {
            Move-Item "vercel-backup.json" "vercel.json" -Force
        }
        
        Write-Host ""
        Write-Host "🎉 BOTH WEBSITES DEPLOYED SUCCESSFULLY!" -ForegroundColor Green
        Write-Host "=================================================" -ForegroundColor Green
        Write-Host "🔐 Admin Website: https://ikm-juara-admin.vercel.app" -ForegroundColor Cyan
        Write-Host "🌐 Public Website: https://ikm-juara-public.vercel.app" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📋 ADMIN ACCESS:" -ForegroundColor Yellow
        Write-Host "   Username: BidIndustri08#"
        Write-Host "   Password: DisnakerKUKM2024!"
        Write-Host ""
        Write-Host "👥 PUBLIC ACCESS:" -ForegroundColor Yellow
        Write-Host "   Guest login dengan nama dan NIK"
    }
    
    default {
        Write-Host "❌ Invalid option. Please run the script again." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "📊 DEPLOYMENT SUMMARY:" -ForegroundColor Green
Write-Host "- Admin features: Full CRUD, Dashboard, Management"
Write-Host "- Public features: Search, View, Guest login"
Write-Host "- Both optimized for maximum performance"
Write-Host "- Separate domains for better security"
Write-Host ""
Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green