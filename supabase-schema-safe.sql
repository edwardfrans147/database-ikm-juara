-- SUPABASE DATABASE SCHEMA FOR IKM JUARA (SAFE VERSION)
-- Schema yang aman untuk dijalankan berulang kali

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create IKM Binaan table (safe)
CREATE TABLE IF NOT EXISTS ikm_binaan (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nib VARCHAR(13) UNIQUE NOT NULL,
    nik VARCHAR(16) UNIQUE NOT NULL,
    nama_lengkap VARCHAR(255) NOT NULL,
    alamat_lengkap TEXT NOT NULL,
    nama_usaha VARCHAR(255) NOT NULL,
    nomor_hp VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create HKI Merek table (safe)
CREATE TABLE IF NOT EXISTS hki_merek (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ikm_binaan_id UUID REFERENCES ikm_binaan(id) ON DELETE CASCADE,
    nama_lengkap VARCHAR(255) NOT NULL,
    nama_usaha VARCHAR(255) NOT NULL,
    nama_merek VARCHAR(255),
    kelas_merek VARCHAR(100),
    nomor_pendaftaran_hki VARCHAR(100),
    status_sertifikat VARCHAR(100),
    tahun_fasilitasi INTEGER,
    link_bukti_daftar TEXT,
    link_sertifikat_hki TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Sertifikat Halal table (safe)
CREATE TABLE IF NOT EXISTS sertifikat_halal (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ikm_binaan_id UUID REFERENCES ikm_binaan(id) ON DELETE CASCADE,
    nama_lengkap VARCHAR(255) NOT NULL,
    nama_usaha VARCHAR(255) NOT NULL,
    nomor_sertifikat_halal VARCHAR(100),
    tahun_fasilitasi INTEGER,
    link_sertifikat_halal TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create TKDN IK table (safe)
CREATE TABLE IF NOT EXISTS tkdn_ik (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ikm_binaan_id UUID REFERENCES ikm_binaan(id) ON DELETE CASCADE,
    nama_lengkap VARCHAR(255) NOT NULL,
    nama_usaha VARCHAR(255) NOT NULL,
    nomor_sertifikat_tkdn VARCHAR(100),
    tahun_terbit_sertifikat INTEGER,
    link_sertifikat_tkdn TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create SIINas table (safe)
CREATE TABLE IF NOT EXISTS siinas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ikm_binaan_id UUID REFERENCES ikm_binaan(id) ON DELETE CASCADE,
    nama_lengkap VARCHAR(255) NOT NULL,
    nama_usaha VARCHAR(255) NOT NULL,
    nomor_bukti_kepemilikan VARCHAR(100),
    tahun_registrasi INTEGER,
    link_bukti_kepemilikan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Uji Nilai Gizi table (safe)
CREATE TABLE IF NOT EXISTS uji_nilai_gizi (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ikm_binaan_id UUID REFERENCES ikm_binaan(id) ON DELETE CASCADE,
    nama_lengkap VARCHAR(255) NOT NULL,
    nama_usaha VARCHAR(255) NOT NULL,
    nomor_lhu VARCHAR(100),
    tanggal_hasil_uji DATE,
    tahun_fasilitasi INTEGER,
    link_lhu TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Kurasi Produk table (safe)
CREATE TABLE IF NOT EXISTS kurasi_produk (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ikm_binaan_id UUID REFERENCES ikm_binaan(id) ON DELETE CASCADE,
    nama_lengkap VARCHAR(255) NOT NULL,
    nama_usaha VARCHAR(255) NOT NULL,
    nomor_sertifikat_kurasi VARCHAR(100),
    tahun_kurasi INTEGER,
    link_sertifikat_kurasi TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Pelatihan Pemberdayaan table (safe)
CREATE TABLE IF NOT EXISTS pelatihan_pemberdayaan (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    judul_pelatihan VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE NOT NULL,
    lokasi VARCHAR(255) NOT NULL,
    instruktur VARCHAR(255),
    kuota INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(50) DEFAULT 'aktif',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Peserta Pelatihan table (safe)
CREATE TABLE IF NOT EXISTS peserta_pelatihan (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pelatihan_id UUID REFERENCES pelatihan_pemberdayaan(id) ON DELETE CASCADE,
    ikm_binaan_id UUID REFERENCES ikm_binaan(id) ON DELETE CASCADE,
    tanggal_daftar TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'terdaftar',
    UNIQUE(pelatihan_id, ikm_binaan_id)
);

-- Create Admin Users table (safe)
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nama VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Buku Tamu table (safe)
CREATE TABLE IF NOT EXISTS buku_tamu (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    nik VARCHAR(16) NOT NULL,
    waktu_akses TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Create Activity Logs table (safe)
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    user_name VARCHAR(255),
    details JSONB,
    success BOOLEAN DEFAULT true,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Website Content table (safe)
CREATE TABLE IF NOT EXISTS website_content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    section VARCHAR(100) NOT NULL,
    item_id VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    contact VARCHAR(255),
    link TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(section, item_id)
);

-- Create Recycle Bin table (safe)
CREATE TABLE IF NOT EXISTS recycle_bin (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id VARCHAR(100) NOT NULL,
    data JSONB NOT NULL,
    deleted_by VARCHAR(255),
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance (safe)
CREATE INDEX IF NOT EXISTS idx_ikm_binaan_nib ON ikm_binaan(nib);
CREATE INDEX IF NOT EXISTS idx_ikm_binaan_nik ON ikm_binaan(nik);
CREATE INDEX IF NOT EXISTS idx_ikm_binaan_nama ON ikm_binaan(nama_lengkap);
CREATE INDEX IF NOT EXISTS idx_hki_merek_ikm_id ON hki_merek(ikm_binaan_id);
CREATE INDEX IF NOT EXISTS idx_sertifikat_halal_ikm_id ON sertifikat_halal(ikm_binaan_id);
CREATE INDEX IF NOT EXISTS idx_tkdn_ik_ikm_id ON tkdn_ik(ikm_binaan_id);
CREATE INDEX IF NOT EXISTS idx_siinas_ikm_id ON siinas(ikm_binaan_id);
CREATE INDEX IF NOT EXISTS idx_uji_nilai_gizi_ikm_id ON uji_nilai_gizi(ikm_binaan_id);
CREATE INDEX IF NOT EXISTS idx_kurasi_produk_ikm_id ON kurasi_produk(ikm_binaan_id);
CREATE INDEX IF NOT EXISTS idx_peserta_pelatihan_ikm_id ON peserta_pelatihan(ikm_binaan_id);
CREATE INDEX IF NOT EXISTS idx_peserta_pelatihan_pelatihan_id ON peserta_pelatihan(pelatihan_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_type ON activity_logs(type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_name);

-- Enable Row Level Security (RLS) - safe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'ikm_binaan' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE ikm_binaan ENABLE ROW LEVEL SECURITY;
        ALTER TABLE hki_merek ENABLE ROW LEVEL SECURITY;
        ALTER TABLE sertifikat_halal ENABLE ROW LEVEL SECURITY;
        ALTER TABLE tkdn_ik ENABLE ROW LEVEL SECURITY;
        ALTER TABLE siinas ENABLE ROW LEVEL SECURITY;
        ALTER TABLE uji_nilai_gizi ENABLE ROW LEVEL SECURITY;
        ALTER TABLE kurasi_produk ENABLE ROW LEVEL SECURITY;
        ALTER TABLE pelatihan_pemberdayaan ENABLE ROW LEVEL SECURITY;
        ALTER TABLE peserta_pelatihan ENABLE ROW LEVEL SECURITY;
        ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
        ALTER TABLE buku_tamu ENABLE ROW LEVEL SECURITY;
        ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
        ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;
        ALTER TABLE recycle_bin ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create policies for public access (safe)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'ikm_binaan' 
        AND policyname = 'Public read access for ikm_binaan'
    ) THEN
        CREATE POLICY "Public read access for ikm_binaan" ON ikm_binaan FOR SELECT USING (true);
        CREATE POLICY "Public read access for website_content" ON website_content FOR SELECT USING (is_active = true);
        
        -- Admin policies
        CREATE POLICY "Admin full access for ikm_binaan" ON ikm_binaan FOR ALL USING (auth.role() = 'authenticated');
        CREATE POLICY "Admin full access for hki_merek" ON hki_merek FOR ALL USING (auth.role() = 'authenticated');
        CREATE POLICY "Admin full access for sertifikat_halal" ON sertifikat_halal FOR ALL USING (auth.role() = 'authenticated');
        CREATE POLICY "Admin full access for tkdn_ik" ON tkdn_ik FOR ALL USING (auth.role() = 'authenticated');
        CREATE POLICY "Admin full access for siinas" ON siinas FOR ALL USING (auth.role() = 'authenticated');
        CREATE POLICY "Admin full access for uji_nilai_gizi" ON uji_nilai_gizi FOR ALL USING (auth.role() = 'authenticated');
        CREATE POLICY "Admin full access for kurasi_produk" ON kurasi_produk FOR ALL USING (auth.role() = 'authenticated');
        CREATE POLICY "Admin full access for pelatihan_pemberdayaan" ON pelatihan_pemberdayaan FOR ALL USING (auth.role() = 'authenticated');
        CREATE POLICY "Admin full access for peserta_pelatihan" ON peserta_pelatihan FOR ALL USING (auth.role() = 'authenticated');
        CREATE POLICY "Admin full access for admin_users" ON admin_users FOR ALL USING (auth.role() = 'authenticated');
        CREATE POLICY "Admin full access for activity_logs" ON activity_logs FOR ALL USING (auth.role() = 'authenticated');
        CREATE POLICY "Admin full access for website_content" ON website_content FOR ALL USING (auth.role() = 'authenticated');
        CREATE POLICY "Admin full access for recycle_bin" ON recycle_bin FOR ALL USING (auth.role() = 'authenticated');
        
        -- Public insert for buku_tamu
        CREATE POLICY "Public insert access for buku_tamu" ON buku_tamu FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- Insert default data (safe)
INSERT INTO admin_users (username, password_hash, nama, role) 
VALUES ('BidIndustri08#', '$2b$10$encrypted_password_hash', 'Administrator IKM JUARA', 'super_admin')
ON CONFLICT (username) DO NOTHING;

-- Insert default website content (safe)
INSERT INTO website_content (section, item_id, title, description, contact, link) VALUES 
('layanan', 'hki-merek', 'Pendaftaran HKI Merek', 'Layanan pendaftaran Hak Kekayaan Intelektual untuk merek dagang', 'Hubungi: 0351-123456', 'https://dgip.go.id'),
('layanan', 'sertifikat-halal', 'Pendaftaran Sertifikat Halal', 'Layanan pendaftaran sertifikat halal untuk produk makanan dan minuman', 'Hubungi: 0351-123456', 'https://halal.go.id'),
('layanan', 'tkdn-ik', 'Pendaftaran TKDN IK', 'Layanan pendaftaran Tingkat Kandungan Dalam Negeri Industri Kecil', 'Hubungi: 0351-123456', 'https://kemenperin.go.id'),
('layanan', 'siinas', 'Pendaftaran dan Pendampingan SIINas', 'Layanan pendaftaran Sistem Informasi Industri Nasional', 'Hubungi: 0351-123456', 'https://siinas.kemenperin.go.id'),
('layanan', 'uji-nilai-gizi', 'Pendaftaran Uji Nilai Gizi', 'Layanan pengujian nilai gizi produk makanan dan minuman', 'Hubungi: 0351-123456', 'https://pom.go.id'),
('layanan', 'kurasi-produk', 'Kurasi Produk', 'Layanan kurasi produk unggulan daerah', 'Hubungi: 0351-123456', '#'),
('pelatihan', 'pemberdayaan-ikm', 'Pelatihan Pemberdayaan IKM', 'Program pelatihan untuk meningkatkan kapasitas IKM', 'Hubungi: 0351-123456', '#')
ON CONFLICT (section, item_id) DO NOTHING;

-- Create functions for updated_at trigger (safe)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at (safe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_ikm_binaan_updated_at') THEN
        CREATE TRIGGER update_ikm_binaan_updated_at BEFORE UPDATE ON ikm_binaan FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        CREATE TRIGGER update_hki_merek_updated_at BEFORE UPDATE ON hki_merek FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        CREATE TRIGGER update_sertifikat_halal_updated_at BEFORE UPDATE ON sertifikat_halal FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        CREATE TRIGGER update_tkdn_ik_updated_at BEFORE UPDATE ON tkdn_ik FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        CREATE TRIGGER update_siinas_updated_at BEFORE UPDATE ON siinas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        CREATE TRIGGER update_uji_nilai_gizi_updated_at BEFORE UPDATE ON uji_nilai_gizi FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        CREATE TRIGGER update_kurasi_produk_updated_at BEFORE UPDATE ON kurasi_produk FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        CREATE TRIGGER update_pelatihan_pemberdayaan_updated_at BEFORE UPDATE ON pelatihan_pemberdayaan FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        CREATE TRIGGER update_website_content_updated_at BEFORE UPDATE ON website_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Final verification
SELECT 'Schema setup completed successfully!' as status, 
       count(*) as total_tables 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE';