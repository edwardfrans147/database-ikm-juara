// TEST MAIN WEBSITE
const https = require('https');

console.log('🧪 TESTING MAIN WEBSITE...\n');

const tests = [
    'https://apkfixikmjuara.vercel.app/',
    'https://apkfixikmjuara.vercel.app/index.html',
    'https://apkfixikmjuara.vercel.app/public/login.html',
    'https://apkfixikmjuara.vercel.app/admin/index.html'
];

function testUrl(url) {
    return new Promise((resolve) => {
        const startTime = Date.now();
        
        https.get(url, (res) => {
            const responseTime = Date.now() - startTime;
            const success = res.statusCode === 200;
            
            console.log(`${success ? '✅' : '❌'} ${url}`);
            console.log(`   Status: ${res.statusCode} | Time: ${responseTime}ms`);
            
            resolve({ success, status: res.statusCode });
        }).on('error', (err) => {
            console.log(`❌ ${url}`);
            console.log(`   Error: ${err.message}`);
            resolve({ success: false, error: err.message });
        });
    });
}

async function runTests() {
    for (const url of tests) {
        await testUrl(url);
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n🏁 Testing completed!');
}

runTests().catch(console.error);