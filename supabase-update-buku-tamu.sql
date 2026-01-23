-- UPDATE BUKU TAMU TABLE SCHEMA
-- Add missing columns for proper buku tamu functionality

-- Add missing columns to buku_tamu table
ALTER TABLE buku_tamu 
ADD COLUMN IF NOT EXISTS nama_lengkap VARCHAR(255),
ADD COLUMN IF NOT EXISTS no_hp_aktif VARCHAR(20),
ADD COLUMN IF NOT EXISTS alamat TEXT,
ADD COLUMN IF NOT EXISTS tanggal_kunjungan TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing data if any (map old columns to new ones)
UPDATE buku_tamu 
SET 
    nama_lengkap = COALESCE(nama_lengkap, nama),
    no_hp_aktif = COALESCE(no_hp_aktif, nik),
    tanggal_kunjungan = COALESCE(tanggal_kunjungan, waktu_akses)
WHERE nama_lengkap IS NULL OR no_hp_aktif IS NULL OR tanggal_kunjungan IS NULL;

-- Make new columns NOT NULL after data migration
ALTER TABLE buku_tamu 
ALTER COLUMN nama_lengkap SET NOT NULL,
ALTER COLUMN no_hp_aktif SET NOT NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_buku_tamu_tanggal ON buku_tamu(tanggal_kunjungan);
CREATE INDEX IF NOT EXISTS idx_buku_tamu_nama ON buku_tamu(nama_lengkap);

-- Update RLS policy for buku_tamu
DROP POLICY IF EXISTS "Public insert access for buku_tamu" ON buku_tamu;
CREATE POLICY "Public insert access for buku_tamu" ON buku_tamu FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read access for buku_tamu" ON buku_tamu FOR SELECT USING (auth.role() = 'authenticated');

-- Add comment
COMMENT ON TABLE buku_tamu IS 'Tabel untuk menyimpan data pengunjung yang mengakses website';
COMMENT ON COLUMN buku_tamu.nama_lengkap IS 'Nama lengkap pengunjung';
COMMENT ON COLUMN buku_tamu.no_hp_aktif IS 'Nomor HP aktif pengunjung';
COMMENT ON COLUMN buku_tamu.alamat IS 'Alamat lengkap pengunjung';
COMMENT ON COLUMN buku_tamu.tanggal_kunjungan IS 'Waktu kunjungan ke website';