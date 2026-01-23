// Script to migrate all JSON data to Supabase
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://krylvwwguczwwoyqghlc.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeWx2d3dndWN6d3dveXFnaGxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA1ODg0MSwiZXhwIjoyMDg0NjM0ODQxfQ.ysubAuDeIPshMww709q092yI37j1wZUIwK5vQttUsmE';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Data files to migrate
const dataFiles = [
    { file: 'data/ikm-binaan.json', table: 'ikm_binaan', name: 'IKM Binaan' },
    { file: 'data/hki-merek.json', table: 'hki_merek', name: 'HKI Merek' },
    { file: 'data/sertifikat-halal.json', table: 'sertifikat_halal', name: 'Sertifikat Halal' },
    { file: 'data/tkdn-ik.json', table: 'tkdn_ik', name: 'TKDN IK' },
    { file: 'data/siinas.json', table: 'siinas', name: 'SIINas' },
    { file: 'data/uji-nilai-gizi.json', table: 'uji_nilai_gizi', name: 'Uji Nilai Gizi' },
    { file: 'data/kurasi-produk.json', table: 'kurasi_produk', name: 'Kurasi Produk' },
    { file: 'data/pelatihan-pemberdayaan.json', table: 'pelatihan_pemberdayaan', name: 'Pelatihan Pemberdayaan' }
];

// Function to transform field names for database compatibility
const transformData = (data, tableName) => {
    return data.map(item => {
        const transformed = {};
        
        // Common field mappings
        const fieldMappings = {
            // IKM Binaan
            'namaLengkap': 'nama_lengkap',
            'alamatLengkap': 'alamat_lengkap', 
            'namaUsaha': 'nama_usaha',
            'nomorHP': 'nomor_hp',
            'createdAt': 'created_at',
            'updatedAt': 'updated_at',
            
            // HKI Merek
            'ikmBinaanId': 'ikm_binaan_id',
            'nomorPendaftaranHKI': 'nomor_pendaftaran_hki',
            'linkBuktiDaftar': 'link_bukti_daftar',
            'statusSertifikat': 'status_sertifikat',
            'tahunFasilitasi': 'tahun_fasilitasi',
            'linkSertifikatHKI': 'link_sertifikat_hki',
            'kelasMerek': 'kelas_merek',
            'namaMerek': 'nama_merek',
            
            // Sertifikat Halal
            'nomorSertifikatHalal': 'nomor_sertifikat_halal',
            'linkSertifikatHalal': 'link_sertifikat_halal',
            
            // TKDN IK
            'nomorSertifikatTKDN': 'nomor_sertifikat_tkdn',
            'tahunTerbitSertifikat': 'tahun_terbit_sertifikat',
            'linkSertifikatTKDN': 'link_sertifikat_tkdn',
            
            // SIINas
            'nomorBuktiKepemilikan': 'nomor_bukti_kepemilikan',
            'tahunRegistrasi': 'tahun_registrasi',
            'linkBuktiKepemilikan': 'link_bukti_kepemilikan',
            
            // Uji Nilai Gizi
            'nomorLHU': 'nomor_lhu',
            'tanggalHasilUji': 'tanggal_hasil_uji',
            'linkLHU': 'link_lhu',
            
            // Kurasi Produk
            'nomorSertifikatKurasi': 'nomor_sertifikat_kurasi',
            'tahunKurasi': 'tahun_kurasi',
            'linkSertifikatKurasi': 'link_sertifikat_kurasi',
            
            // Pelatihan
            'judulPelatihan': 'judul_pelatihan',
            'deskripsiPelatihan': 'deskripsi_pelatihan',
            'tanggalMulai': 'tanggal_mulai',
            'tanggalSelesai': 'tanggal_selesai',
            'lokasiPelatihan': 'lokasi_pelatihan',
            'jumlahPeserta': 'jumlah_peserta'
        };
        
        // Transform each field
        for (const [key, value] of Object.entries(item)) {
            const newKey = fieldMappings[key] || key.toLowerCase();
            transformed[newKey] = value;
        }
        
        // Remove id field to let database generate new UUIDs
        delete transformed.id;
        
        return transformed;
    });
};

async function migrateData() {
    console.log('🚀 Starting data migration to Supabase...\n');
    
    let totalMigrated = 0;
    
    for (const { file, table, name } of dataFiles) {
        try {
            console.log(`📋 Processing: ${name} (${file})`);
            
            // Check if file exists
            if (!fs.existsSync(file)) {
                console.log(`   ⚠️  File not found: ${file}`);
                continue;
            }
            
            // Read JSON data
            const rawData = fs.readFileSync(file, 'utf8');
            const jsonData = JSON.parse(rawData);
            
            if (!Array.isArray(jsonData) || jsonData.length === 0) {
                console.log(`   ⚠️  No data found in ${file}`);
                continue;
            }
            
            console.log(`   📊 Found ${jsonData.length} records`);
            
            // Transform data for database
            const transformedData = transformData(jsonData, table);
            
            // Insert data to Supabase
            const { data, error } = await supabase
                .from(table)
                .upsert(transformedData, { 
                    onConflict: 'nib,nik', 
                    ignoreDuplicates: false 
                });
            
            if (error) {
                console.log(`   ❌ Error inserting to ${table}:`, error.message);
                
                // Try inserting one by one if batch fails
                console.log(`   🔄 Trying individual inserts...`);
                let successCount = 0;
                
                for (const record of transformedData) {
                    try {
                        const { error: singleError } = await supabase
                            .from(table)
                            .upsert(record);
                        
                        if (!singleError) {
                            successCount++;
                        }
                    } catch (e) {
                        // Skip individual errors
                    }
                }
                
                console.log(`   ✅ Successfully inserted ${successCount}/${transformedData.length} records`);
                totalMigrated += successCount;
            } else {
                console.log(`   ✅ Successfully inserted ${transformedData.length} records`);
                totalMigrated += transformedData.length;
            }
            
        } catch (error) {
            console.log(`   ❌ Error processing ${file}:`, error.message);
        }
        
        console.log('');
    }
    
    console.log(`🎯 Migration completed! Total records migrated: ${totalMigrated}`);
    
    // Verify migration by checking counts
    console.log('\n🔍 Verifying data in Supabase...');
    
    for (const { table, name } of dataFiles) {
        try {
            const { count, error } = await supabase
                .from(table)
                .select('*', { count: 'exact', head: true });
            
            if (!error) {
                console.log(`   ${name}: ${count} records`);
            }
        } catch (e) {
            console.log(`   ${name}: Error checking count`);
        }
    }
    
    console.log('\n🌐 Test your dashboard at: https://apkfixikmjuara.vercel.app/admin/');
}

migrateData().catch(console.error);