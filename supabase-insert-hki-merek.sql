-- INSERT HKI MEREK DATA
-- PENTING: Jalankan ini SETELAH data ikm_binaan sudah diinsert

-- Step 1: Dapatkan UUID dari ikm_binaan
SELECT id, nib, nama_lengkap FROM ikm_binaan ORDER BY nib;

-- Step 2: Ganti UUID_PLACEHOLDER dengan UUID yang sebenarnya dari query di atas
-- Contoh: jika Ahmad Rizki Pratama (NIB: 1234567890123) memiliki UUID: 12345678-1234-1234-1234-123456789012
-- Maka ganti UUID_AHMAD dengan UUID tersebut

-- Cara mudah: Jalankan query ini untuk mendapatkan INSERT statement yang sudah benar
WITH ikm_data AS (
  SELECT id, nib, nama_lengkap FROM ikm_binaan WHERE nib IN ('1234567890123', '2345678901234')
)
SELECT 
  'INSERT INTO hki_merek (ikm_binaan_id, nama_lengkap, nama_usaha, nama_merek, nomor_pendaftaran_hki, status_sertifikat, tahun_fasilitasi, link_bukti_daftar, link_sertifikat_hki) VALUES' as query_start
UNION ALL
SELECT 
  CASE 
    WHEN nib = '1234567890123' THEN 
      '(''' || id || ''', ''Ahmad Rizki Pratama'', ''Keripik Singkong Rizki'', ''Keripik Rizki'', ''HKI-2024-001'', ''Telah Didaftar'', 2024, ''https://drive.google.com/file/d/1234567890/view'', ''https://drive.google.com/file/d/1234567891/view''),'
    WHEN nib = '2345678901234' THEN 
      '(''' || id || ''', ''Siti Nurhaliza Dewi'', ''Batik Tulis Siti'', ''Batik Siti'', ''HKI-2024-002'', ''Proses'', 2024, ''https://drive.google.com/file/d/1234567892/view'', ''https://drive.google.com/file/d/1234567892/view'');'
  END as insert_statement
FROM ikm_data;

-- Atau manual insert (ganti UUID_AHMAD dan UUID_SITI dengan UUID yang benar):
/*
INSERT INTO hki_merek (ikm_binaan_id, nama_lengkap, nama_usaha, nama_merek, nomor_pendaftaran_hki, status_sertifikat, tahun_fasilitasi, link_bukti_daftar, link_sertifikat_hki) VALUES 
('UUID_AHMAD', 'Ahmad Rizki Pratama', 'Keripik Singkong Rizki', 'Keripik Rizki', 'HKI-2024-001', 'Telah Didaftar', 2024, 'https://drive.google.com/file/d/1234567890/view', 'https://drive.google.com/file/d/1234567891/view'),
('UUID_SITI', 'Siti Nurhaliza Dewi', 'Batik Tulis Siti', 'Batik Siti', 'HKI-2024-002', 'Proses', 2024, 'https://drive.google.com/file/d/1234567892/view', 'https://drive.google.com/file/d/1234567892/view');
*/

-- Verifikasi data
SELECT count(*) as total_hki_merek FROM hki_merek;
SELECT h.nama_lengkap, h.nama_merek, h.status_sertifikat, i.nama_usaha 
FROM hki_merek h 
JOIN ikm_binaan i ON h.ikm_binaan_id = i.id;