-- SUPABASE DATA INSERT - MANUAL INPUT
-- Copy dan paste query ini ke SQL Editor Supabase

-- ========================================
-- 1. INSERT IKM BINAAN DATA
-- ========================================

INSERT INTO ikm_binaan (nib, nik, nama_lengkap, alamat_lengkap, nama_usaha, nomor_hp) VALUES 
('1234567890123', '3518012345678901', 'Ahmad Rizki Pratama', 'Jl. Merdeka No. 123, Kelurahan Madiun Lor, Kecamatan Manguharjo, Kota Madiun', 'Keripik Singkong Rizki', '081234567891'),
('2345678901234', '3518012345678902', 'Siti Nurhaliza Dewi', 'Jl. Sudirman No. 456, Kelurahan Oro-oro Ombo, Kecamatan Kartoharjo, Kota Madiun', 'Batik Tulis Siti', '081234567891'),
('3456789012345', '3518012345678903', 'Budi Santoso', 'Jl. Gatot Subroto No. 789, Kelurahan Taman, Kecamatan Taman, Kota Madiun', 'Furniture Kayu Budi', '081234567892'),
('8765432109876', '3518018765432109', 'Test User Baru 2', 'Jl. Test Baru No. 2, Kelurahan Test, Kecamatan Test, Kota Madiun', 'Usaha Test Baru 2', '081999888666'),
('1234567890444', '3518012345678940', 'Yanuar P', 'Jl. Merdeka 3, Kelurahan Madiun Lor, Kecamatan Manguharjo, Kota Madiun', 'Keripik Pisang', '081234567444'),
('2345678901221', '3518012345678910', 'Dewi Nurlaili', 'Jl. Sudirmanto 77 Kecamatan Kartoharjo, Kota Madiun', 'Siti Rhayau', '081234567591'),
('7654321098765', '3518017654321098', 'Test User Baru 3', 'Jl. Test Baru No. 3, Kelurahan Test, Kecamatan Test, Kota Madiun', 'Usaha Test Baru 3', '081999888333')
ON CONFLICT (nib) DO NOTHING;

-- ========================================
-- 2. INSERT WEBSITE CONTENT DATA
-- ========================================

INSERT INTO website_content (section, item_id, title, description, contact, link, is_active) VALUES 
-- Layanan IKM
('layanan', 'hki-merek', '📜 Pendaftaran HKI Merek', 'Fasilitasi pendaftaran Hak Kekayaan Intelektual untuk merek dagang IKM. Dengan syarat: 1. KTP, 2. NIB, 3. Materai 10.000 (1 lembar), 4. Etiket / Logo yang ingin didaftarkan merek', 'Hubungi: 0351-123456', 'https://dgip.go.id', true),
('layanan', 'sertifikat-halal', '✅ Pendaftaran Sertifikat Halal', 'Bantuan pengurusan sertifikat halal untuk produk makanan dan minuman', 'Hubungi: 0351-123456', 'https://halal.go.id', true),
('layanan', 'tkdn-ik', '🇮🇩 Pendaftaran TKDN IK', 'Sertifikasi Tingkat Komponen Dalam Negeri untuk Industri Kecil', 'Hubungi: 0351-123456', 'https://kemenperin.go.id', true),
('layanan', 'siinas', '💾 Pendaftaran dan Pendampingan SIINas', 'Registrasi dan pendampingan Sistem Informasi Industri Nasional', 'Hubungi: 0351-123456', 'https://siinas.kemenperin.go.id', true),
('layanan', 'uji-nilai-gizi', '🧪 Pendaftaran Uji Nilai Gizi', 'Fasilitasi pengujian nilai gizi produk makanan dan minuman', 'Hubungi: 0351-123456', 'https://pom.go.id', true),
('layanan', 'kurasi-produk', '🏆 Kurasi Produk', 'Penilaian dan kurasi produk IKM untuk peningkatan kualitas', 'Hubungi: 0351-123456', '#', true),

-- Pelatihan
('pelatihan', 'default-pelatihan', '📚 Program pelatihan akan segera diumumkan', 'Pantau terus website ini untuk informasi program pelatihan terbaru', 'Hubungi: 0351-123456', '#', true),
('pelatihan', 'pelatihan-digital-marketing', '👩🏻‍💻 Workshop Digital Marketing', 'Pelatihan digital marketing untuk IKM', 'WhatsApp: 081234567890', 'https://example.com/workshop', true),
('pelatihan', 'pelatihan-branding-2026', 'Pelatihan Digital Marketing dan Branding 2026', 'Pendaftaran HKI Merek tahun 2026', '085655480223', 'https://drive.google.com/drive/folders/1pS93hMbUcrjKEfD5fZDeXXNE_35QrkBw', true)
ON CONFLICT (section, item_id) DO NOTHING;

-- ========================================
-- 3. INSERT ADMIN USER (DEFAULT)
-- ========================================

INSERT INTO admin_users (username, password_hash, nama, role, is_active) VALUES 
('BidIndustri08#', '$2b$10$encrypted_password_hash_here', 'Administrator IKM JUARA', 'super_admin', true)
ON CONFLICT (username) DO NOTHING;

-- ========================================
-- 4. INSERT HKI MEREK DATA
-- ========================================

-- Catatan: Kita perlu mendapatkan UUID dari ikm_binaan terlebih dahulu
-- Jalankan query ini untuk mendapatkan UUID:
-- SELECT id, nib, nama_lengkap FROM ikm_binaan ORDER BY nib;

-- Setelah mendapatkan UUID, ganti 'UUID_IKM_1', 'UUID_IKM_2', dll dengan UUID yang sebenarnya
/*
INSERT INTO hki_merek (ikm_binaan_id, nama_lengkap, nama_usaha, nama_merek, nomor_pendaftaran_hki, status_sertifikat, tahun_fasilitasi, link_bukti_daftar, link_sertifikat_hki) VALUES 
('UUID_IKM_1', 'Ahmad Rizki Pratama', 'Keripik Singkong Rizki', 'Keripik Rizki', 'HKI-2024-001', 'Telah Didaftar', 2024, 'https://drive.google.com/file/d/1234567890/view', 'https://drive.google.com/file/d/1234567891/view'),
('UUID_IKM_2', 'Siti Nurhaliza Dewi', 'Batik Tulis Siti', 'Batik Siti', 'HKI-2024-002', 'Proses', 2024, 'https://drive.google.com/file/d/1234567892/view', 'https://drive.google.com/file/d/1234567892/view');
*/

-- ========================================
-- 5. VERIFIKASI DATA
-- ========================================

-- Cek jumlah data yang berhasil diinsert
SELECT 
    'ikm_binaan' as table_name,
    count(*) as total_records
FROM ikm_binaan
UNION ALL
SELECT 
    'website_content' as table_name,
    count(*) as total_records
FROM website_content
UNION ALL
SELECT 
    'admin_users' as table_name,
    count(*) as total_records
FROM admin_users
UNION ALL
SELECT 
    'hki_merek' as table_name,
    count(*) as total_records
FROM hki_merek;

-- Cek data IKM Binaan
SELECT id, nib, nama_lengkap, nama_usaha FROM ikm_binaan ORDER BY nib;

-- Cek website content
SELECT section, item_id, title FROM website_content WHERE is_active = true ORDER BY section, item_id;