// Test login API setelah perbaikan
const https = require('https');

const baseUrl = 'https://apkfixikmjuara.vercel.app';

function makeRequest(url, options, data) {
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

async function testLogin() {
    try {
        console.log('🧪 Testing login API...');
        
        const result1 = await makeRequest(`${baseUrl}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, {
            username: 'BidIndustri08#',
            password: 'BidIndustri08#'
        });
        
        console.log('📡 Response Status:', result1.status);
        console.log('📊 Response Data:', JSON.stringify(result1.data, null, 2));
        
        if (result1.data.success) {
            console.log('✅ Login berhasil!');
            console.log('👤 User:', result1.data.user.nama);
            console.log('🔑 Role:', result1.data.user.role);
        } else {
            console.log('❌ Login gagal:', result1.data.message);
        }
        
        // Test dengan akun lain
        console.log('\n🧪 Testing dengan akun admin_ikm...');
        
        const result2 = await makeRequest(`${baseUrl}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, {
            username: 'admin_ikm',
            password: 'IKM2024@Madiun'
        });
        
        console.log('📡 Response Status:', result2.status);
        console.log('📊 Response Data:', JSON.stringify(result2.data, null, 2));
        
        if (result2.data.success) {
            console.log('✅ Login admin_ikm berhasil!');
            console.log('👤 User:', result2.data.user.nama);
        } else {
            console.log('❌ Login admin_ikm gagal:', result2.data.message);
        }
        
        // Test dengan password salah
        console.log('\n🧪 Testing dengan password salah...');
        
        const result3 = await makeRequest(`${baseUrl}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, {
            username: 'BidIndustri08#',
            password: 'passwordsalah'
        });
        
        console.log('📡 Response Status:', result3.status);
        console.log('📊 Response Data:', JSON.stringify(result3.data, null, 2));
        
        if (!result3.data.success) {
            console.log('✅ Error handling bekerja dengan baik');
        }
        
    } catch (error) {
        console.error('💥 Error testing login:', error);
    }
}

testLogin();