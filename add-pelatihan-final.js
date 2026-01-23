// Add pelatihan data with correct schema
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://krylvwwguczwwoyqghlc.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeWx2d3dndWN6d3dveXFnaGxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA1ODg0MSwiZXhwIjoyMDg0NjM0ODQxfQ.ysubAuDeIPshMww709q092yI37j1wZUIwK5vQttUsmE';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addPelatihanData() {
    console.log('📋 Adding Pelatihan Pemberdayaan data with correct schema...');
    
    const pelatihanData = [
        {
            judul_pelatihan: 'Pelatihan Digital Marketing untuk IKM',
            deskripsi: 'Pelatihan komprehensif tentang strategi digital marketing untuk meningkatkan penjualan produk IKM melalui platform online.',
            tanggal_mulai: '2024-02-15',
            tanggal_selesai: '2024-02-17',
            lokasi: 'Balai Pelatihan DisnakerKUKM Kota Madiun',
            instruktur: 'Dr. Ahmad Fauzi, M.Kom',
            kuota: 30,
            status: 'selesai'
        },
        {
            judul_pelatihan: 'Workshop Packaging dan Branding Produk',
            deskripsi: 'Workshop praktis untuk meningkatkan kemasan dan branding produk IKM agar lebih menarik dan marketable.',
            tanggal_mulai: '2024-03-10',
            tanggal_selesai: '2024-03-12',
            lokasi: 'Hotel Merdeka Madiun',
            instruktur: 'Siti Rahayu, S.Ds',
            kuota: 25,
            status: 'selesai'
        },
        {
            judul_pelatihan: 'Pelatihan Manajemen Keuangan UMKM',
            deskripsi: 'Pelatihan pengelolaan keuangan yang baik untuk usaha mikro, kecil, dan menengah.',
            tanggal_mulai: '2024-04-05',
            tanggal_selesai: '2024-04-07',
            lokasi: 'Gedung Serbaguna Pemkot Madiun',
            instruktur: 'Budi Hartono, S.E., M.M',
            kuota: 35,
            status: 'aktif'
        },
        {
            judul_pelatihan: 'Sertifikasi Halal untuk Produk Makanan',
            deskripsi: 'Panduan lengkap proses sertifikasi halal untuk produk makanan dan minuman IKM.',
            tanggal_mulai: '2024-05-20',
            tanggal_selesai: '2024-05-22',
            lokasi: 'Balai Pelatihan DisnakerKUKM Kota Madiun',
            instruktur: 'Ustadz Muhammad Ali, Lc',
            kuota: 40,
            status: 'aktif'
        },
        {
            judul_pelatihan: 'Workshop E-commerce dan Marketplace',
            deskripsi: 'Pelatihan praktis untuk memasarkan produk IKM melalui platform e-commerce dan marketplace.',
            tanggal_mulai: '2024-06-15',
            tanggal_selesai: '2024-06-17',
            lokasi: 'Hotel Santika Madiun',
            instruktur: 'Rina Sari, S.Kom',
            kuota: 28,
            status: 'aktif'
        }
    ];
    
    const insertedPelatihan = [];
    
    for (const pelatihan of pelatihanData) {
        try {
            const { data, error } = await supabase
                .from('pelatihan_pemberdayaan')
                .insert(pelatihan)
                .select()
                .single();
            
            if (error) {
                console.log(`   ⚠️  Error: ${error.message}`);
            } else {
                console.log(`   ✅ Added: ${pelatihan.judul_pelatihan}`);
                insertedPelatihan.push(data);
            }
        } catch (e) {
            console.log(`   ❌ Error adding ${pelatihan.judul_pelatihan}:`, e.message);
        }
    }
    
    // Add some peserta pelatihan data
    console.log('\n📋 Adding Peserta Pelatihan data...');
    
    // Get IKM data for participants
    const { data: ikmData } = await supabase
        .from('ikm_binaan')
        .select('id, nama_lengkap')
        .limit(7);
    
    if (ikmData && insertedPelatihan.length > 0) {
        for (const pelatihan of insertedPelatihan.slice(0, 3)) { // First 3 trainings
            for (const ikm of ikmData.slice(0, 4)) { // 4 participants per training
                try {
                    const pesertaData = {
                        pelatihan_id: pelatihan.id,
                        ikm_binaan_id: ikm.id,
                        nama_peserta: ikm.nama_lengkap,
                        status_kehadiran: Math.random() > 0.2 ? 'Hadir' : 'Tidak Hadir',
                        nilai_evaluasi: Math.floor(Math.random() * 20) + 80 // Random score 80-100
                    };
                    
                    const { error } = await supabase
                        .from('peserta_pelatihan')
                        .insert(pesertaData);
                    
                    if (!error) {
                        console.log(`   ✅ Added participant: ${ikm.nama_lengkap} to ${pelatihan.judul_pelatihan}`);
                    }
                } catch (e) {
                    // Skip errors
                }
            }
        }
    }
    
    // Final count verification
    console.log('\n🔍 Final verification...');
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
    
    console.log('\n🎯 All data migration completed successfully!');
    console.log('🌐 Refresh your dashboard: https://apkfixikmjuara.vercel.app/admin/');
}

addPelatihanData().catch(console.error);