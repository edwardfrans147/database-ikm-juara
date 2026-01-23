// Test debug API endpoints
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

async function testDebugAPI() {
    console.log('🧪 TESTING DEBUG API ENDPOINTS...\n');

    // Wait for deployment
    console.log('⏳ Waiting for deployment...');
    await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 minute

    const tests = [
        {
            name: 'Clear Cache',
            url: 'https://apkfixikmjuara.vercel.app/api/clear-cache'
        },
        {
            name: 'Debug Dashboard',
            url: 'https://apkfixikmjuara.vercel.app/api/dashboard-debug'
        },
        {
            name: 'Regular Dashboard (after cache clear)',
            url: 'https://apkfixikmjuara.vercel.app/api/dashboard'
        }
    ];

    for (const test of tests) {
        console.log(`🔍 Testing: ${test.name}`);
        console.log(`   URL: ${test.url}`);
        
        const result = await testEndpoint(test.url);
        
        if (result.status === 'ERROR') {
            console.log(`   ❌ Error: ${result.error}`);
        } else {
            console.log(`   📊 Status: ${result.status}`);
            
            try {
                const data = JSON.parse(result.body);
                if (data.ikmBinaan !== undefined) {
                    console.log(`   📈 Data counts:`);
                    console.log(`      IKM Binaan: ${data.ikmBinaan}`);
                    console.log(`      HKI Merek: ${data.hkiMerek}`);
                    console.log(`      Sertifikat Halal: ${data.sertifikatHalal}`);
                    console.log(`      TKDN IK: ${data.tkdnIk}`);
                    console.log(`      SIINas: ${data.siinas}`);
                    console.log(`      Uji Nilai Gizi: ${data.ujiNilaiGizi}`);
                    console.log(`      Kurasi Produk: ${data.kurasiProduk}`);
                    console.log(`      Pelatihan: ${data.pelatihanPemberdayaan}`);
                    console.log(`      Peserta: ${data.totalPesertaPelatihan}`);
                } else {
                    console.log(`   📄 Response: ${result.body.substring(0, 200)}`);
                }
            } catch (e) {
                console.log(`   📄 Response: ${result.body.substring(0, 200)}`);
            }
        }
        console.log('');
    }
}

testDebugAPI().catch(console.error);