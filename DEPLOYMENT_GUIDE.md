# 🚀 Deployment Guide - Database IKM JUARA

## Step-by-Step Deployment Process

### 📋 Prerequisites

1. **Akun yang Diperlukan:**
   - ✅ GitHub Account
   - ✅ Supabase Account (untuk database cloud)
   - ✅ Vercel Account (untuk hosting)

2. **Tools yang Diperlukan:**
   - ✅ Git (sudah terinstall)
   - ✅ Node.js 18+ (sudah terinstall)
   - ✅ Vercel CLI (akan diinstall)

---

## 🔧 Step 1: Setup GitHub Repository

### 1.1 Create GitHub Repository

1. **Buka GitHub.com** dan login
2. **Klik "New Repository"**
3. **Repository Settings:**
   ```
   Repository name: database-ikm-juara
   Description: Sistem Database IKM JUARA - Platform terintegrasi untuk mengelola data Industri Kecil Menengah (IKM) Binaan di Kota Madiun
   Visibility: Public (atau Private sesuai kebutuhan)
   ✅ Add README file: SKIP (sudah ada)
   ✅ Add .gitignore: SKIP (sudah ada)
   ✅ Choose a license: MIT License
   ```

### 1.2 Connect Local Repository to GitHub

```bash
# Add remote origin (ganti dengan URL repository Anda)
git remote add origin https://github.com/yourusername/database-ikm-juara.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 1.3 Verify GitHub Upload

- ✅ Check repository di GitHub
- ✅ Pastikan semua file terupload
- ✅ Verify README.md tampil dengan baik

---

## 🗄️ Step 2: Setup Supabase Database

### 2.1 Create Supabase Project

1. **Buka Supabase.com** dan login
2. **Create New Project:**
   ```
   Project Name: database-ikm-juara
   Database Password: [Generate strong password]
   Region: Southeast Asia (Singapore)
   ```

### 2.2 Create Database Tables

**Execute SQL di Supabase SQL Editor:**

```sql
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
    ikm_binaan_id INTEGER REFERENCES ikm_binaan(id),
    nama_lengkap VARCHAR(255) NOT NULL,
    nama_usaha VARCHAR(255) NOT NULL,
    nama_merek VARCHAR(255),
    kelas_merek VARCHAR(100),
    nomor_pendaftaran_hki VARCHAR(100),
    status_sertifikat VARCHAR(50),
    tahun_fasilitasi INTEGER,
    link_bukti_daftar TEXT,
    link_sertifikat_hki TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Sertifikat Halal table
