// Test semua endpoint yang dibutuhkan dashboard
const https = require('https');

const baseUrl = 'https://apkfixikmjuara.vercel.app';

function makeRequest(url, options = {}) {
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
        req.end();
    });
}

async function testDashboardEndpoints() {
    const endpoints = [
        '/api/dashboard',
        '/api/ikm-binaan',
        '/api/hki-merek',
        '/api/sertifikat-halal',
        '/api/tkdn-ik',
        '/api/siinas',
        '/api/uji-nilai-gizi',
        '/api/kurasi-produk',
        '/api/pelatihan-pemberdayaan'
    ];
    
    console.log('🧪 Testing dashboard endpoints...\n');
    
    for (const endpoint of endpoints) {
        try {
            console.log(`📡 Testing: ${endpoint}`);
            
            const result = await makeRequest(`${baseUrl}${endpoint}`);
            
            if (result.status === 200) {
                console.log(`✅ ${endpoint} - OK`);
                if (result.data.data) {
                    console.log(`   📊 Records: ${result.data.data.length || 'N/A'}`);
                } else if (typeof result.data === 'object') {
                    console.log(`   📊 Data keys: ${Object.keys(result.data).join(', ')}`);
                }
            } else {
                console.log(`❌ ${endpoint} - Status: ${result.status}`);
                console.log(`   Error: ${JSON.stringify(result.data)}`);
            }
            
        } catch (error) {
            console.log(`💥 ${endpoint} - Error: ${error.message}`);
        }
        
        console.log(''); // Empty line for readability
    }
    
    console.log('🎯 Dashboard endpoint testing completed!');
}

testDashboardEndpoints();