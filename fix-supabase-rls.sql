-- Fix RLS policies for all tables to allow public read access

-- Disable RLS temporarily for testing
ALTER TABLE ikm_binaan DISABLE ROW LEVEL SECURITY;
ALTER TABLE hki_merek DISABLE ROW LEVEL SECURITY;
ALTER TABLE sertifikat_halal DISABLE ROW LEVEL SECURITY;
ALTER TABLE tkdn_ik DISABLE ROW LEVEL SECURITY;
ALTER TABLE siinas DISABLE ROW LEVEL SECURITY;
ALTER TABLE uji_nilai_gizi DISABLE ROW LEVEL SECURITY;
ALTER TABLE kurasi_produk DISABLE ROW LEVEL SECURITY;
ALTER TABLE pelatihan_pemberdayaan DISABLE ROW LEVEL SECURITY;
ALTER TABLE peserta_pelatihan DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE buku_tamu DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE website_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE recycle_bin DISABLE ROW LEVEL SECURITY;

-- Alternative: Enable RLS with public read policies
-- ALTER TABLE ikm_binaan ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE hki_merek ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sertifikat_halal ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tkdn_ik ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE siinas ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE uji_nilai_gizi ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE kurasi_produk ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE pelatihan_pemberdayaan ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE peserta_pelatihan ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public read access for ikm_binaan" ON ikm_binaan;
DROP POLICY IF EXISTS "Public read access for hki_merek" ON hki_merek;
DROP POLICY IF EXISTS "Public read access for sertifikat_halal" ON sertifikat_halal;
DROP POLICY IF EXISTS "Public read access for tkdn_ik" ON tkdn_ik;
DROP POLICY IF EXISTS "Public read access for siinas" ON siinas;
DROP POLICY IF EXISTS "Public read access for uji_nilai_gizi" ON uji_nilai_gizi;
DROP POLICY IF EXISTS "Public read access for kurasi_produk" ON kurasi_produk;
DROP POLICY IF EXISTS "Public read access for pelatihan_pemberdayaan" ON pelatihan_pemberdayaan;
DROP POLICY IF EXISTS "Public read access for peserta_pelatihan" ON peserta_pelatihan;

-- Create public read policies (if you want to re-enable RLS later)
-- CREATE POLICY "Public read access for ikm_binaan" ON ikm_binaan FOR SELECT USING (true);
-- CREATE POLICY "Public read access for hki_merek" ON hki_merek FOR SELECT USING (true);
-- CREATE POLICY "Public read access for sertifikat_halal" ON sertifikat_halal FOR SELECT USING (true);
-- CREATE POLICY "Public read access for tkdn_ik" ON tkdn_ik FOR SELECT USING (true);
-- CREATE POLICY "Public read access for siinas" ON siinas FOR SELECT USING (true);
-- CREATE POLICY "Public read access for uji_nilai_gizi" ON uji_nilai_gizi FOR SELECT USING (true);
-- CREATE POLICY "Public read access for kurasi_produk" ON kurasi_produk FOR SELECT USING (true);
-- CREATE POLICY "Public read access for pelatihan_pemberdayaan" ON pelatihan_pemberdayaan FOR SELECT USING (true);
-- CREATE POLICY "Public read access for peserta_pelatihan" ON peserta_pelatihan FOR SELECT USING (true);