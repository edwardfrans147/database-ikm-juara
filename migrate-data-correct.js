// Correct script to migrate JSON data to Supabase with proper schema mapping
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://krylvwwguczwwoyqghlc.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeWx2d3dndWN6d3dveXFnaGxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA1ODg0MSwiZXhwIjoyMDg0NjM0ODQxfQ.ysubAuDeIPshMww709q092yI37j1wZUIwK5vQttUsmE';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateData() {
    console.log('🚀 Starting correct data migration to Supabase...\n');
    
    try {
        // First, get existing IKM Binaan data to map IDs
        console.log('📋 Getting existing IKM Binaan data...');
        const { data: ikmData, error: ikmError } = await supabase
            .from('ikm_binaan')
            .select('id, nib, nik, nama_lengkap, nama_usaha');
        
        if (ikmError) {
            console.log('❌ Error getting IKM data:', ikmError.message);
            return;
        }
        
        console.log(`✅ Found ${ikmData.length} IKM Binaan records`);
        
        // Create mapping from NIB to IKM ID
        const nibToId = {};
        ikmData.forEach(ikm => {
            nibToId[ikm.nib] = ikm.id;
        });
        
        // Migrate HKI Merek
        console.log('\n📋 Migrating HKI Merek...');
        const hkiData = JSON.parse(fs.readFileSync('data/hki-merek.json', 'utf8'));
        
        for (const item of hkiData) {
            const ikmId = nibToId[item.nib];
            if (ikmId) {
                const hkiRecord = {
                    ikm_binaan_id: ikmId,
                    nama_lengkap: item.namaLengkap,
                    nama_usaha: item.namaUsaha || 'Nama Usaha',
                    nama_merek: item.namaMerek || 'Merek Produk',
                    kelas_merek: item.kelasMerek || 'Kelas 30',
                    nomor_pendaftaran_hki: item.nomorPendaftaranHKI,
                    status_sertifikat: item.statusSertifikat,
                    tahun_fasilitasi: parseInt(item.tahunFasilitasi) || 2024,
                    link_bukti_daftar: item.linkBuktiDaftar,
                    link_sertifikat_hki: item.linkSertifikatHKI
                };
                
                const { error } = await supabase.from('hki_merek').insert(hkiRecord);
                if (error) {
                    console.log(`   ⚠️  Error inserting HKI for ${item.namaLengkap}:`, error.message);
                } else {
                    console.log(`   ✅ Inserted HKI for ${item.namaLengkap}`);
                }
            }
        }
        
        // Migrate Sertifikat Halal
        console.log('\n📋 Migrating Sertifikat Halal...');
        const halalData = JSON.parse(fs.readFileSync('data/sertifikat-halal.json', 'utf8'));
        
        for (const item of halalData) {
            const ikmId = nibToId[item.nib];
            if (ikmId) {
                const halalRecord = {
                    ikm_binaan_id: ikmId,
                    nama_lengkap: item.namaLengkap,
                    nama_usaha: item.namaUsaha || 'Nama Usaha',
                    nomor_sertifikat_halal: item.nomorSertifikatHalal,
                    tahun_fasilitasi: parseInt(item.tahunFasilitasi) || 2024,
                    link_sertifikat_halal: item.linkSertifikatHalal
                };
                
                const { error } = await supabase.from('sertifikat_halal').insert(halalRecord);
                if (error) {
                    console.log(`   ⚠️  Error inserting Halal for ${item.namaLengkap}:`, error.message);
                } else {
                    console.log(`   ✅ Inserted Halal for ${item.namaLengkap}`);
                }
            }
        }
        
        // Migrate TKDN IK
        console.log('\n📋 Migrating TKDN IK...');
        const tkdnData = JSON.parse(fs.readFileSync('data/tkdn-ik.json', 'utf8'));
        
        for (const item of tkdnData) {
            const ikmId = nibToId[item.nib];
            if (ikmId) {
                const tkdnRecord = {
                    ikm_binaan_id: ikmId,
                    nama_lengkap: item.namaLengkap,
                    nama_usaha: item.namaUsaha || 'Nama Usaha',
                    nomor_sertifikat_tkdn: item.nomorSertifikatTKDN,
                    tahun_terbit_sertifikat: parseInt(item.tahunTerbitSertifikat) || 2024,
                    link_sertifikat_tkdn: item.linkSertifikatTKDN
                };
                
                const { error } = await supabase.from('tkdn_ik').insert(tkdnRecord);
                if (error) {
                    console.log(`   ⚠️  Error inserting TKDN for ${item.namaLengkap}:`, error.message);
                } else {
                    console.log(`   ✅ Inserted TKDN for ${item.namaLengkap}`);
                }
            }
        }
        
        // Migrate SIINas
        console.log('\n📋 Migrating SIINas...');
        const siinasData = JSON.parse(fs.readFileSync('data/siinas.json', 'utf8'));
        
        for (const item of siinasData) {
            const ikmId = nibToId[item.nib];
            if (ikmId) {
                const siinasRecord = {
                    ikm_binaan_id: ikmId,
                    nama_lengkap: item.namaLengkap,
                    nama_usaha: item.namaUsaha || 'Nama Usaha',
                    nomor_bukti_kepemilikan: item.nomorBuktiKepemilikan,
                    tahun_registrasi: parseInt(item.tahunRegistrasi) || 2024,
                    link_bukti_kepemilikan: item.linkBuktiKepemilikan
                };
                
                const { error } = await supabase.from('siinas').insert(siinasRecord);
                if (error) {
                    console.log(`   ⚠️  Error inserting SIINas for ${item.namaLengkap}:`, error.message);
                } else {
                    console.log(`   ✅ Inserted SIINas for ${item.namaLengkap}`);
                }
            }
        }
        
        // Migrate Uji Nilai Gizi
        console.log('\n📋 Migrating Uji Nilai Gizi...');
        const ujiData = JSON.parse(fs.readFileSync('data/uji-nilai-gizi.json', 'utf8'));
        
        for (const item of ujiData) {
            const ikmId = nibToId[item.nib];
            if (ikmId) {
                const ujiRecord = {
                    ikm_binaan_id: ikmId,
                    nama_lengkap: item.namaLengkap,
                    nama_usaha: item.namaUsaha || 'Nama Usaha',
                    nomor_lhu: item.nomorLHU,
                    tanggal_hasil_uji: item.tanggalHasilUji,
                    tahun_fasilitasi: parseInt(item.tahunFasilitasi) || 2024,
                    link_lhu: item.linkLHU
                };
                
                const { error } = await supabase.from('uji_nilai_gizi').insert(ujiRecord);
                if (error) {
                    console.log(`   ⚠️  Error inserting Uji Gizi for ${item.namaLengkap}:`, error.message);
                } else {
                    console.log(`   ✅ Inserted Uji Gizi for ${item.namaLengkap}`);
                }
            }
        }
        
        // Migrate Kurasi Produk
        console.log('\n📋 Migrating Kurasi Produk...');
        const kurasiData = JSON.parse(fs.readFileSync('data/kurasi-produk.json', 'utf8'));
        
        for (const item of kurasiData) {
            const ikmId = nibToId[item.nib];
            if (ikmId) {
                const kurasiRecord = {
                    ikm_binaan_id: ikmId,
                    nama_lengkap: item.namaLengkap,
                    nama_usaha: item.namaUsaha || 'Nama Usaha',
                    nomor_sertifikat_kurasi: item.nomorSertifikatKurasi,
                    tahun_kurasi: parseInt(item.tahunKurasi) || 2024,
                    link_sertifikat_kurasi: item.linkSertifikatKurasi
                };
                
                const { error } = await supabase.from('kurasi_produk').insert(kurasiRecord);
                if (error) {
                    console.log(`   ⚠️  Error inserting Kurasi for ${item.namaLengkap}:`, error.message);
                } else {
                    console.log(`   ✅ Inserted Kurasi for ${item.namaLengkap}`);
                }
            }
        }
        
        // Migrate Pelatihan Pemberdayaan
        console.log('\n📋 Migrating Pelatihan Pemberdayaan...');
        const pelatihanData = JSON.parse(fs.readFileSync('data/pelatihan-pemberdayaan.json', 'utf8'));
        
        for (const item of pelatihanData) {
            const pelatihanRecord = {
                judul_pelatihan: item.judulPelatihan,
                deskripsi_pelatihan: item.deskripsiPelatihan,
                tanggal_mulai: item.tanggalMulai,
                tanggal_selesai: item.tanggalSelesai,
                lokasi_pelatihan: item.lokasiPelatihan,
                jumlah_peserta: parseInt(item.jumlahPeserta) || 0
            };
            
            const { error } = await supabase.from('pelatihan_pemberdayaan').insert(pelatihanRecord);
            if (error) {
                console.log(`   ⚠️  Error inserting Pelatihan ${item.judulPelatihan}:`, error.message);
            } else {
                console.log(`   ✅ Inserted Pelatihan: ${item.judulPelatihan}`);
            }
        }
        
        // Final verification
        console.log('\n🔍 Final verification...');
        const tables = [
            'ikm_binaan', 'hki_merek', 'sertifikat_halal', 'tkdn_ik', 
            'siinas', 'uji_nilai_gizi', 'kurasi_produk', 'pelatihan_pemberdayaan'
        ];
        
        for (const table of tables) {
            const { count } = await supabase
                .from(table)
                .select('*', { count: 'exact', head: true });
            console.log(`   ${table}: ${count} records`);
        }
        
        console.log('\n🎯 Migration completed successfully!');
        console.log('🌐 Refresh your dashboard: https://apkfixikmjuara.vercel.app/admin/');
        
    } catch (error) {
        console.error('❌ Migration error:', error);
    }
}

migrateData();