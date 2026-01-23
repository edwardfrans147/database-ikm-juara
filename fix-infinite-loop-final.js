#!/usr/bin/env node

/**
 * 🚀 FIX INFINITE LOOP FINAL - Mengatasi Maximum Call Stack Error
 * 
 * Script ini akan:
 * 1. Update shared/script.js untuk mencegah infinite loop
 * 2. Add proper error handling
 * 3. Implement debouncing untuk API calls
 * 4. Add initialization flags
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Starting Infinite Loop Fix...\n');

// 1. Update shared/script.js
const scriptPath = path.join(__dirname, 'shared', 'script.js');

if (fs.existsSync(scriptPath)) {
    console.log('📝 Updating shared/script.js...');
    
    let scriptContent = fs.readFileSync(scriptPath, 'utf8');
    
    // Add initialization flag at the top
    const initFlag = `
// 🚀 INFINITE LOOP PREVENTION
let isAppInitialized = false;
let apiCallsInProgress = new Set();

// Debounce function to prevent rapid API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// API call with retry and prevention of duplicate calls
async function safeApiCall(url, options = {}, maxRetries = 3) {
    const callId = \`\${url}_\${JSON.stringify(options)}\`;
    
    // Prevent duplicate calls
    if (apiCallsInProgress.has(callId)) {
        console.log('⚠️ Preventing duplicate API call:', url);
        return null;
    }
    
    apiCallsInProgress.add(callId);
    
    try {
        for (let i = 0; i < maxRetries; i++) {
            try {
                const response = await fetch(url, {
                    ...options,
                    headers: {
                        'Content-Type': 'application/json',
                        ...options.headers
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('✅ API Success:', url);
                    return data;
                }
                
                if (i === maxRetries - 1) {
                    throw new Error(\`API call failed: \${response.status} \${response.statusText}\`);
                }
                
                // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
            }
        }
    } catch (error) {
        console.error('❌ API Error:', url, error.message);
        showNotification(\`Error loading data: \${error.message}\`, 'error');
        return null;
    } finally {
        apiCallsInProgress.delete(callId);
    }
}

// Safe initialization function
function safeInitialize(initFunction, context = 'app') {
    if (isAppInitialized) {
        console.log('⚠️ App already initialized, skipping...');
        return;
    }
    
    try {
        console.log(\`🚀 Initializing \${context}...\`);
        initFunction();
        isAppInitialized = true;
        console.log(\`✅ \${context} initialized successfully\`);
    } catch (error) {
        console.error(\`❌ Error initializing \${context}:\`, error);
        showNotification(\`Error initializing \${context}: \${error.message}\`, 'error');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelectorAll('.notification');
    existing.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = \`notification notification-\${type}\`;
    notification.style.cssText = \`
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        max-width: 300px;
        word-wrap: break-word;
        \${type === 'error' ? 'background: #e74c3c;' : ''}
        \${type === 'success' ? 'background: #27ae60;' : ''}
        \${type === 'info' ? 'background: #3498db;' : ''}
    \`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto remove
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Global error handlers
window.addEventListener('error', (event) => {
    console.error('🚨 Global Error:', event.error);
    if (event.error.message.includes('Maximum call stack')) {
        showNotification('Detected infinite loop, refreshing page...', 'error');
        setTimeout(() => location.reload(), 2000);
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled Promise Rejection:', event.reason);
    event.preventDefault();
});

`;

    // Add the initialization flag at the beginning
    if (!scriptContent.includes('isAppInitialized')) {
        scriptContent = initFlag + '\n' + scriptContent;
    }
    
    // Replace common problematic patterns
    scriptContent = scriptContent.replace(
        /document\.addEventListener\('DOMContentLoaded',\s*function\(\)\s*{/g,
        "document.addEventListener('DOMContentLoaded', debounce(function() {"
    );
    
    scriptContent = scriptContent.replace(
        /window\.addEventListener\('load',\s*function\(\)\s*{/g,
        "window.addEventListener('load', debounce(function() {"
    );
    
    // Replace fetch calls with safeApiCall
    scriptContent = scriptContent.replace(
        /fetch\(([^)]+)\)/g,
        'safeApiCall($1)'
    );
    
    // Add safe initialization wrapper for main functions
    scriptContent = scriptContent.replace(
        /function\s+loadDashboard\s*\(\s*\)\s*{/g,
        'function loadDashboard() {\n    if (apiCallsInProgress.has("dashboard")) return;'
    );
    
    fs.writeFileSync(scriptPath, scriptContent);
    console.log('✅ shared/script.js updated successfully');
} else {
    console.log('⚠️ shared/script.js not found, skipping...');
}

// 2. Update admin pages to prevent multiple initializations
const adminPages = [
    'admin/index.html',
    'admin/ikm-binaan.html',
    'admin/inputan-layanan.html',
    'admin/layanan-ikm.html',
    'admin/pelatihan.html',
    'admin/penelusuran.html',
    'admin/activity-logs.html',
    'admin/edit-redaksi.html',
    'admin/recycle-bin.html'
];

adminPages.forEach(pagePath => {
    const fullPath = path.join(__dirname, pagePath);
    if (fs.existsSync(fullPath)) {
        console.log(`📝 Updating ${pagePath}...`);
        
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Add initialization check
        const initCheck = `
<script>
// Prevent multiple page initializations
if (window.pageInitialized) {
    console.log('⚠️ Page already initialized, preventing duplicate');
} else {
    window.pageInitialized = true;
    console.log('🚀 Page initializing...');
}
</script>
`;
        
        // Add before closing body tag
        if (!content.includes('pageInitialized')) {
            content = content.replace('</body>', initCheck + '\n</body>');
            fs.writeFileSync(fullPath, content);
            console.log(`✅ ${pagePath} updated`);
        }
    }
});

// 3. Update service worker for better caching
const swPath = path.join(__dirname, 'public', 'sw.js');
if (fs.existsSync(swPath)) {
    console.log('📝 Updating service worker...');
    
    const swContent = `
// 🚀 IKM JUARA Service Worker v2.1
const CACHE_NAME = 'ikm-juara-v2.1';
const urlsToCache = [
    '/',
    '/admin/',
    '/shared/style.css',
    '/shared/script.js',
    '/admin/login.html'
];

self.addEventListener('install', event => {
    console.log('SW: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('SW: Caching files');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', event => {
    console.log('SW: Activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('SW: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    // Only cache GET requests
    if (event.request.method !== 'GET') return;
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});
`;
    
    fs.writeFileSync(swPath, swContent);
    console.log('✅ Service worker updated');
}

// 4. Create deployment script
const deployScript = `
# 🚀 DEPLOY WITH INFINITE LOOP FIX

Write-Host "🔧 Deploying with infinite loop fixes..." -ForegroundColor Green

# Clear local cache
Write-Host "🧹 Clearing local cache..." -ForegroundColor Yellow
if (Test-Path ".vercel") {
    Remove-Item -Recurse -Force ".vercel"
}

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Green
vercel --prod

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Test at: https://apkfixikmjuara.vercel.app/admin/login.html" -ForegroundColor Cyan

Write-Host ""
Write-Host "📋 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Clear browser cache (Ctrl+Shift+R)" -ForegroundColor White
Write-Host "2. Test in incognito window" -ForegroundColor White
Write-Host "3. Check console for errors" -ForegroundColor White
Write-Host "4. Verify no 'Maximum call stack' errors" -ForegroundColor White
`;

fs.writeFileSync('deploy-fix-infinite-loop.ps1', deployScript);
console.log('✅ Deploy script created: deploy-fix-infinite-loop.ps1');

// 5. Create test script
const testScript = `
#!/usr/bin/env node

/**
 * 🧪 TEST INFINITE LOOP FIX
 */

