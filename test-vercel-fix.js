// TEST SCRIPT: Verifikasi Fix Vercel Environment Variables
const https = require('https');

console.log('🧪 TESTING VERCEL DEPLOYMENT FIX...\n');

// Test URLs
const baseUrl = 'https://apkfixikmjuara.vercel.app';
const tests = [
    {
        name: 'API Health Check',
        url: `${baseUrl}/api/health`,
        expected: 'status'
    },
    {
        name: 'Website Loading',
        url: `${baseUrl}/login.html`,
        expected: 'html'
    },
    {
        name: 'Admin Dashboard',
        url: `${baseUrl}/admin/`,
        expected: 'html'
    }
];

// Function to test URL
function testUrl(test) {
    return new Promise((resolve) => {
        const startTime = Date.now();
        
        https.get(test.url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                const responseTime = Date.now() - startTime;
                const success = res.statusCode === 200;
                
                console.log(`${success ? '✅' : '❌'} ${test.name}`);
                console.log(`   URL: ${test.url}`);
                console.log(`   Status: ${res.statusCode}`);
                console.log(`   Response Time: ${responseTime}ms`);
                
                if (test.expected === 'status' && success) {
                    try {
                        const json = JSON.parse(data);
                        console.log(`   Database: ${json.database || 'Unknown'}`);
                        console.log(`   Version: ${json.version || 'Unknown'}`);
                    } catch (e) {
                        console.log(`   Response: ${data.substring(0, 100)}...`);
                    }
                }
                
                console.log('');
                resolve({ success, responseTime, status: res.statusCode });
            });
        }).on('error', (err) => {
            console.log(`❌ ${test.name}`);
            console.log(`   URL: ${test.url}`);
            console.log(`   Error: ${err.message}`);
            console.log('');
            resolve({ success: false, error: err.message });
        });
    });
}

// Run all tests
async function runTests() {
    console.log('🚀 Starting tests...\n');
    
    const results = [];
    for (const test of tests) {
        const result = await testUrl(test);
        results.push({ ...test, ...result });
        
        // Wait 1 second between tests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Summary
    console.log('📊 TEST SUMMARY:');
    console.log('================');
    
    const passed = results.filter(r => r.success).length;
    const total = results.length;
    
    console.log(`✅ Passed: ${passed}/${total}`);
    console.log(`❌ Failed: ${total - passed}/${total}`);
    
    if (passed === total) {
        console.log('\n🎉 ALL TESTS PASSED! Website is working correctly.');
        console.log('\n📋 Next Steps:');
        console.log('   1. Test buku tamu form submission');
        console.log('   2. Test admin login and dashboard');
        console.log('   3. Test search functionality');
    } else {
        console.log('\n⚠️  Some tests failed. Check the errors above.');
        console.log('\n🔧 Troubleshooting:');
        console.log('   1. Verify environment variables are set in Vercel');
        console.log('   2. Check if redeploy completed successfully');
        console.log('   3. Wait a few minutes for DNS propagation');
    }
}

// Run the tests
runTests().catch(console.error);