# 🗄️ SETUP SUPABASE MANUAL - LANGKAH DEMI LANGKAH

## 🎯 **TUJUAN**
Menghubungkan Database IKM JUARA dengan Supabase untuk:
- ✅ Database PostgreSQL yang powerful dan scalable
- ✅ Auto-generated REST API
- ✅ Real-time subscriptions
- ✅ Row Level Security (RLS)
- ✅ Backup otomatis dan monitoring

---

## 📋 **LANGKAH 1: BUAT PROJECT SUPABASE**

### **1.1 Akses Supabase Dashboard**
1. **Buka browser** dan pergi ke: https://supabase.com/dashboard
2. **Login** dengan akun GitHub atau email
   - Jika belum punya akun: Klik "Sign up" dan buat akun baru
3. **Klik "New Project"**

### **1.2 Konfigurasi Project**
```
📝 Project Name: ikm-juara-database
📄 Organization: Pilih organization Anda (biasanya username GitHub)
🔒 Database Password: Buat password yang KUAT (minimal 12 karakter)
🌏 Region: Southeast Asia (Singapore) - ap-southeast-1
💰 Pricing Plan: Free tier (cukup untuk development)
```

**⚠️ PENTING: SIMPAN DATABASE PASSWORD INI!**

### **1.3 Tunggu Project Dibuat**
- ⏱️ **Waktu**: 2-3 menit
- ✅ **Status**: Tunggu hingga "Setting up project..." selesai
- 🎉 **Selesai**: Anda akan diarahkan ke dashboard project

---

## 🔑 **LANGKAH 2: DAPATKAN API KEYS**

### **2.1 Buka Settings → API**
1. **Klik Settings** (ikon gear) di sidebar kiri
2. **Pilih "API"** dari menu Settings

### **2.2 Copy Informasi Penting**
Anda akan melihat informasi seperti ini:

```
🔗 Project URL: https://abcdefghijklmnop.supabase.co
🔑 anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5...
🔐 service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjk...
```

**⚠️ PENTING: COPY DAN SIMPAN SEMUA INFORMASI INI!**

---

## 🗃️ **LANGKAH 3: SETUP DATABASE SCHEMA**

### **3.1 Buka SQL Editor**
1. **Klik "SQL Editor"** di sidebar kiri
2. **Klik "New Query"**

### **3.2 Execute Schema**
1. **Buka file** `supabase-schema.sql` di project Anda
2. **Copy seluruh isi** file tersebut (Ctrl+A, Ctrl+C)
3. **Paste** ke SQL Editor di Supabase (Ctrl+V)
4. **Klik "Run"** (atau tekan Ctrl+Enter)
5. **Tunggu** hingga semua query selesai (akan muncul "Success" untuk setiap query)

### **3.3 Verifikasi Tables**
1. **Klik "Table Editor"** di sidebar kiri
2. **Pastikan** semua table berikut ada:
   - ✅ ikm_binaan (table utama)
   - ✅ hki_merek
   - ✅ sertifikat_halal
   - ✅ tkdn_ik
   - ✅ siinas
   - ✅ uji_nilai_gizi
   - ✅ kurasi_produk
   - ✅ pelatihan_pemberdayaan
   - ✅ peserta_pelatihan
   - ✅ admin_users
   - ✅ buku_tamu
   - ✅ activity_logs
   - ✅ website_content
   - ✅ recycle_bin

**Total: 14 tables harus ada**

---

## 🔧 **LANGKAH 4: UPDATE ENVIRONMENT VARIABLES**

### **4.1 Update .env.local**
Buka file `.env.local` di project Anda dan ganti:

```env
# Supabase Configuration
# GANTI DENGAN INFORMASI DARI SUPABASE PROJECT ANDA
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjk...

# Database Configuration (Optional)
DATABASE_URL=postgresql://postgres:your-password@db.abcdefghijklmnop.supabase.co:5432/postgres
```

**⚠️ GANTI:**
- `abcdefghijklmnop` dengan project ID Anda
- `your-password` dengan database password yang Anda buat
- API keys dengan yang Anda copy dari dashboard

---

## 🧪 **LANGKAH 5: TEST CONNECTION**

### **5.1 Test Connection**
Jalankan command berikut di terminal:

```powershell
node test-supabase-connection.js
```

**Output yang diharapkan:**
```
🧪 TESTING SUPABASE CONNECTION...
=====================================

1️⃣ Testing basic connection...
✅ Basic connection: SUCCESS

2️⃣ Testing public database access...
✅ Public DB access: SUCCESS
   Found 0 records

3️⃣ Testing admin database access...
✅ Admin DB access: SUCCESS
   Found 1 admin users

4️⃣ Testing website content access...
✅ Website content access: SUCCESS
   Found 7 content items

5️⃣ Testing dashboard statistics...
✅ Dashboard stats: SUCCESS
   IKM Binaan: 0
   HKI Merek: 0
   Sertifikat Halal: 0

🎉 CONNECTION TEST COMPLETED!
```

