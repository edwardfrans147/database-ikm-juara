// Test admin API endpoints secara urgent
const https = require('https');

const baseUrl = 'https://apkfixikmjuara.vercel.app';

function makeRequest(url, options = {}, data = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(body);
                    resolve({ status: res.statusCode, data: result });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });
        
        req.on('error', reject);
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

async function testAdminAPI() {
    console.log('🚨 URGENT: Testing admin API endpoints...\n');
    
    // Test dashboard
    console.log('📊 Testing dashboard...');
    try {
        const dashResult = await makeRequest(`${baseUrl}/api/admin/`);
        console.log(`Status: ${dashResult.status}`);
        if (dashResult.status === 200) {
            console.log('✅ Dashboard OK');
            console.log(`   IKM Binaan: ${dashResult.data.ikmBinaan}`);
            console.log(`   HKI Merek: ${dashResult.data.hkiMerek}`);
        } else {
            console.log('❌ Dashboard FAILED');
            console.log(`   Error: ${JSON.stringify(dashResult.data)}`);
        }
    } catch (error) {
        console.log('💥 Dashboard ERROR:', error.message);
    }
    
    console.log('');
    
    // Test login
    console.log('🔐 Testing login...');
    try {
        const loginResult = await makeRequest(`${baseUrl}/api/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            username: 'BidIndustri08#',
            password: 'BidIndustri08#'
        });
        
        console.log(`Status: ${loginResult.status}`);
        if (loginResult.status === 200) {
            console.log('✅ Login OK');
            console.log(`   User: ${loginResult.data.user?.nama}`);
        } else {
            console.log('❌ Login FAILED');
            console.log(`   Error: ${JSON.stringify(loginResult.data)}`);
        }
    } catch (error) {
        console.log('💥 Login ERROR:', error.message);
    }
    
    console.log('');
    
    // Test IKM Binaan
    console.log('🏢 Testing IKM Binaan...');
    try {
        const ikmResult = await makeRequest(`${baseUrl}/api/admin/ikm-binaan`);
        console.log(`Status: ${ikmResult.status}`);
        if (ikmResult.status === 200) {
            console.log('✅ IKM Binaan OK');
            console.log(`   Records: ${ikmResult.data.data?.length || 0}`);
        } else {
            console.log('❌ IKM Binaan FAILED');
            console.log(`   Error: ${JSON.stringify(ikmResult.data)}`);
        }
    } catch (error) {
        console.log('💥 IKM Binaan ERROR:', error.message);
    }
    
    console.log('');
    
    // Test HKI Merek
    console.log('🏷️ Testing HKI Merek...');
    try {
        const hkiResult = await makeRequest(`${baseUrl}/api/admin/hki-merek`);
        console.log(`Status: ${hkiResult.status}`);
        if (hkiResult.status === 200) {
            console.log('✅ HKI Merek OK');
            console.log(`   Records: ${hkiResult.data.data?.length || 0}`);
        } else {
            console.log('❌ HKI Merek FAILED');
            console.log(`   Error: ${JSON.stringify(hkiResult.data)}`);
        }
    } catch (error) {
        console.log('💥 HKI Merek ERROR:', error.message);
    }
    
    console.log('');
    
    // Test Pelatihan
    console.log('🎓 Testing Pelatihan...');
    try {
        const pelatihanResult = await makeRequest(`${baseUrl}/api/admin/pelatihan-pemberdayaan`);
        console.log(`Status: ${pelatihanResult.status}`);
        if (pelatihanResult.status === 200) {
            console.log('✅ Pelatihan OK');
            console.log(`   Records: ${pelatihanResult.data.data?.length || 0}`);
        } else {
            console.log('❌ Pelatihan FAILED');
            console.log(`   Error: ${JSON.stringify(pelatihanResult.data)}`);
        }
    } catch (error) {
        console.log('💥 Pelatihan ERROR:', error.message);
    }
    
    console.log('\n🎯 URGENT TEST COMPLETED!');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Clear browser cache (Ctrl+Shift+R)');
    console.log('2. Try accessing admin pages again');
    console.log('3. Check browser console for any remaining errors');
}

testAdminAPI();