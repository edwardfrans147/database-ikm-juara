
/**
 * 🧪 TEST INFINITE LOOP FIX
 */

const https = require('https');

console.log('🧪 Testing infinite loop fixes...
');

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
                console.log(`${success ? '✅' : '❌'} ${test.name}: ${res.statusCode}`);
                resolve(success);
            });
        });
        
        req.on('error', (error) => {
            console.log(`❌ ${test.name}: Error - ${error.message}`);
            resolve(false);
        });
        
        req.setTimeout(10000, () => {
            console.log(`⏰ ${test.name}: Timeout`);
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
    
    console.log(`\n📊 Results: ${passed}/${tests.length} tests passed`);
    
    if (passed === tests.length) {
        console.log('🎉 All tests passed! Infinite loop fix successful.');
    } else {
        console.log('⚠️ Some tests failed. Check Vercel environment variables.');
    }
}

runTests();
