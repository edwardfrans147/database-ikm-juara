// TEST DIRECT: Buku Tamu API
const https = require('https');

console.log('🧪 TESTING BUKU TAMU API DIRECTLY...\n');

const testData = {
    nama_lengkap: 'Test User',
    no_hp_aktif: '081234567890',
    alamat: 'Jl. Test No. 123, Madiun'
};

function testBukuTamu() {
    return new Promise((resolve) => {
        const postData = JSON.stringify(testData);
        
        const options = {
            hostname: 'apkfixikmjuara.vercel.app',
            port: 443,
            path: '/api/buku-tamu',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        console.log('📤 Sending POST request to /api/buku-tamu');
        console.log('📋 Data:', testData);
        
        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log(`\n📊 Response Status: ${res.statusCode}`);
                console.log('📄 Response Headers:', res.headers);
                
                try {
                    const jsonData = JSON.parse(data);
                    console.log('✅ Response JSON:', jsonData);
                    
                    if (res.statusCode === 200 && jsonData.success) {
                        console.log('\n🎉 SUCCESS: Buku tamu API working correctly!');
                    } else {
                        console.log('\n❌ FAILED: API returned error');
                    }
                } catch (e) {
                    console.log('📄 Raw Response:', data);
                    console.log('\n❌ FAILED: Invalid JSON response');
                }
                
                resolve();
            });
        });
        
        req.on('error', (err) => {
            console.log('\n❌ REQUEST ERROR:', err.message);
            resolve();
        });
        
        req.write(postData);
        req.end();
    });
}

// Test health endpoint too
function testHealth() {
    return new Promise((resolve) => {
        console.log('\n🔍 Testing health endpoint...');
        
        https.get('https://apkfixikmjuara.vercel.app/api/health', (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log(`📊 Health Status: ${res.statusCode}`);
                
                if (res.statusCode === 200) {
                    try {
                        const jsonData = JSON.parse(data);
                        console.log('✅ Health Response:', jsonData);
                    } catch (e) {
                        console.log('📄 Health Raw:', data);
                    }
                } else {
                    console.log('❌ Health Failed:', data);
                }
                
                resolve();
            });
        }).on('error', (err) => {
            console.log('❌ Health Error:', err.message);
            resolve();
        });
    });
}

// Run tests
async function runTests() {
    await testHealth();
    await testBukuTamu();
    
    console.log('\n🏁 Testing completed!');
    console.log('\n💡 If APIs are still failing:');
    console.log('   1. Check Vercel deployment status');
    console.log('   2. Verify environment variables are set');
    console.log('   3. Wait for deployment to complete (2-3 minutes)');
}

runTests().catch(console.error);