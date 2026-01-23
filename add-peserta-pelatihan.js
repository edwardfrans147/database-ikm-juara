// Add peserta pelatihan data
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://krylvwwguczwwoyqghlc.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeWx2d3dndWN6d3dveXFnaGxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA1ODg0MSwiZXhwIjoyMDg0NjM0ODQxfQ.ysubAuDeIPshMww709q092yI37j1wZUIwK5vQttUsmE';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addPesertaPelatihan() {
    console.log('📋 Adding Peserta Pelatihan data...');
    
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
                        nama_peserta: ikm.nama_lengkap,
                        status_kehadiran: Math.random() > 0.15 ? 'Hadir' : 'Tidak Hadir',
                        nilai_evaluasi: Math.floor(Math.random() * 20) + 80 // Random score 80-100
                    };
                    
                    const { error } = await supabase
                        .from('peserta_pelatihan')
                        .insert(pesertaData);
                    
                    if (!error) {
                        console.log(`     ✅ ${ikm.nama_lengkap}`);
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
    }
}

addPesertaPelatihan().catch(console.error);