// Add pelatihan data with correct schema
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://krylvwwguczwwoyqghlc.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeWx2d3dndWN6d3dveXFnaGxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA1ODg0MSwiZXhwIjoyMDg0NjM0ODQxfQ.ysubAuDeIPshMww709q092yI37j1wZUIwK5vQttUsmE';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addPelatihanData() {
    console.log('📋 Adding Pelatihan Pemberdayaan data...');
    
    const pelatihanData = [
        {
            judul_pelatihan: 'Pelatihan Digital Marketing untuk IKM',
            deskripsi_pelatihan: 'Pelatihan komprehensif tentang strategi digital marketing untuk meningkatkan penjualan produk IKM melalui platform online.',
            tanggal_mulai: '2024-02-15',
            tanggal_selesai: '2024-02-17',
            lokasi_pelatihan: 'Balai Pelatihan DisnakerKUKM Kota Madiun'
        },
        {
            judul_pelatihan: 'Workshop Packaging dan Branding Produk',
            deskripsi_pelatihan: 'Workshop praktis untuk meningkatkan kemasan dan branding produk IKM agar lebih menarik dan marketable.',
            tanggal_mulai: '2024-03-10',
            tanggal_selesai: '2024-03-12',
            lokasi_pelatihan: 'Hotel Merdeka Madiun'
        },
        {
            judul_pelatihan: 'Pelatihan Manajemen Keuangan UMKM',
            deskripsi_pelatihan: 'Pelatihan pengelolaan keuangan yang baik untuk usaha mikro, kecil, dan menengah.',
            tanggal_mulai: '2024-04-05',
            tanggal_selesai: '2024-04-07',
            lokasi_pelatihan: 'Gedung Serbaguna Pemkot Madiun'
        },
        {
            judul_pelatihan: 'Sertifikasi Halal untuk Produk Makanan',
            deskripsi_pelatihan: 'Panduan lengkap proses sertifikasi halal untuk produk makanan dan minuman IKM.',
            tanggal_mulai: '2024-05-20',
            tanggal_selesai: '2024-05-22',
            lokasi_pelatihan: 'Balai Pelatihan DisnakerKUKM Kota Madiun'
        },
        {
            judul_pelatihan: 'Workshop E-commerce dan Marketplace',
            deskripsi_pelatihan: 'Pelatihan praktis untuk memasarkan produk IKM melalui platform e-commerce dan marketplace.',
            tanggal_mulai: '2024-06-15',
            tanggal_selesai: '2024-06-17',
            lokasi_pelatihan: 'Hotel Santika Madiun'
        }
    ];
    
    for (const pelatihan of pelatihanData) {
        try {
            const { data, error } = await supabase
                .from('pelatihan_pemberdayaan')
                .insert(pelatihan);
            
            if (error) {
                console.log(`   ⚠️  Error: ${error.message}`);
            } else {
                console.log(`   ✅ Added: ${pelatihan.judul_pelatihan}`);
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
        .limit(5);
    
    // Get pelatihan data
    const { data: pelatihanList } = await supabase
        .from('pelatihan_pemberdayaan')
        .select('id, judul_pelatihan')
        .limit(3);
    
    if (ikmData && pelatihanList) {
        for (const pelatihan of pelatihanList) {
            for (const ikm of ikmData.slice(0, 3)) { // Add 3 participants per training
                try {
                    const pesertaData = {
                        pelatihan_id: pelatihan.id,
                        ikm_binaan_id: ikm.id,
                        nama_peserta: ikm.nama_lengkap,
                        status_kehadiran: 'Hadir',
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
    
    console.log('\n🎯 Pelatihan data added successfully!');
}

addPelatihanData().catch(console.error);