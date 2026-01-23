// Test all API endpoints to see which ones work
const https = require('https');

const testEndpoint = (url) => {
    return new Promise((resolve) => {
        const req = https.request(url, { method: 'GET' }, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
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
        
        req.end();
    });
};

async function testAllEndpoints() {
    console.log('🧪 TESTING ALL API ENDPOINTS...\n');

    const endpoints = [
        { name: 'Dashboard', url: 'https://apkfixikmjuara.vercel.app/api/dashboard' },
        { name: 'IKM Binaan', url: 'https://apkfixikmjuara.vercel.app/api/ikm-binaan' },
        { name: 'HKI Merek', url: 'https://apkfixikmjuara.vercel.app/api/hki-merek' },
        { name: 'Sertifikat Halal', url: 'https://apkfixikmjuara.vercel.app/api/sertifikat-halal' },
        { name: 'TKDN IK', url: 'https://apkfixikmjuara.vercel.app/api/tkdn-ik' },
        { name: 'SIINas', url: 'https://apkfixikmjuara.vercel.app/api/siinas' },
        { name: 'Uji Nilai Gizi', url: 'https://apkfixikmjuara.vercel.app/api/uji-nilai-gizi' },
        { name: 'Kurasi Produk', url: 'https://apkfixikmjuara.vercel.app/api/kurasi-produk' },
        { name: 'Pelatihan', url: 'https://apkfixikmjuara.vercel.app/api/pelatihan-pemberdayaan' }
    ];

    for (const endpoint of endpoints) {
        console.log(`🔍 Testing: ${endpoint.name}`);
        console.log(`   URL: ${endpoint.url}`);
        
        const result = await testEndpoint(endpoint.url);
        
        if (result.status === 'ERROR') {
            console.log(`   ❌ Error: ${result.error}`);
        } else {
            console.log(`   📊 Status: ${result.status}`);
            
            try {
                const data = JSON.parse(result.body);
                if (data.success && data.data) {
                    console.log(`   📈 Records: ${data.data.length}`);
                    if (data.data.length > 0) {
                        const sample = data.data[0];
                        const keys = Object.keys(sample).slice(0, 3);
                        console.log(`   📄 Sample fields: ${keys.join(', ')}`);
                    }
                } else if (data.ikmBinaan !== undefined) {
                    console.log(`   📈 Dashboard counts: IKM=${data.ikmBinaan}, HKI=${data.hkiMerek}, etc.`);
                } else {
                    console.log(`   📄 Response: ${result.body.substring(0, 100)}...`);
                }
            } catch (e) {
                console.log(`   📄 Response: ${result.body.substring(0, 100)}...`);
            }
        }
        console.log('');
    }
}

testAllEndpoints().catch(console.error);