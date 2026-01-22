# DEPLOY KEDUA WEBSITE SEKARANG
Write-Host "DEPLOYING ADMIN WEBSITE..." -ForegroundColor Green
Copy-Item "vercel-admin.json" "vercel.json" -Force
vercel --prod --yes

Write-Host "DEPLOYING PUBLIC WEBSITE..." -ForegroundColor Green  
Copy-Item "vercel-public.json" "vercel.json" -Force
vercel --prod --yes

Write-Host "DEPLOYMENT COMPLETED!" -ForegroundColor Green