CREATE TABLE sertifikat_halal (
    id SERIAL PRIMARY KEY,
    ikm_binaan_id INTEGER REFERENCES ikm_binaan(id),
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
    ikm_binaan_id INTEGER REFERENCES ikm_binaan(id),
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
    ikm_binaan_id INTEGER REFERENCES ikm_binaan(id),
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
    ikm_binaan_id INTEGER REFERENCES ikm_binaan(id),
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
    ikm_binaan_id INTEGER REFERENCES ikm_binaan(id),
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
    kuota INTEGER,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Peserta Pelatihan table
CREATE TABLE peserta_pelatihan (
    id SERIAL PRIMARY KEY,
    pelatihan_id INTEGER REFERENCES pelatihan_pemberdayaan(id),
    ikm_binaan_id INTEGER REFERENCES ikm_binaan(id),
    nib VARCHAR(13),
    nik VARCHAR(16),
    nama_lengkap VARCHAR(255),
    nama_usaha VARCHAR(255),
    nomor_hp VARCHAR(20),
    tanggal_daftar TIMESTAMP DEFAULT NOW()
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
    success BOOLEAN DEFAULT true
);

-- Create Buku Tamu table
CREATE TABLE buku_tamu (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    nik VARCHAR(16) NOT NULL,
    waktu_akses TIMESTAMP DEFAULT NOW(),
    ip_address INET
);

-- Insert default admin user
INSERT INTO admin_users (username, password, nama, role) VALUES 
('BidIndustri08#', 'DisnakerKUKM2024!', 'Admin DisnakerKUKM', 'super_admin');

-- Insert default website content
INSERT INTO website_content (section, title, content) VALUES 
('layanan-ikm', 'Layanan IKM Juara', '[
  {
    "id": "hki-merek",
    "title": "📜 Pendaftaran HKI Merek",
    "description": "Fasilitasi pendaftaran Hak Kekayaan Intelektual untuk merek dagang IKM"
  },
  {
    "id": "sertifikat-halal",
    "title": "✅ Pendaftaran Sertifikat Halal",
    "description": "Bantuan pengurusan sertifikat halal untuk produk makanan dan minuman"
  }
]'::jsonb),
('pelatihan', 'Program Pelatihan Pemberdayaan Industri', '[
  {
    "id": "default-pelatihan",
    "title": "📚 Program pelatihan akan segera diumumkan",
    "description": "Pantau terus website ini untuk informasi program pelatihan terbaru"
  }
]'::jsonb);
```

### 2.3 Get Supabase Credentials

1. **Go to Project Settings > API**
2. **Copy credentials:**
   ```
   Project URL: https://your-project.supabase.co
   API Key (anon): your-anon-key
   API Key (service_role): your-service-role-key
   ```

---

## 🌐 Step 3: Deploy to Vercel

### 3.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 3.2 Login to Vercel

```bash
vercel login
```

### 3.3 Deploy Project

```bash
# Deploy to Vercel
vercel --prod

# Follow the prompts:
# ? Set up and deploy "D:\apkfixikmjuara"? [Y/n] y
# ? Which scope do you want to deploy to? [Your Account]
# ? Link to existing project? [y/N] n
# ? What's your project's name? database-ikm-juara
# ? In which directory is your code located? ./
```

### 3.4 Configure Environment Variables

**Di Vercel Dashboard:**

1. **Go to Project Settings > Environment Variables**
2. **Add variables:**
   ```
   NODE_ENV = production
   SUPABASE_URL = https://your-project.supabase.co
   SUPABASE_ANON_KEY = your-anon-key
   SUPABASE_SERVICE_KEY = your-service-role-key
   ```

### 3.5 Redeploy with Environment Variables

```bash
vercel --prod
```

---

## 🔄 Step 4: Update Application for Cloud Database

### 4.1 Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 4.2 Create Database Configuration

**Create `server/database.js`:**

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:3000';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'local-key';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
```

### 4.3 Update Server to Use Supabase

**Update `server/app.js` to include Supabase integration**

---

## ✅ Step 5: Verification & Testing

### 5.1 Test Deployment

1. **Check Vercel URL:** https://database-ikm-juara.vercel.app
2. **Test Admin Panel:** /admin/login.html
3. **Test Public Website:** /public/login.html
4. **Test API Endpoints:** /api/dashboard

### 5.2 Test Database Connection

1. **Check Supabase Dashboard**
2. **Verify data insertion**
3. **Test CRUD operations**

### 5.3 Performance Testing

1. **Page load speed**
2. **API response time**
3. **Database query performance**

---

## 📊 Step 6: Monitoring & Maintenance

### 6.1 Setup Monitoring

1. **Vercel Analytics**
2. **Supabase Monitoring**
3. **Error tracking**

### 6.2 Backup Strategy

1. **Database backups**
2. **Code repository backups**
3. **Environment variables backup**

---

## 🎯 Deployment Checklist

### Pre-Deployment
- ✅ Git repository initialized
- ✅ All files committed
- ✅ .gitignore configured
- ✅ package.json updated
- ✅ vercel.json configured

### GitHub Setup
- ✅ Repository created
- ✅ Code pushed to GitHub
- ✅ README.md visible
- ✅ License added

### Supabase Setup
- ✅ Project created
- ✅ Database tables created
- ✅ Default data inserted
- ✅ API keys obtained

### Vercel Deployment
- ✅ Vercel CLI installed
- ✅ Project deployed
- ✅ Environment variables set
- ✅ Custom domain (optional)

### Testing
- ✅ Website accessible
- ✅ Admin panel working
- ✅ Database operations working
- ✅ API endpoints responding

---

## 🚨 Troubleshooting

### Common Issues

1. **Build Errors:**
   - Check Node.js version
   - Verify dependencies
   - Check vercel.json configuration

2. **Database Connection:**
   - Verify Supabase credentials
   - Check environment variables
   - Test database connectivity

3. **Deployment Issues:**
   - Check Vercel logs
   - Verify file permissions
   - Check API routes

### Support Resources

- **Vercel Documentation:** https://vercel.com/docs
- **Supabase Documentation:** https://supabase.com/docs
- **GitHub Documentation:** https://docs.github.com

---

## 📞 Next Steps

1. **Custom Domain:** Setup custom domain di Vercel
2. **SSL Certificate:** Automatic HTTPS
3. **Performance Optimization:** CDN, caching
4. **Monitoring:** Setup alerts dan monitoring
5. **Backup:** Automated backup strategy

**Status: Ready for Production Deployment! 🚀**