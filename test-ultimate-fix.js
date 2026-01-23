// Test ultimate admin fix script
const https = require('https');

const baseUrl = 'https://apkfixikmjuara.vercel.app';

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({ status: res.statusCode, body: body });
            });
        });
        
        req.on('error', reject);
        req.end();
    });
}

async function testUltimateFix() {
    console.log('🚀 TESTING ULTIMATE ADMIN FIX...\n');
    
    // Test ultimate-admin-fix.js accessibility
    console.log('📄 Testing ultimate-admin-fix.js...');
    try {
        const result = await makeRequest(`${baseUrl}/shared/ultimate-admin-fix.js`);
        console.log(`Status: ${result.status}`);
        if (result.status === 200) {
            console.log('✅ ultimate-admin-fix.js accessible');
            console.log(`   Size: ${result.body.length} bytes`);
            
            // Check if it contains key functions
            const hasUltimateRequest = result.body.includes('ultimateAPIRequest');
            const hasFetchOverride = result.body.includes('window.fetch = function');
            const hasErrorRecovery = result.body.includes('error recovery');
            
            console.log(`   Contains ultimateAPIRequest: ${hasUltimateRequest ? '✅' : '❌'}`);
            console.log(`   Contains fetch override: ${hasFetchOverride ? '✅' : '❌'}`);
            console.log(`   Contains error recovery: ${hasErrorRecovery ? '✅' : '❌'}`);
        } else {
            console.log('❌ ultimate-admin-fix.js NOT accessible');
        }
    } catch (error) {
        console.log('💥 ultimate-admin-fix.js ERROR:', error.message);
    }
    
    console.log('');
    
    // Test admin page accessibility
    const adminPages = [
        '/admin/index.html',
        '/admin/ikm-binaan.html',
        '/admin/pelatihan.html'
    ];
    
    for (const page of adminPages) {
        console.log(`📄 Testing: ${page}`);
        try {
            const result = await makeRequest(`${baseUrl}${page}`);
            console.log(`   Status: ${result.status}`);
            if (result.status === 200) {
                const hasUltimateScript = result.body.includes('ultimate-admin-fix.js');
                console.log(`   Contains ultimate script: ${hasUltimateScript ? '✅' : '❌'}`);
            }
        } catch (error) {
            console.log(`   💥 ERROR: ${error.message}`);
        }
        console.log('');
    }
    
    // Test core API endpoints
    console.log('📡 Testing core API endpoints...');
    const endpoints = ['/api/dashboard', '/api/ikm-binaan', '/api/pelatihan-pemberdayaan'];
    
    for (const endpoint of endpoints) {
        try {
            const result = await makeRequest(`${baseUrl}${endpoint}`);
            console.log(`   ${endpoint}: Status ${result.status} ${result.status === 200 ? '✅' : '❌'}`);
        } catch (error) {
            console.log(`   ${endpoint}: ERROR ${error.message}`);
        }
    }
    
    console.log('\n🎯 ULTIMATE FIX TEST COMPLETED!');
    console.log('\n📋 FINAL INSTRUCTIONS FOR USER:');
    console.log('1. 🔄 HARD REFRESH: Ctrl+Shift+R (VERY IMPORTANT!)');
    console.log('2. 🧹 CLEAR ALL CACHE: F12 > Application > Storage > Clear site data');
    console.log('3. 🔐 LOGIN FRESH: https://apkfixikmjuara.vercel.app/admin/login.html');
    console.log('4. 👀 WATCH CONSOLE: Should see "ULTIMATE ADMIN FIX - Loaded Successfully"');
    console.log('5. ✅ VERIFY: Green success alerts should appear');
    console.log('\n🛡️ The ultimate fix includes:');
    console.log('   - Complete API call interception');
    console.log('   - Automatic error recovery');
    console.log('   - Fetch function override');
    console.log('   - Smart data loading');
    console.log('   - User-friendly alerts');
}

testUltimateFix();