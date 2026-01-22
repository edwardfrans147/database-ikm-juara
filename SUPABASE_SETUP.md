# 🗄️ Supabase Database Setup - Database IKM JUARA

## Step-by-Step Supabase Configuration

### 📋 Prerequisites
- ✅ Supabase account (buat di https://supabase.com jika belum ada)
- ✅ GitHub repository sudah setup
- ✅ Basic understanding of SQL

---

## 🚀 Step 1: Create Supabase Project

### 1.1 Login to Supabase
1. Buka https://supabase.com
2. **Klik "Start your project"**
3. **Login dengan GitHub** (recommended) atau email

### 1.2 Create New Project
1. **Klik "New Project"**
2. **Select Organization** (atau buat baru)
3. **Project Configuration:**
   ```
   Name: database-ikm-juara
   Database Password: [Generate strong password - SIMPAN INI!]
   Region: Southeast Asia (Singapore) - untuk performa terbaik
   Pricing Plan: Free tier (cukup untuk development)
   ```
4. **Klik "Create new project"**

### 1.3 Wait for Setup
- Project setup membutuhkan 2-3 menit
- Anda akan mendapat email konfirmasi

---

## 🗃️ Step 2: Database Schema Setup

### 2.1 Access SQL Editor
1. **Go to project dashboard**
2. **Klik "SQL Editor" di sidebar**
3. **Klik "New query"**

### 2.2 Create Database Tables

**Copy dan execute SQL berikut:**

```sql
-- ================================
-- DATABASE IKM JUARA SCHEMA
-- ================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create IKM Binaan table
CREATE TABLE ikm_binaan (
    id SERIAL PRIMARY KEY,
    nib VARCHAR(13) UNIQUE NOT NULL,
    nik VARCHAR(16) UNIQUE NOT NULL,
    nama_lengkap VARCHAR(255) NOT NULL,
    alamat_lengkap TEXT NOT NULL,
    nama_usaha VARCHAR(255) NOT NULL,
    nomor_hp VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create HKI Merek table
CREATE TABLE hki_merek (
    id SERIAL PRIMARY KEY,
    ikm_binaan_id INTEGER REFERENCES ikm_binaan(id) ON DELETE CASCADE,
    nama_lengkap VARCHAR(255) NOT NULL,
    nama_usaha VARCHAR(255) NOT NULL,
    nama_merek VARCHAR(255),
    kelas_merek VARCHAR(100),
    nomor_pendaftaran_hki VARCHAR(100),
    status_sertifikat VARCHAR(50) DEFAULT 'Proses',
    tahun_fasilitasi INTEGER,
    link_bukti_daftar TEXT,
    link_sertifikat_hki TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Sertifikat Halal table
CREATE TABLE sertifikat_halal (
    id SERIAL PRIMARY KEY,
    ikm_binaan_id INTEGER REFERENCES ikm_binaan(id) ON DELETE CASCADE,
    nama_lengkap VARCHAR(255) NOT NULL,
    nama_usaha VARCHAR(255) NOT NULL,
    nomor_sertifikat_halal VARCHAR(100),
    tahun_fasilitasi INTEGER,
    link_sertifikat_halal TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create TKDN IK table
CREATE TABLE tkdn_ik (
    id SERIAL PRIMARY KEY,
    ikm_binaan_id INTEGER REFERENCES ikm_binaan(id) ON DELETE CASCADE,
    nama_lengkap VARCHAR(255) NOT NULL,
    nama_usaha VARCHAR(255) NOT NULL,
    nomor_sertifikat_tkdn VARCHAR(100),
    tahun_terbit_sertifikat INTEGER,
    link_sertifikat_tkdn TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create SIINas table
CREATE TABLE siinas (
    id SERIAL PRIMARY KEY,
    ikm_binaan_id INTEGER REFERENCES ikm_binaan(id) ON DELETE CASCADE,
    nama_lengkap VARCHAR(255) NOT NULL,
    nama_usaha VARCHAR(255) NOT NULL,
    nomor_bukti_kepemilikan VARCHAR(100),
    tahun_registrasi INTEGER,
    link_bukti_kepemilikan TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Uji Nilai Gizi table
CREATE TABLE uji_nilai_gizi (
    id SERIAL PRIMARY KEY,
    ikm_binaan_id INTEGER REFERENCES ikm_binaan(id) ON DELETE CASCADE,
    nama_lengkap VARCHAR(255) NOT NULL,
    nama_usaha VARCHAR(255) NOT NULL,
    nomor_lhu VARCHAR(100),
    tanggal_hasil_uji DATE,
    tahun_fasilitasi INTEGER,
    link_lhu TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Kurasi Produk table
CREATE TABLE kurasi_produk (
    id SERIAL PRIMARY KEY,
    ikm_binaan_id INTEGER REFERENCES ikm_binaan(id) ON DELETE CASCADE,
    nama_lengkap VARCHAR(255) NOT NULL,
    nama_usaha VARCHAR(255) NOT NULL,
    nomor_sertifikat_kurasi VARCHAR(100),
    tahun_kurasi INTEGER,
    link_sertifikat_kurasi TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Pelatihan Pemberdayaan table
CREATE TABLE pelatihan_pemberdayaan (
    id SERIAL PRIMARY KEY,
    judul_pelatihan VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    tanggal_mulai DATE,
    tanggal_selesai DATE,
    lokasi VARCHAR(255),
    instruktur VARCHAR(255),
    kuota INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Aktif',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Peserta Pelatihan table
CREATE TABLE peserta_pelatihan (
    id SERIAL PRIMARY KEY,
    pelatihan_id INTEGER REFERENCES pelatihan_pemberdayaan(id) ON DELETE CASCADE,
    ikm_binaan_id INTEGER REFERENCES ikm_binaan(id) ON DELETE CASCADE,
    nib VARCHAR(13),
    nik VARCHAR(16),
    nama_lengkap VARCHAR(255),
    nama_usaha VARCHAR(255),
    nomor_hp VARCHAR(20),
    tanggal_daftar TIMESTAMP DEFAULT NOW(),
    UNIQUE(pelatihan_id, ikm_binaan_id)
);

-- Create Admin Users table
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nama VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Website Content table
CREATE TABLE website_content (
    id SERIAL PRIMARY KEY,
    section VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Activity Logs table
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT NOW(),
    type VARCHAR(100),
    action VARCHAR(100),
    user_info VARCHAR(255),
    details JSONB,
    success BOOLEAN DEFAULT true,
    ip_address INET
);

-- Create Buku Tamu table
CREATE TABLE buku_tamu (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    nik VARCHAR(16) NOT NULL,
    waktu_akses TIMESTAMP DEFAULT NOW(),
    ip_address INET
);

-- Create Recycle Bin table
CREATE TABLE recycle_bin (
    id SERIAL PRIMARY KEY,
    original_table VARCHAR(100) NOT NULL,
    original_id INTEGER NOT NULL,
    data JSONB NOT NULL,
    deleted_by VARCHAR(255),
    deleted_at TIMESTAMP DEFAULT NOW(),
    auto_delete_at TIMESTAMP DEFAULT (NOW() + INTERVAL '7 days')
);

-- Create indexes for better performance
CREATE INDEX idx_ikm_binaan_nib ON ikm_binaan(nib);
CREATE INDEX idx_ikm_binaan_nik ON ikm_binaan(nik);
CREATE INDEX idx_ikm_binaan_nama ON ikm_binaan(nama_lengkap);
CREATE INDEX idx_activity_logs_timestamp ON activity_logs(timestamp);
CREATE INDEX idx_activity_logs_type ON activity_logs(type);
CREATE INDEX idx_recycle_bin_auto_delete ON recycle_bin(auto_delete_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
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
```

### 2.3 Insert Default Data

**Execute SQL berikut untuk data default:**

```sql
-- Insert default admin user
INSERT INTO admin_users (username, password, nama, role) VALUES 
('BidIndustri08#', 'DisnakerKUKM2024!', 'Admin DisnakerKUKM', 'super_admin');

-- Insert default website content
INSERT INTO website_content (section, title, content) VALUES 
('layanan-ikm', 'Layanan IKM Juara', '[
  {
    "id": "hki-merek",
    "title": "📜 Pendaftaran HKI Merek",
    "description": "Fasilitasi pendaftaran Hak Kekayaan Intelektual untuk merek dagang IKM\\nDengan syarat :\\n1. KTP\\n2. NIB\\n3. Materai 10.000 (1 lembar)\\n4. Etiket / Logo yang ingin didaftarkan merek"
  },
  {
    "id": "sertifikat-halal",
    "title": "✅ Pendaftaran Sertifikat Halal",
    "description": "Bantuan pengurusan sertifikat halal untuk produk makanan dan minuman"
  },
  {
    "id": "tkdn-ik",
    "title": "🇮🇩 Pendaftaran TKDN IK",
    "description": "Sertifikasi Tingkat Komponen Dalam Negeri untuk Industri Kecil"
  },
  {
    "id": "siinas",
    "title": "💾 Pendaftaran dan Pendampingan SIINas",
    "description": "Registrasi dan pendampingan Sistem Informasi Industri Nasional"
  },
  {
    "id": "uji-nilai-gizi",
    "title": "🧪 Pendaftaran Uji Nilai Gizi",
    "description": "Fasilitasi pengujian nilai gizi produk makanan dan minuman"
  },
  {
    "id": "kurasi-produk",
    "title": "🏆 Kurasi Produk",
    "description": "Penilaian dan kurasi produk IKM untuk peningkatan kualitas"
  }
]'::jsonb),
('pelatihan', 'Program Pelatihan Pemberdayaan Industri', '[
  {
    "id": "default-pelatihan",
    "title": "📚 Program pelatihan akan segera diumumkan",
    "description": "Pantau terus website ini untuk informasi program pelatihan terbaru"
  }
]'::jsonb);

-- Insert sample IKM Binaan data
INSERT INTO ikm_binaan (nib, nik, nama_lengkap, alamat_lengkap, nama_usaha, nomor_hp) VALUES
('1234567890123', '3518012345678901', 'Ahmad Rizki Pratama', 'Jl. Merdeka No. 123, Kelurahan Manguharjo, Kecamatan Manguharjo, Kota Madiun', 'Keripik Singkong Rizki', '081234567890'),
('2345678901234', '3518023456789012', 'Siti Nurhaliza', 'Jl. Pahlawan No. 456, Kelurahan Taman, Kecamatan Taman, Kota Madiun', 'Batik Nurhaliza Collection', '081345678901'),
('3456789012345', '3518034567890123', 'Budi Santoso', 'Jl. Diponegoro No. 789, Kelurahan Kartoharjo, Kecamatan Kartoharjo, Kota Madiun', 'Furniture Budi Jaya', '081456789012');

-- Insert sample pelatihan
INSERT INTO pelatihan_pemberdayaan (judul_pelatihan, deskripsi, tanggal_mulai, tanggal_selesai, lokasi, instruktur, kuota, status) VALUES
('Workshop Digital Marketing untuk IKM', 'Pelatihan pemasaran digital untuk meningkatkan penjualan produk IKM melalui platform online', '2024-02-01', '2024-02-03', 'Balai Pelatihan DisnakerKUKM Kota Madiun', 'Dr. Marketing Expert', 30, 'Selesai'),
('Pelatihan Manajemen Keuangan UMKM', 'Pelatihan pengelolaan keuangan yang baik untuk usaha mikro, kecil, dan menengah', '2024-03-15', '2024-03-17', 'Aula DisnakerKUKM Kota Madiun', 'Drs. Finance Consultant', 25, 'Aktif');
```

### 2.4 Verify Tables Created

**Check tables dengan query:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Expected output: 13 tables created

---

## 🔑 Step 3: Get API Credentials

### 3.1 Access Project Settings
1. **Go to Settings > API**
2. **Copy the following credentials:**

```
Project URL: https://your-project-id.supabase.co
API Key (anon public): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
API Key (service_role): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3.2 Database Connection String
```
postgresql://postgres:[YOUR-PASSWORD]@db.your-project-id.supabase.co:5432/postgres
```

**⚠️ IMPORTANT: Simpan credentials ini dengan aman!**

---

## 🔒 Step 4: Configure Row Level Security (RLS)

### 4.1 Enable RLS for Security

**Execute SQL berikut:**

```sql
-- Enable RLS on all tables
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
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE buku_tamu ENABLE ROW LEVEL SECURITY;
ALTER TABLE recycle_bin ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for public website)
CREATE POLICY "Allow public read access" ON ikm_binaan FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON hki_merek FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON sertifikat_halal FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON tkdn_ik FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON siinas FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON uji_nilai_gizi FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON kurasi_produk FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON pelatihan_pemberdayaan FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON peserta_pelatihan FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON website_content FOR SELECT USING (true);

