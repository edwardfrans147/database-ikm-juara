// Test script untuk API layanan IKM yang sudah diperbaiki

const API_BASE = 'http://localhost:3000';

async function testLayananAPI() {
    console.log('🧪 Testing Layanan IKM API...\n');
    
    try {
        // Test HKI Merek API
        console.log('📋 Testing HKI Merek API:');
        const hkiResponse = await fetch(`${API_BASE}/api/hki-merek`);
        const hkiData = await hkiResponse.json();
        
        if (hkiData.success) {
            console.log(`✅ HKI Merek: ${hkiData.data.length} records found`);
            if (hkiData.data.length > 0) {
                const firstRecord = hkiData.data[0];
                console.log('   Sample record:');
                console.log(`   - ID: ${firstRecord.id}`);
                console.log(`   - NIB: ${firstRecord.nib || 'KOSONG'}`);
                console.log(`   - NIK: ${firstRecord.nik || 'KOSONG'}`);
                console.log(`   - Nama: ${firstRecord.nama_lengkap || 'KOSONG'}`);
                console.log(`   - Nomor HKI: ${firstRecord.nomor_pendaftaran_hki || 'KOSONG'}`);
                console.log(`   - Status: ${firstRecord.status_sertifikat || 'KOSONG'}`);
            }
        } else {
            console.log('❌ HKI Merek API failed:', hkiData.error);
        }
        
        // Test Sertifikat Halal API
        console.log('\n📋 Testing Sertifikat Halal API:');
        const halalResponse = await fetch(`${API_BASE}/api/sertifikat-halal`);
        const halalData = await halalResponse.json();
        
        if (halalData.success) {
            console.log(`✅ Sertifikat Halal: ${halalData.data.length} records found`);
            if (halalData.data.length > 0) {
                const firstRecord = halalData.data[0];
                console.log('   Sample record:');
                console.log(`   - ID: ${firstRecord.id}`);
                console.log(`   - NIB: ${firstRecord.nib || 'KOSONG'}`);
                console.log(`   - NIK: ${firstRecord.nik || 'KOSONG'}`);
                console.log(`   - Nama: ${firstRecord.nama_lengkap || 'KOSONG'}`);
                console.log(`   - Nomor Sertifikat: ${firstRecord.nomor_sertifikat_halal || 'KOSONG'}`);
            }
        } else {
            console.log('❌ Sertifikat Halal API failed:', halalData.error);
        }
        
        // Test get by ID
        if (hkiData.success && hkiData.data.length > 0) {
            const recordId = hkiData.data[0].id;
            console.log(`\n📋 Testing Get HKI Merek by ID (${recordId}):`);
            
            const byIdResponse = await fetch(`${API_BASE}/api/hki-merek/${recordId}`);
            const byIdData = await byIdResponse.json();
            
            if (byIdData.success) {
                console.log('✅ Get by ID successful');
                console.log(`   - NIB: ${byIdData.data.nib || 'KOSONG'}`);
                console.log(`   - Nama: ${byIdData.data.nama_lengkap || 'KOSONG'}`);
            } else {
                console.log('❌ Get by ID failed:', byIdData.error);
            }
        }
        
        // Test Pelatihan API
        console.log('\n📋 Testing Pelatihan API:');
        const pelatihanResponse = await fetch(`${API_BASE}/api/pelatihan-pemberdayaan`);
        const pelatihanData = await pelatihanResponse.json();
        
        if (pelatihanData.success) {
            console.log(`✅ Pelatihan: ${pelatihanData.data.length} records found`);
            if (pelatihanData.data.length > 0) {
                const firstRecord = pelatihanData.data[0];
                console.log('   Sample record:');
                console.log(`   - ID: ${firstRecord.id}`);
                console.log(`   - Judul: ${firstRecord.judul_pelatihan || 'KOSONG'}`);
                console.log(`   - Status: ${firstRecord.status || 'KOSONG'}`);
                console.log(`   - Kuota: ${firstRecord.kuota || 'KOSONG'}`);
            }
        } else {
            console.log('❌ Pelatihan API failed:', pelatihanData.error);
        }
        
        console.log('\n✅ API testing completed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testLayananAPI();