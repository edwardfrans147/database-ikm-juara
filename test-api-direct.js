// Test API endpoints directly
const https = require('https');

const testEndpoint = (url, method = 'GET', data = null) => {
    return new Promise((resolve) => {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Node.js Test'
            }
        };

        const req = https.request(url, options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    body: body,
                    url: url
                });
            });
        });

        req.on('error', (error) => {
            resolve({
                status: 'ERROR',
                error: error.message,
                url: url
            });
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
};

async function testAPI() {
    console.log('🧪 TESTING API ENDPOINTS DIRECTLY...\n');

    const tests = [
        {
            name: 'Health Check',
            url: 'https://apkfixikmjuara.vercel.app/api/health'
        },
        {
            name: 'Login Test',
            url: 'https://apkfixikmjuara.vercel.app/api/login',
            method: 'POST',
            data: {
                username: 'BidIndustri08#',
                password: 'BidIndustri08#'
            }
        },
        {
            name: 'Dashboard',
            url: 'https://apkfixikmjuara.vercel.app/api/dashboard'
        }
    ];

    for (const test of tests) {
        console.log(`🔍 Testing: ${test.name}`);
        console.log(`   URL: ${test.url}`);
        
        const result = await testEndpoint(test.url, test.method, test.data);
        
        if (result.status === 'ERROR') {
            console.log(`   ❌ Error: ${result.error}`);
        } else {
            console.log(`   📊 Status: ${result.status}`);
            console.log(`   📄 Response: ${result.body.substring(0, 200)}${result.body.length > 200 ? '...' : ''}`);
        }
        console.log('');
    }
}

testAPI().catch(console.error);