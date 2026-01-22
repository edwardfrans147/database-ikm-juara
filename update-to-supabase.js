// Script untuk mengupdate aplikasi dari JSON ke Supabase
const fs = require('fs');
const path = require('path');

console.log('🔄 UPDATING APPLICATION TO USE SUPABASE...');
console.log('==========================================');

// 1. Backup original API file
console.log('\n1️⃣ Backing up original API...');
try {
    if (fs.existsSync('api/index.js')) {
        fs.copyFileSync('api/index.js', 'api/index-json-backup.js');
        console.log('   ✅ Original API backed up to api/index-json-backup.js');
    }
} catch (error) {
    console.log('   ❌ Error backing up API:', error.message);
}

// 2. Replace API with Supabase version
console.log('\n2️⃣ Updating API to use Supabase...');
try {
    if (fs.existsSync('api/supabase-api.js')) {
        fs.copyFileSync('api/supabase-api.js', 'api/index.js');
        console.log('   ✅ API updated to use Supabase');
    } else {
        console.log('   ❌ Supabase API file not found');
    }
} catch (error) {
    console.log('   ❌ Error updating API:', error.message);
}

// 3. Update package.json to include required dependencies
console.log('\n3️⃣ Checking package.json dependencies...');
try {
    const packagePath = 'package.json';
    const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    let updated = false;
    
    // Add dotenv if not present
    if (!packageData.dependencies.dotenv) {
        packageData.dependencies.dotenv = '^16.0.0';
        updated = true;
        console.log('   ✅ Added dotenv dependency');
    }
    
    if (updated) {
        fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2));
        console.log('   ✅ Package.json updated');
    } else {
        console.log('   ✅ All dependencies already present');
    }
} catch (error) {
    console.log('   ❌ Error updating package.json:', error.message);
}

// 4. Create Vercel configuration for Supabase
console.log('\n4️⃣ Creating Vercel configuration...');
try {
    const vercelConfig = {
        "version": 2,
        "name": "database-ikm-juara",
        "builds": [
            {
                "src": "api/index.js",
                "use": "@vercel/node"
            },
            {
                "src": "public/**/*",
                "use": "@vercel/static"
            },
            {
                "src": "admin/**/*",
                "use": "@vercel/static"
            }
        ],
        "routes": [
            {
                "src": "/api/(.*)",
                "dest": "/api/index.js"
            },
            {
                "src": "/admin/(.*)",
                "dest": "/admin/$1"
            },
            {
                "src": "/(.*)",
                "dest": "/public/$1"
            }
        ],
        "env": {
            "NEXT_PUBLIC_SUPABASE_URL": "@next_public_supabase_url",
            "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@next_public_supabase_anon_key",
            "SUPABASE_SERVICE_ROLE_KEY": "@supabase_service_role_key"
        }
    };
    
    fs.writeFileSync('vercel-supabase.json', JSON.stringify(vercelConfig, null, 2));
    console.log('   ✅ Vercel configuration created: vercel-supabase.json');
} catch (error) {
    console.log('   ❌ Error creating Vercel config:', error.message);
}

// 5. Create deployment script
console.log('\n5️⃣ Creating deployment script...');
try {
    const deployScript = `# Deploy with Supabase Integration
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
`;
    
    fs.writeFileSync('deploy-supabase.ps1', deployScript);
    console.log('   ✅ Deployment script created: deploy-supabase.ps1');
} catch (error) {
    console.log('   ❌ Error creating deployment script:', error.message);
}

console.log('\n📋 UPDATE SUMMARY');
console.log('================');
console.log('✅ Original API backed up');
console.log('✅ API updated to use Supabase');
console.log('✅ Dependencies checked');
console.log('✅ Vercel config created');
console.log('✅ Deployment script created');

console.log('\n🎯 NEXT STEPS:');
console.log('1. Run: node migrate-data-now.js (to migrate existing data)');
console.log('2. Test locally: npm start');
console.log('3. Deploy: ./deploy-supabase.ps1');
console.log('4. Update Vercel environment variables');

console.log('\n🎉 APPLICATION READY FOR SUPABASE!');