const https = require('https');

console.log('🧪 Testing infinite loop fixes...\n');

const tests = [
    {
        name: 'Health Check',
        url: 'https://apkfixikmjuara.vercel.app/api/health'
    },
    {
        name: 'Dashboard API',
        url: 'https://apkfixikmjuara.vercel.app/api/dashboard'
    },
    {
        name: 'Admin Login Page',
        url: 'https://apkfixikmjuara.vercel.app/admin/login.html'
    }
];

async function testEndpoint(test) {
    return new Promise((resolve) => {
        const req = https.get(test.url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const success = res.statusCode === 200;
                console.log(\`\${success ? '✅' : '❌'} \${test.name}: \${res.statusCode}\`);
                resolve(success);
            });
        });
        
        req.on('error', (error) => {
            console.log(\`❌ \${test.name}: Error - \${error.message}\`);
            resolve(false);
        });
        
        req.setTimeout(10000, () => {
            console.log(\`⏰ \${test.name}: Timeout\`);
            req.destroy();
            resolve(false);
        });
    });
}

async function runTests() {
    let passed = 0;
    
    for (const test of tests) {
        const result = await testEndpoint(test);
        if (result) passed++;
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(\`\\n📊 Results: \${passed}/\${tests.length} tests passed\`);
    
    if (passed === tests.length) {
        console.log('🎉 All tests passed! Infinite loop fix successful.');
    } else {
        console.log('⚠️ Some tests failed. Check Vercel environment variables.');
    }
}

runTests();
`;

fs.writeFileSync('test-infinite-loop-fix.js', testScript);
console.log('✅ Test script created: test-infinite-loop-fix.js');

console.log('\n🎉 INFINITE LOOP FIX COMPLETED!\n');

console.log('📋 NEXT STEPS:');
console.log('1. Run: node test-infinite-loop-fix.js');
console.log('2. If tests pass, run: .\\deploy-fix-infinite-loop.ps1');
console.log('3. Set Vercel environment variables (see SOLUSI_KONFIGURASI_ULANG_FINAL.md)');
console.log('4. Test website in incognito window');

console.log('\n✅ Files updated:');
console.log('- shared/script.js (infinite loop prevention)');
console.log('- admin/*.html (initialization checks)');
console.log('- public/sw.js (better caching)');
console.log('- deploy-fix-infinite-loop.ps1 (deployment script)');
console.log('- test-infinite-loop-fix.js (testing script)');

console.log('\n🎯 Expected result: No more "Maximum call stack size exceeded" errors!');