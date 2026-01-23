// Test final untuk memastikan semua sudah bekerja
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

async function testFinalFix() {
    console.log('🚨 FINAL TEST: Checking all components...\n');
    
    // Test admin-fix.js accessibility
    console.log('📄 Testing admin-fix.js...');
    try {
        const result = await makeRequest(`${baseUrl}/shared/admin-fix.js`);
        console.log(`Status: ${result.status}`);
        if (result.status === 200) {
            console.log('✅ admin-fix.js accessible');
            console.log(`   Size: ${result.body.length} bytes`);
        } else {
            console.log('❌ admin-fix.js NOT accessible');
        }
    } catch (error) {
        console.log('💥 admin-fix.js ERROR:', error.message);
    }
    
    console.log('');
    
    // Test main API endpoints
    const endpoints = [
        '/api/dashboard',
        '/api/ikm-binaan',
        '/api/pelatihan-pemberdayaan'
    ];
    
    for (const endpoint of endpoints) {
        console.log(`📡 Testing: ${endpoint}`);
        try {
            const result = await makeRequest(`${baseUrl}${endpoint}`);
            console.log(`Status: ${result.status}`);
            if (result.status === 200) {
                console.log('✅ OK');
            } else {
                console.log('❌ FAILED');
            }
        } catch (error) {
            console.log('💥 ERROR:', error.message);
        }
        console.log('');
    }
    
    console.log('🎯 FINAL TEST COMPLETED!');
    console.log('\n📋 INSTRUCTIONS FOR USER:');
    console.log('1. CLEAR BROWSER CACHE: Ctrl+Shift+R');
    console.log('2. LOGIN: https://apkfixikmjuara.vercel.app/admin/login.html');
    console.log('3. USE: BidIndustri08# / BidIndustri08#');
    console.log('4. CHECK: All admin pages should work now');
    console.log('\n🔧 If still not working:');
    console.log('   - Open Developer Tools (F12)');
    console.log('   - Check Console for errors');
    console.log('   - Look for admin-fix.js loading');
}

testFinalFix();