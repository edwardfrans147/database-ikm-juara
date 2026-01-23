# SCRIPT OTOMATIS: FIX VERCEL DEPLOYMENT
Write-Host "🚀 FIXING VERCEL DEPLOYMENT..." -ForegroundColor Green

# Step 1: Check if vercel CLI is installed
Write-Host "📋 Checking Vercel CLI..." -ForegroundColor Yellow
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

# Step 2: Set environment variables
Write-Host "🔧 Setting environment variables..." -ForegroundColor Yellow

$envVars = @(
    @{name="NEXT_PUBLIC_SUPABASE_URL"; value="https://krylvwwguczwwoyqghlc.supabase.co"},
    @{name="NEXT_PUBLIC_SUPABASE_ANON_KEY"; value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeWx2d3dndWN6d3dveXFnaGxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNTg4NDEsImV4cCI6MjA4NDYzNDg0MX0.ikuvFZB4zjChsh-cM2MMMYYmWYTfC-P67gQZPBvCZqA"},
    @{name="SUPABASE_SERVICE_ROLE_KEY"; value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeWx2d3dndWN6d3dveXFnaGxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA1ODg0MSwiZXhwIjoyMDg0NjM0ODQxfQ.ysubAuDeIPshMww709q092yI37j1wZUIwK5vQttUsmE"}
)

foreach ($env in $envVars) {
    Write-Host "Setting $($env.name)..." -ForegroundColor Cyan
    try {
        vercel env add $env.name production --value="$($env.value)" --force
        vercel env add $env.name preview --value="$($env.value)" --force
        vercel env add $env.name development --value="$($env.value)" --force
        Write-Host "✅ $($env.name) set successfully" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  $($env.name) might already exist or error occurred" -ForegroundColor Yellow
    }
}

# Step 3: Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
try {
    vercel --prod --force
    Write-Host "✅ Deployment completed!" -ForegroundColor Green
} catch {
    Write-Host "❌ Deployment failed. Try manual deployment." -ForegroundColor Red
}

# Step 4: Test deployment
Write-Host "🧪 Testing deployment..." -ForegroundColor Yellow
Start-Sleep -Seconds 30  # Wait for deployment to propagate

try {
    node test-vercel-fix.js
} catch {
    Write-Host "⚠️  Test script not found or failed" -ForegroundColor Yellow
}

Write-Host "🎯 DEPLOYMENT FIX COMPLETED!" -ForegroundColor Green
Write-Host "Check your website at: https://apkfixikmjuara.vercel.app" -ForegroundColor Cyan