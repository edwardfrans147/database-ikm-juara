// Script to fix field names from camelCase to snake_case in admin HTML files
const fs = require('fs');

const adminFiles = [
    'admin/ikm-binaan.html',
    'admin/layanan-ikm.html',
    'admin/pelatihan.html',
    'admin/inputan-layanan.html'
];

// Field name mappings from camelCase to snake_case
const fieldMappings = {
    // IKM Binaan fields
    'namaLengkap': 'nama_lengkap',
    'alamatLengkap': 'alamat_lengkap',
    'namaUsaha': 'nama_usaha',
    'nomorHP': 'nomor_hp',
    
    // HKI Merek fields
    'nomorPendaftaranHKI': 'nomor_pendaftaran_hki',
    'statusSertifikat': 'status_sertifikat',
    'tahunFasilitasi': 'tahun_fasilitasi',
    'linkBuktiDaftar': 'link_bukti_daftar',
    'linkSertifikatHKI': 'link_sertifikat_hki',
    'namaMerek': 'nama_merek',
    'kelasMerek': 'kelas_merek',
    
    // Sertifikat Halal fields
    'nomorSertifikatHalal': 'nomor_sertifikat_halal',
    'linkSertifikatHalal': 'link_sertifikat_halal',
    
    // TKDN IK fields
    'nomorSertifikatTKDN': 'nomor_sertifikat_tkdn',
    'tahunTerbitSertifikat': 'tahun_terbit_sertifikat',
    'linkSertifikatTKDN': 'link_sertifikat_tkdn',
    
    // SIINas fields
    'nomorBuktiKepemilikan': 'nomor_bukti_kepemilikan',
    'tahunRegistrasi': 'tahun_registrasi',
    'linkBuktiKepemilikan': 'link_bukti_kepemilikan',
    
    // Uji Nilai Gizi fields
    'nomorLHU': 'nomor_lhu',
    'tanggalHasilUji': 'tanggal_hasil_uji',
    'linkLHU': 'link_lhu',
    
    // Kurasi Produk fields
    'nomorSertifikatKurasi': 'nomor_sertifikat_kurasi',
    'tahunKurasi': 'tahun_kurasi',
    'linkSertifikatKurasi': 'link_sertifikat_kurasi',
    
    // Pelatihan fields
    'judulPelatihan': 'judul_pelatihan',
    'deskripsiPelatihan': 'deskripsi',
    'tanggalMulai': 'tanggal_mulai',
    'tanggalSelesai': 'tanggal_selesai',
    'lokasiPelatihan': 'lokasi',
    'jumlahPeserta': 'kuota'
};

console.log('🔧 Fixing field names in admin HTML files...\n');

adminFiles.forEach(filePath => {
    try {
        console.log(`📝 Processing: ${filePath}`);
        
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Replace field names in JavaScript code
        Object.entries(fieldMappings).forEach(([camelCase, snakeCase]) => {
            // Replace in field definitions
            const fieldPattern = new RegExp(`field:\\s*['"]${camelCase}['"]`, 'g');
            if (content.match(fieldPattern)) {
                content = content.replace(fieldPattern, `field: '${snakeCase}'`);
                modified = true;
                console.log(`   ✅ Fixed field: ${camelCase} → ${snakeCase}`);
            }
            
            // Replace in object property access
            const propPattern = new RegExp(`\\.${camelCase}\\b`, 'g');
            if (content.match(propPattern)) {
                content = content.replace(propPattern, `.${snakeCase}`);
                modified = true;
                console.log(`   ✅ Fixed property: .${camelCase} → .${snakeCase}`);
            }
        });
        
        // Fix duplicate getData calls
        const duplicatePattern = /const data = await getData\([^)]+\);\s*const data = await getData\([^)]+\);/g;
        if (content.match(duplicatePattern)) {
            content = content.replace(duplicatePattern, (match) => {
                const singleCall = match.split('\n')[0];
                return singleCall;
            });
            modified = true;
            console.log('   ✅ Fixed duplicate getData calls');
        }
        
        // Add response handling
        const getDataPattern = /const data = await getData\(([^)]+)\);/g;
        content = content.replace(getDataPattern, (match, endpoint) => {
            return `const response = await getData(${endpoint});
                const data = response.data || response; // Handle both response formats
                
                console.log(\`\${${endpoint}} data:\`, data); // Debug log`;
        });
        
        if (modified) {
            fs.writeFileSync(filePath, content);
            console.log('   💾 File updated');
        } else {
            console.log('   ⏭️  No changes needed');
        }
        
    } catch (error) {
        console.log(`   ❌ Error processing ${filePath}:`, error.message);
    }
    
    console.log('');
});

console.log('🎯 Field name fixes completed!');
console.log('📋 Next steps:');
console.log('   1. Push changes to GitHub');
console.log('   2. Wait for Vercel redeploy');
console.log('   3. Test all admin pages');