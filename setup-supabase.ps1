# SETUP SUPABASE DATABASE CONNECTION
Write-Host "🗄️ SETTING UP SUPABASE DATABASE..." -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green

# Install Supabase CLI if not exists
if (!(Get-Command "supabase" -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Installing Supabase CLI..." -ForegroundColor Yellow
    npm install -g supabase
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Supabase CLI" -ForegroundColor Red
        Write-Host "Please install manually: npm install -g supabase" -ForegroundColor Yellow
        exit 1
    }
}

# Initialize Supabase project
Write-Host "🚀 Initializing Supabase project..." -ForegroundColor Blue
supabase init

# Create migration files for our database schema
Write-Host "📝 Creating database schema..." -ForegroundColor Blue

# Create the migration directory if it doesn't exist
if (!(Test-Path "supabase/migrations")) {
    New-Item -ItemType Directory -Path "supabase/migrations" -Force
}

Write-Host "✅ Supabase project initialized!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Create Supabase project at: https://supabase.com/dashboard"
Write-Host "2. Get your project URL and API keys"
Write-Host "3. Run the database migration script"
Write-Host "4. Update environment variables"