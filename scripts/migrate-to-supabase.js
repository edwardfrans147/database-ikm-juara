// Migration script from JSON files to Supabase
const fs = require('fs');
const path = require('path');
const { adminDB } = require('../lib/supabase.js');

class DataMigrator {
    constructor() {
        this.dataDir = path.join(__dirname, '../data');
        this.migrationLog = [];
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
        console.log(logEntry);
        this.migrationLog.push(logEntry);
    }

    async readJsonFile(filename) {
        try {
            const filePath = path.join(this.dataDir, filename);
            if (!fs.existsSync(filePath)) {
                this.log(`File not found: ${filename}`, 'warning');
                return [];
            }
            
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            this.log(`Error reading ${filename}: ${error.message}`, 'error');
            return [];
        }
    }

    async migrateTable(tableName, jsonFile, transformFn = null) {
        try {
            this.log(`Starting migration for ${tableName}...`);
            
            // Read JSON data
            const jsonData = await this.readJsonFile(jsonFile);
            
            if (jsonData.length === 0) {
                this.log(`No data found in ${jsonFile}`, 'warning');
                return { success: true, count: 0 };
            }

            // Transform data if needed
            const transformedData = transformFn ? jsonData.map(transformFn) : jsonData;
            
            // Clear existing data (optional - comment out if you want to keep existing data)
            // await adminDB.client.from(tableName).delete().neq('id', '00000000-0000-0000-0000-000000000000');
            
            // Insert data in batches
            const batchSize = 100;
            let totalInserted = 0;
            
            for (let i = 0; i < transformedData.length; i += batchSize) {
                const batch = transformedData.slice(i, i + batchSize);
                
                const { data, error } = await adminDB.client
                    .from(tableName)
                    .insert(batch)
                    .select();
                
                if (error) {
                    this.log(`Error inserting batch ${i}-${i + batch.length} for ${tableName}: ${error.message}`, 'error');
                    throw error;
                }
                
                totalInserted += data.length;
                this.log(`Inserted batch ${i + 1}-${i + batch.length} for ${tableName}`);
            }
            
            this.log(`✅ Migration completed for ${tableName}: ${totalInserted} records`, 'success');
            return { success: true, count: totalInserted };
            
        } catch (error) {
            this.log(`❌ Migration failed for ${tableName}: ${error.message}`, 'error');
            return { success: false, error: error.message };
        }
    }

    // Transform functions for different data types
    transformIkmBinaan(item) {
        return {
            nib: item.nib || '',
            nik: item.nik || '',
            nama_lengkap: item.nama_lengkap || item.namaLengkap || '',
            alamat_lengkap: item.alamat_lengkap || item.alamatLengkap || '',
            nama_usaha: item.nama_usaha || item.namaUsaha || '',
            nomor_hp: item.nomor_hp || item.nomorHp || ''
        };
    }

    transformHkiMerek(item) {
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

    transformSertifikatHalal(item) {
        return {
            nama_lengkap: item.nama_lengkap || item.namaLengkap || '',
            nama_usaha: item.nama_usaha || item.namaUsaha || '',
            nomor_sertifikat_halal: item.nomor_sertifikat_halal || item.nomorSertifikatHalal || '',
            tahun_fasilitasi: parseInt(item.tahun_fasilitasi || item.tahunFasilitasi) || new Date().getFullYear(),
            link_sertifikat_halal: item.link_sertifikat_halal || item.linkSertifikatHalal || ''
        };
    }

    transformWebsiteContent(item) {
        return {
            section: item.section || 'layanan',
            item_id: item.item_id || item.id || '',
            title: item.title || item.judul || '',
            description: item.description || item.deskripsi || '',
            contact: item.contact || item.kontak || '',
            link: item.link || '#',
            is_active: item.is_active !== false
        };
    }

    async runFullMigration() {
        this.log('🚀 STARTING FULL DATA MIGRATION TO SUPABASE');
        this.log('=============================================');
        
        const migrations = [
            {
                table: 'ikm_binaan',
                file: 'ikm-binaan.json',
                transform: this.transformIkmBinaan
            },
            {
                table: 'hki_merek',
                file: 'hki-merek.json',
                transform: this.transformHkiMerek
            },
            {
                table: 'sertifikat_halal',
                file: 'sertifikat-halal.json',
                transform: this.transformSertifikatHalal
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
            },
            {
                table: 'website_content',
                file: 'website-content.json',
                transform: this.transformWebsiteContent
            }
        ];

        const results = [];
        let totalRecords = 0;
        let successfulMigrations = 0;

        for (const migration of migrations) {
            const result = await this.migrateTable(
                migration.table,
                migration.file,
                migration.transform
            );
            
            results.push({
                table: migration.table,
                ...result
            });
            
            if (result.success) {
                successfulMigrations++;
                totalRecords += result.count;
            }
        }

        // Summary
        this.log('');
        this.log('📊 MIGRATION SUMMARY');
        this.log('===================');
        this.log(`Total tables processed: ${migrations.length}`);
        this.log(`Successful migrations: ${successfulMigrations}`);
        this.log(`Failed migrations: ${migrations.length - successfulMigrations}`);
        this.log(`Total records migrated: ${totalRecords}`);
        
        // Detailed results
        this.log('');
        this.log('📋 DETAILED RESULTS');
        this.log('==================');
        results.forEach(result => {
            const status = result.success ? '✅' : '❌';
            const count = result.success ? `(${result.count} records)` : `(${result.error})`;
            this.log(`${status} ${result.table} ${count}`);
        });

        // Save migration log
        const logFile = path.join(__dirname, '../migration-log.txt');
        fs.writeFileSync(logFile, this.migrationLog.join('\n'));
        this.log(`Migration log saved to: ${logFile}`);

        return {
            success: successfulMigrations === migrations.length,
            totalTables: migrations.length,
            successfulMigrations,
            totalRecords,
            results
        };
    }
}

// Run migration if called directly
if (require.main === module) {
    const migrator = new DataMigrator();
    migrator.runFullMigration().then(result => {
        if (result.success) {
            console.log('\n🎉 MIGRATION COMPLETED SUCCESSFULLY!');
            process.exit(0);
        } else {
            console.log('\n💥 MIGRATION COMPLETED WITH ERRORS!');
            process.exit(1);
        }
    }).catch(error => {
        console.error('\n💥 MIGRATION FAILED:', error.message);
        process.exit(1);
    });
}

module.exports = { DataMigrator };