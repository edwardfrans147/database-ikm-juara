// Quick data migration script from JSON to Supabase
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.log('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🚀 STARTING DATA MIGRATION...');
console.log('============================');

async function readJsonFile(filename) {
    try {
        const filePath = path.join(__dirname, 'data', filename);
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  File not found: ${filename}`);
            return [];
        }
        
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.log(`❌ Error reading ${filename}:`, error.message);
        return [];
    }
}

async function migrateTable(tableName, jsonFile, transformFn = null) {
    try {
        console.log(`\n📊 Migrating ${tableName}...`);
        
        const jsonData = await readJsonFile(jsonFile);
        
        if (jsonData.length === 0) {
            console.log(`   No data found in ${jsonFile}`);
            return { success: true, count: 0 };
        }

        // Transform data if needed
        const transformedData = transformFn ? jsonData.map(transformFn) : jsonData;
        
        // Insert data
        const { data, error } = await supabase
            .from(tableName)
            .insert(transformedData)
            .select();
        
        if (error) {
            console.log(`   ❌ Error: ${error.message}`);
            return { success: false, error: error.message };
        }
        
        console.log(`   ✅ Success: ${data.length} records migrated`);
        return { success: true, count: data.length };
        
    } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
        return { success: false, error: error.message };
    }
}

// Transform functions
function transformIkmBinaan(item) {
    return {
        nib: item.nib || '',
        nik: item.nik || '',
        nama_lengkap: item.nama_lengkap || item.namaLengkap || '',
        alamat_lengkap: item.alamat_lengkap || item.alamatLengkap || '',
        nama_usaha: item.nama_usaha || item.namaUsaha || '',
        nomor_hp: item.nomor_hp || item.nomorHp || ''
    };
}

function transformHkiMerek(item) {
    return {
        nama_lengkap: item.nama_lengkap || item.namaLengkap || '',
        nama_usaha: item.nama_usaha || item.namaUsaha || '',
        nama_merek: item.nama_merek || item.namaMerek || '',
        kelas_merek: item.kelas_merek || item.kelasMerek || '',
        nomor_pendaftaran_hki: item.nomor_pendaftaran_hki || item.nomorPendaftaranHki || '',
        status_sertifikat: item.status_sertifikat || item.statusSertifikat || '',
        tahun_fasilitasi: parseInt(item.tahun_fasilitasi || item.tahunFasilitasi) || new Date().getFullYear(),
        link_bukti_daftar: item.link_bukti_daftar || item.linkBuktiDaftar || '',
        link_sertifikat_hki: item.link_sertifikat_hki || item.linkSertifikatHki || ''
    };
}

function transformSertifikatHalal(item) {
    return {
        nama_lengkap: item.nama_lengkap || item.namaLengkap || '',
        nama_usaha: item.nama_usaha || item.namaUsaha || '',
        nomor_sertifikat_halal: item.nomor_sertifikat_halal || item.nomorSertifikatHalal || '',
        tahun_fasilitasi: parseInt(item.tahun_fasilitasi || item.tahunFasilitasi) || new Date().getFullYear(),
        link_sertifikat_halal: item.link_sertifikat_halal || item.linkSertifikatHalal || ''
    };
}

async function runMigration() {
    const migrations = [
        {
            table: 'ikm_binaan',
            file: 'ikm-binaan.json',
            transform: transformIkmBinaan
        },
        {
            table: 'hki_merek',
            file: 'hki-merek.json',
            transform: transformHkiMerek
        },
        {
            table: 'sertifikat_halal',
            file: 'sertifikat-halal.json',
            transform: transformSertifikatHalal
        },
        {
            table: 'tkdn_ik',
            file: 'tkdn-ik.json'
        },
        {
            table: 'siinas',
            file: 'siinas.json'
        },
        {
            table: 'uji_nilai_gizi',
            file: 'uji-nilai-gizi.json'
        },
        {
            table: 'kurasi_produk',
            file: 'kurasi-produk.json'
        },
        {
            table: 'pelatihan_pemberdayaan',
            file: 'pelatihan-pemberdayaan.json'
        }
    ];

    let totalRecords = 0;
    let successfulMigrations = 0;

    for (const migration of migrations) {
        const result = await migrateTable(
            migration.table,
            migration.file,
            migration.transform
        );
        
        if (result.success) {
            successfulMigrations++;
            totalRecords += result.count;
        }
    }

    console.log('\n📋 MIGRATION SUMMARY');
    console.log('===================');
    console.log(`Total tables: ${migrations.length}`);
    console.log(`Successful: ${successfulMigrations}`);
    console.log(`Failed: ${migrations.length - successfulMigrations}`);
    console.log(`Total records: ${totalRecords}`);
    
    if (successfulMigrations === migrations.length) {
        console.log('\n🎉 MIGRATION COMPLETED SUCCESSFULLY!');
        return true;
    } else {
        console.log('\n⚠️  MIGRATION COMPLETED WITH SOME ERRORS');
        return false;
    }
}

// Run migration
runMigration().then(success => {
    process.exit(success ? 0 : 1);
}).catch(error => {
    console.error('\n💥 MIGRATION FAILED:', error.message);
    process.exit(1);
});