// Test semua endpoint yang hilang dan baru ditambahkan
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

async function testAllMissingEndpoints() {
    console.log('🚨 TESTING ALL MISSING ENDPOINTS...\n');
    
    const tests = [
        {
            name: 'Search IKM',
            url: `${baseUrl}/api/search-ikm`,
            method: 'POST',
            data: { query: '1234567890123' }
        },
        {
            name: 'Validate NIB/NIK',
            url: `${baseUrl}/api/validate-nib-nik`,
            method: 'POST',
            data: { nib: '1234567890123' }
        },
        {
            name: 'Activity Logs',
            url: `${baseUrl}/api/activity-logs`,
            method: 'GET'
        },
        {
            name: 'Activity Logs Stats',
            url: `${baseUrl}/api/activity-logs/stats`,
            method: 'GET'
        },
        {
            name: 'Website Content',
            url: `${baseUrl}/api/website-content`,
            method: 'GET'
        },
        {
            name: 'Recycle Bin',
            url: `${baseUrl}/api/recycle-bin`,
            method: 'GET'
        },
        {
            name: 'Export Search Result',
            url: `${baseUrl}/api/export-search-result`,
            method: 'POST',
            data: { searchResults: [], format: 'json' }
        },
        {
            name: 'Import IKM Binaan',
            url: `${baseUrl}/api/import/ikm-binaan`,
            method: 'POST',
            data: { data: [] }
        },
        {
            name: 'Get Peserta Pelatihan',
            url: `${baseUrl}/api/pelatihan-pemberdayaan/test-id/peserta`,
            method: 'GET'
        }
    ];
    
    for (const test of tests) {
        try {
            console.log(`📡 Testing: ${test.name}`);
            
            const options = {
                method: test.method,
                headers: { 'Content-Type': 'application/json' }
            };
            
            const result = await makeRequest(test.url, options, test.data);
            
            console.log(`   Status: ${result.status}`);
            
            if (result.status === 200) {
                console.log('   ✅ SUCCESS');
                if (result.data.success !== undefined) {
                    console.log(`   Response: ${result.data.success ? 'Success' : 'Failed'}`);
                }
            } else if (result.status === 404) {
                console.log('   ❌ STILL 404 - ENDPOINT NOT FOUND');
            } else if (result.status === 405) {
                console.log('   ⚠️ METHOD NOT ALLOWED (but endpoint exists)');
            } else {
                console.log('   ⚠️ OTHER ERROR');
                console.log(`   Error: ${JSON.stringify(result.data).substring(0, 100)}`);
            }
            
        } catch (error) {
            console.log(`   💥 REQUEST ERROR: ${error.message}`);
        }
        
        console.log('');
    }
    
    console.log('🎯 ENDPOINT TESTING COMPLETED!');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Clear browser cache (Ctrl+Shift+R)');
    console.log('2. Login to admin panel');
    console.log('3. Test all admin pages');
    console.log('4. Check browser console for remaining errors');
}

testAllMissingEndpoints();