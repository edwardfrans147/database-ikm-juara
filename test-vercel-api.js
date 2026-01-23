// Test API Vercel yang sudah di-deploy
async function testVercelAPI() {
    console.log('🧪 Testing Vercel API...\n');
    
    const baseUrl = 'https://apkfixikmjuara.vercel.app';
    
    try {
        // Test API test endpoint
        console.log('🔧 Testing API test endpoint:');
        const testResponse = await fetch(`${baseUrl}/api/test`);
        const testData = await testResponse.json();
        
        console.log('Test response:', testData);
        
        if (testData.success) {
            console.log('✅ API test endpoint working!');
        } else {
            console.log('❌ API test endpoint failed');
        }
        
        // Test HKI Merek API
        console.log('\n📋 Testing HKI Merek API:');
        const hkiResponse = await fetch(`${baseUrl}/api/hki-merek`);
        const hkiData = await hkiResponse.json();
        
        console.log('HKI response status:', hkiResponse.status);
        console.log('HKI response:', hkiData);
        
        if (hkiData.success && hkiData.data && hkiData.data.length > 0) {
            const firstRecord = hkiData.data[0];
            console.log('\nFirst HKI record:');
            console.log('- ID:', firstRecord.id);
            console.log('- NIB:', firstRecord.nib || 'KOSONG');
            console.log('- Nama:', firstRecord.nama_lengkap || 'KOSONG');
            console.log('- Nomor HKI:', firstRecord.nomor_pendaftaran_hki || 'KOSONG');
            
            if (firstRecord.nib) {
                console.log('✅ NIB sudah muncul di Vercel - perbaikan berhasil!');
            } else {
                console.log('❌ NIB masih kosong di Vercel');
            }
        } else {
            console.log('❌ HKI Merek API failed or no data');
        }
        
        // Test Dashboard API
        console.log('\n📊 Testing Dashboard API:');
        const dashboardResponse = await fetch(`${baseUrl}/api/dashboard`);
        const dashboardData = await dashboardResponse.json();
        
        console.log('Dashboard response:', dashboardData);
        
        if (dashboardData.hkiMerek > 0) {
            console.log('✅ Dashboard API working with Supabase data!');
        } else {
            console.log('❌ Dashboard API not working properly');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testVercelAPI();