-- Create policies for admin access (full CRUD)
CREATE POLICY "Allow admin full access" ON ikm_binaan FOR ALL USING (true);
CREATE POLICY "Allow admin full access" ON hki_merek FOR ALL USING (true);
CREATE POLICY "Allow admin full access" ON sertifikat_halal FOR ALL USING (true);
CREATE POLICY "Allow admin full access" ON tkdn_ik FOR ALL USING (true);
CREATE POLICY "Allow admin full access" ON siinas FOR ALL USING (true);
CREATE POLICY "Allow admin full access" ON uji_nilai_gizi FOR ALL USING (true);
CREATE POLICY "Allow admin full access" ON kurasi_produk FOR ALL USING (true);
CREATE POLICY "Allow admin full access" ON pelatihan_pemberdayaan FOR ALL USING (true);
CREATE POLICY "Allow admin full access" ON peserta_pelatihan FOR ALL USING (true);
CREATE POLICY "Allow admin full access" ON admin_users FOR ALL USING (true);
CREATE POLICY "Allow admin full access" ON website_content FOR ALL USING (true);
CREATE POLICY "Allow admin full access" ON activity_logs FOR ALL USING (true);
CREATE POLICY "Allow admin full access" ON buku_tamu FOR ALL USING (true);
CREATE POLICY "Allow admin full access" ON recycle_bin FOR ALL USING (true);
```

---

## 📊 Step 5: Test Database Connection

### 5.1 Test via Supabase Dashboard
1. **Go to Table Editor**
2. **Check all tables are visible**
3. **Verify sample data exists**

### 5.2 Test API Connection
**Test dengan curl atau Postman:**

```bash
curl -X GET 'https://your-project-id.supabase.co/rest/v1/ikm_binaan' \
-H "apikey: YOUR_ANON_KEY" \
-H "Authorization: Bearer YOUR_ANON_KEY"
```

Expected: JSON response dengan sample data

---

## 🔄 Step 6: Backup & Maintenance

### 6.1 Setup Automatic Backups
1. **Go to Settings > Database**
2. **Enable Point-in-time Recovery** (PITR)
3. **Configure backup retention**

### 6.2 Database Monitoring
1. **Go to Reports**
2. **Monitor database performance**
3. **Set up alerts for issues**

---

## 📋 Step 7: Integration Checklist

### 7.1 Supabase Setup Checklist
- ✅ Project created
- ✅ Database schema created (13 tables)
- ✅ Default data inserted
- ✅ RLS policies configured
- ✅ API credentials obtained
- ✅ Database connection tested

### 7.2 Next Steps
1. **✅ Supabase Database** - COMPLETED
2. **🔄 Update Application Code** - Next step
3. **🚀 Vercel Deployment** - Final step

---

## 🚨 Troubleshooting

### Common Issues

#### 1. SQL Execution Error
- **Check syntax carefully**
- **Execute queries one by one**
- **Check for missing semicolons**

#### 2. Connection Issues
- **Verify project URL**
- **Check API key validity**
- **Ensure RLS policies allow access**

#### 3. Performance Issues
- **Check query performance**
- **Add indexes if needed**
- **Monitor database usage**

---

## 📞 Support Resources

- **Supabase Documentation:** https://supabase.com/docs
- **SQL Reference:** https://www.postgresql.org/docs/
- **Supabase Community:** https://github.com/supabase/supabase/discussions

**Supabase Database Setup - COMPLETED! ✅**

**Next:** Update application code untuk menggunakan Supabase