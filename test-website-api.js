// Test apakah website menggunakan API yang benar
async function testWebsiteAPI() {
    console.log('🧪 Testing website API endpoints...\n');
    
    try {
        // Test dashboard API
        console.log('📊 Testing Dashboard API:');
        const dashboardResponse = await fetch('http://localhost:3000/api/dashboard');
        const dashboardData = await dashboardResponse.json();
        
        console.log('Dashboard response:', dashboardData);
        
        // Test HKI Merek API
        console.log('\n📋 Testing HKI Merek API:');
        const hkiResponse = await fetch('http://localhost:3000/api/hki-merek');
        const hkiData = await hkiResponse.json();
        
        console.log('HKI Merek response:', hkiData);
        
        if (hkiData.success && hkiData.data && hkiData.data.length > 0) {
            const firstRecord = hkiData.data[0];
            console.log('\nFirst HKI record:');
            console.log('- ID:', firstRecord.id);
            console.log('- NIB:', firstRecord.nib || 'KOSONG');
            console.log('- Nama:', firstRecord.nama_lengkap || 'KOSONG');
            console.log('- Nomor HKI:', firstRecord.nomor_pendaftaran_hki || 'KOSONG');
            
            if (firstRecord.nib) {
                console.log('✅ NIB sudah muncul - API Supabase berfungsi!');
            } else {
                console.log('❌ NIB masih kosong - masih menggunakan API lama');
            }
        }
        
        // Test API test endpoint
        console.log('\n🔧 Testing API test endpoint:');
        const testResponse = await fetch('http://localhost:3000/api/test');
        if (testResponse.ok) {
            const testData = await testResponse.json();
            console.log('✅ API test endpoint found:', testData.message);
            console.log('✅ Website menggunakan API Supabase yang baru');
        } else {
            console.log('❌ API test endpoint not found - website masih menggunakan server lama');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testWebsiteAPI();