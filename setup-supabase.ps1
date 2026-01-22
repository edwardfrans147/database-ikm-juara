# SETUP SUPABASE DATABASE CONNECTION
Write-Host "Setting up Supabase Database..." -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Check if Supabase client is installed
Write-Host "Checking Supabase client..." -ForegroundColor Yellow
$supabaseInstalled = Get-Command "supabase" -ErrorAction SilentlyContinue

if (!$supabaseInstalled) {
    Write-Host "Supabase CLI not found. Installing..." -ForegroundColor Yellow
    
    # Try to install via npm
    try {
        npm install -g supabase
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Supabase CLI installed successfully!" -ForegroundColor Green
        } else {
            Write-Host "Failed to install Supabase CLI via npm" -ForegroundColor Red
            Write-Host "Please install manually: npm install -g supabase" -ForegroundColor Yellow
            exit 1
        }
    } catch {
        Write-Host "Error installing Supabase CLI: $_" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Supabase CLI already installed" -ForegroundColor Green
}

# Check environment variables
Write-Host ""
Write-Host "Checking environment variables..." -ForegroundColor Yellow

$envFile = ".env.local"
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile -Raw
    
    if ($envContent -match "your-project-id") {
        Write-Host "Environment variables not configured yet" -ForegroundColor Yellow
        Write-Host "Please update .env.local with your Supabase credentials" -ForegroundColor Yellow
    } else {
        Write-Host "Environment variables configured" -ForegroundColor Green
    }
} else {
    Write-Host ".env.local file not found" -ForegroundColor Red
}

# Test connection if environment is configured
Write-Host ""
Write-Host "Testing Supabase connection..." -ForegroundColor Yellow

try {
    $testResult = node test-supabase-connection.js
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Supabase connection test passed!" -ForegroundColor Green
    } else {
        Write-Host "Connection test failed - please check configuration" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Could not run connection test - environment may not be configured" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "SETUP CHECKLIST:" -ForegroundColor Cyan
Write-Host "================" -ForegroundColor Cyan
Write-Host "1. Create Supabase project at: https://supabase.com/dashboard"
Write-Host "2. Get your project URL and API keys from Settings -> API"
Write-Host "3. Update .env.local with your credentials"
Write-Host "4. Run database schema: Copy supabase-schema.sql to SQL Editor"
Write-Host "5. Test connection: node test-supabase-connection.js"
Write-Host "6. Migrate data: node scripts/migrate-to-supabase.js"

Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Follow the guide in SUPABASE_SETUP_STEP_BY_STEP.md"
Write-Host "2. Update Vercel environment variables"
Write-Host "3. Test both admin and public websites"

Write-Host ""
Write-Host "USEFUL LINKS:" -ForegroundColor Cyan
Write-Host "- Supabase Dashboard: https://supabase.com/dashboard"
Write-Host "- Documentation: https://supabase.com/docs"
Write-Host "- SQL Editor: Access via Supabase Dashboard"