### **5.2 Jika Test Gagal**
Jika ada error, periksa:
1. **API Keys** sudah benar di `.env.local`
2. **Project URL** sudah benar
3. **Database schema** sudah dijalankan
4. **Internet connection** stabil

---

## 📊 **LANGKAH 6: MIGRATE DATA (OPSIONAL)**

### **6.1 Backup Data JSON**
```powershell
# Backup existing data
Copy-Item "data" "data-backup" -Recurse
```

### **6.2 Migrate ke Supabase**
```powershell
# Jalankan migration script
node scripts/migrate-to-supabase.js
```

**Output yang diharapkan:**
```
🚀 STARTING FULL DATA MIGRATION TO SUPABASE
=============================================

Starting migration for ikm_binaan...
✅ Migration completed for ikm_binaan: 150 records

Starting migration for hki_merek...
✅ Migration completed for hki_merek: 75 records

📊 MIGRATION SUMMARY
===================
Total tables processed: 9
Successful migrations: 9
Failed migrations: 0
Total records migrated: 500

🎉 MIGRATION COMPLETED SUCCESSFULLY!
```

---

## 🚀 **LANGKAH 7: UPDATE VERCEL ENVIRONMENT VARIABLES**

### **7.1 Buka Vercel Dashboard**
1. **Pergi ke**: https://vercel.com/dashboard
2. **Pilih project**: database-ikm-juara
3. **Klik Settings**
4. **Pilih Environment Variables**

### **7.2 Tambahkan Variables**
Tambahkan 3 environment variables berikut:

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://abcdefghijklmnop.supabase.co
Environment: Production, Preview, Development

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environment: Production, Preview, Development

Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environment: Production, Preview, Development
```

### **7.3 Redeploy**
Setelah menambahkan environment variables:
1. **Klik "Deployments"** tab
2. **Klik "..." pada deployment terbaru**
3. **Pilih "Redeploy"**

---

## ✅ **CHECKLIST SETUP LENGKAP**

- [ ] **Project Supabase** dibuat dengan nama `ikm-juara-database`
- [ ] **API Keys** sudah dicopy dan disimpan dengan aman
- [ ] **Database Schema** berhasil dijalankan (14 tables)
- [ ] **Environment Variables** sudah diupdate di `.env.local`
- [ ] **Connection Test** berhasil (✅ SUCCESS)
- [ ] **Data Migration** selesai (jika diperlukan)
- [ ] **Vercel Environment Variables** sudah diset
- [ ] **Website Admin** bisa akses database
- [ ] **Website Public** bisa load data
- [ ] **Redeploy Vercel** berhasil

---

## 🎉 **HASIL YANG DIHARAPAKAN**

Setelah setup berhasil, Anda akan memiliki:

### **✅ Database PostgreSQL:**
- 14 tables dengan relasi yang benar
- Row Level Security (RLS) aktif
- Indexes untuk performance optimal
- Auto-generated API endpoints

### **✅ Website Integration:**
- Admin website terhubung ke Supabase
- Public website bisa akses data real-time
- Search dan filter berfungsi dengan cepat
- Import/export Excel tetap berfungsi

### **✅ Production Ready:**
- Auto-backup daily
- Monitoring dan analytics
- Scalable untuk ribuan users
- SSL encryption

---

## 🚨 **TROUBLESHOOTING**

### **Problem: Connection Failed**
```
❌ Supabase connection failed: TypeError: fetch failed
```
**Solusi:**
- Cek internet connection
- Pastikan Project URL benar di `.env.local`
- Verifikasi API keys tidak ada spasi atau karakter tambahan

### **Problem: Schema Error**
```
❌ Error: relation "ikm_binaan" does not exist
```
**Solusi:**
- Jalankan ulang `supabase-schema.sql` di SQL Editor
- Pastikan semua query berhasil (tidak ada error merah)
- Refresh Table Editor untuk melihat tables

### **Problem: Permission Denied**
```
❌ Error: permission denied for table ikm_binaan
```
**Solusi:**
- Pastikan menggunakan `service_role` key untuk admin operations
- Cek RLS policies di Supabase Dashboard → Authentication → Policies
- Verifikasi API keys sudah benar

### **Problem: Migration Failed**
```
❌ Migration failed for ikm_binaan: duplicate key value
```
**Solusi:**
- Clear existing data di Supabase sebelum migration
- Atau comment out line clear data di migration script
- Jalankan migration per table secara manual

---

**Status**: Siap untuk implementasi  
**Estimasi Waktu**: 20-30 menit  
**Tingkat Kesulitan**: Mudah-Menengah  
**Support**: Dokumentasi lengkap tersedia