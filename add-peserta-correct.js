// Add peserta pelatihan data with correct schema
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://krylvwwguczwwoyqghlc.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeWx2d3dndWN6d3dveXFnaGxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA1ODg0MSwiZXhwIjoyMDg0NjM0ODQxfQ.ysubAuDeIPshMww709q092yI37j1wZUIwK5vQttUsmE';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addPesertaPelatihan() {
    console.log('📋 Adding Peserta Pelatihan data with correct schema...');
    
    // Get pelatihan and IKM data
    const { data: pelatihanData } = await supabase
        .from('pelatihan_pemberdayaan')
        .select('id, judul_pelatihan')
        .limit(3);
    
    const { data: ikmData } = await supabase
        .from('ikm_binaan')
        .select('id, nama_lengkap');
    
    if (pelatihanData && ikmData) {
        let totalAdded = 0;
        
        for (const pelatihan of pelatihanData) {
            console.log(`\n   Adding participants for: ${pelatihan.judul_pelatihan}`);
            
            // Add 3-4 participants per training
            const participantCount = Math.floor(Math.random() * 2) + 3; // 3-4 participants
            
            for (let i = 0; i < participantCount && i < ikmData.length; i++) {
                const ikm = ikmData[i];
                
                try {
                    const pesertaData = {
                        pelatihan_id: pelatihan.id,
                        ikm_binaan_id: ikm.id,
                        status: Math.random() > 0.15 ? 'hadir' : 'tidak_hadir'
                    };
                    
                    const { error } = await supabase
                        .from('peserta_pelatihan')
                        .insert(pesertaData);
                    
                    if (!error) {
                        console.log(`     ✅ ${ikm.nama_lengkap} (${pesertaData.status})`);
                        totalAdded++;
                    } else {
                        console.log(`     ⚠️  Error adding ${ikm.nama_lengkap}: ${error.message}`);
                    }
                } catch (e) {
                    console.log(`     ❌ Error: ${e.message}`);
                }
            }
        }
        
        console.log(`\n🎯 Added ${totalAdded} peserta pelatihan records`);
        
        // Verify final count
        const { count } = await supabase
            .from('peserta_pelatihan')
            .select('*', { count: 'exact', head: true });
        
        console.log(`📊 Total peserta pelatihan in database: ${count}`);
        
        // Final verification of all tables
        console.log('\n🔍 Final data verification:');
        const tables = [
            'ikm_binaan', 'hki_merek', 'sertifikat_halal', 'tkdn_ik', 
            'siinas', 'uji_nilai_gizi', 'kurasi_produk', 'pelatihan_pemberdayaan', 'peserta_pelatihan'
        ];
        
        for (const table of tables) {
            try {
                const { count } = await supabase
                    .from(table)
                    .select('*', { count: 'exact', head: true });
                console.log(`   ${table}: ${count} records`);
            } catch (e) {
                console.log(`   ${table}: Error checking count`);
            }
        }
        
        console.log('\n🎉 ALL DATA MIGRATION COMPLETED!');
        console.log('🌐 Your dashboard should now show all data: https://apkfixikmjuara.vercel.app/admin/');
    }
}

addPesertaPelatihan().catch(console.error);