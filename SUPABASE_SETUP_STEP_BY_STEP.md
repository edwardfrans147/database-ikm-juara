# 🗄️ SETUP SUPABASE - PANDUAN LANGKAH DEMI LANGKAH

## 📋 **LANGKAH 1: BUAT PROJECT SUPABASE**

### **1.1 Akses Supabase Dashboard**
1. **Buka browser** dan pergi ke: https://supabase.com/dashboard
2. **Login** dengan akun GitHub atau email
3. **Klik "New Project"**

### **1.2 Konfigurasi Project**
```
📝 Project Name: ikm-juara-database
📄 Organization: Pilih organization Anda
🔒 Database Password: Buat password yang kuat (SIMPAN INI!)
🌏 Region: Southeast Asia (Singapore) - ap-southeast-1
💰 Pricing Plan: Free tier
```

### **1.3 Tunggu Project Dibuat**
- ⏱️ **Waktu**: 2-3 menit
- ✅ **Status**: Tunggu hingga "Setting up project..." selesai

---

## 🔑 **LANGKAH 2: DAPATKAN API KEYS**

### **2.1 Buka Settings → API**
1. **Klik Settings** (ikon gear) di sidebar kiri
2. **Pilih "API"** dari menu

### **2.2 Copy Informasi Penting**
```
🔗 Project URL: https://[project-id].supabase.co
🔑 anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
🔐 service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ PENTING: SIMPAN SEMUA INFORMASI INI!**

---

## 🗃️ **LANGKAH 3: SETUP DATABASE SCHEMA**

### **3.1 Buka SQL Editor**
1. **Klik "SQL Editor"** di sidebar kiri
2. **Klik "New Query"**

### **3.2 Execute Schema**
1. **Copy seluruh isi** file `supabase-schema.sql`
2. **Paste** ke SQL Editor
3. **Klik "Run"** (atau Ctrl+Enter)
4. **Tunggu** hingga semua query selesai

### **3.3 Verifikasi Tables**
1. **Klik "Table Editor"** di sidebar kiri
2. **Pastikan** semua table berikut ada:
   - ✅ ikm_binaan
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

---

## 🔧 **LANGKAH 4: UPDATE ENVIRONMENT VARIABLES**

### **4.1 Update .env.local**
Ganti informasi di file `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]

# Database Configuration (Optional)
DATABASE_URL=postgresql://postgres:[your-password]@db.[your-project-id].supabase.co:5432/postgres
```

### **4.2 Update Vercel Environment Variables**
1. **Buka Vercel Dashboard**: https://vercel.com/dashboard
2. **Pilih project**: database-ikm-juara
3. **Settings → Environment Variables**
4. **Tambahkan variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

---

## 🧪 **LANGKAH 5: TEST CONNECTION**

### **5.1 Test Local Connection**
```powershell
# Test connection
node -e "
const { testConnection } = require('./lib/supabase.js');
testConnection().then(result => {
    console.log('Connection test:', result ? '✅ SUCCESS' : '❌ FAILED');
    process.exit(result ? 0 : 1);
});
"
```

### **5.2 Test dari Browser**
1. **Buka website** admin: http://localhost:3000/admin
2. **Login** dengan akun admin
3. **Cek** apakah data loading dengan benar

---

## 📊 **LANGKAH 6: MIGRATE DATA (OPSIONAL)**

### **6.1 Backup Data JSON**
```powershell
# Backup existing data
Copy-Item "data" "data-backup" -Recurse
```

### **6.2 Migrate ke Supabase**
```javascript
// Jalankan migration script (akan dibuat setelah setup selesai)
node scripts/migrate-to-supabase.js
```

---

## ✅ **CHECKLIST SETUP**

- [ ] **Project Supabase** dibuat dengan nama `ikm-juara-database`
- [ ] **API Keys** sudah dicopy dan disimpan
- [ ] **Database Schema** berhasil dijalankan (14 tables)
- [ ] **Environment Variables** sudah diupdate di `.env.local`
- [ ] **Vercel Environment Variables** sudah diset
- [ ] **Connection Test** berhasil (✅ SUCCESS)
- [ ] **Website Admin** bisa akses database
- [ ] **Website Public** bisa load data

---

## 🚨 **TROUBLESHOOTING**

### **Problem: Connection Failed**
```
❌ Supabase connection failed: Invalid API key
```
**Solusi:**
- Cek API key di `.env.local`
- Pastikan tidak ada spasi atau karakter tambahan
- Restart server setelah update environment variables

### **Problem: Schema Error**
```
❌ Error: relation "ikm_binaan" does not exist
```
**Solusi:**
- Jalankan ulang `supabase-schema.sql` di SQL Editor
- Pastikan semua query berhasil dieksekusi
- Cek di Table Editor apakah tables sudah ada

### **Problem: Permission Denied**
```
❌ Error: permission denied for table ikm_binaan
```
**Solusi:**
- Pastikan menggunakan `service_role` key untuk admin operations
- Cek RLS policies di Supabase Dashboard
- Verifikasi user authentication

---

## 🎯 **HASIL YANG DIHARAPKAN**

Setelah setup berhasil:

### **✅ Database Ready:**
- PostgreSQL database dengan 14 tables
- Row Level Security (RLS) aktif
- Indexes untuk performance optimal
- Triggers untuk auto-update timestamps

### **✅ API Ready:**
- Auto-generated REST API
- Real-time subscriptions
- Authentication & authorization
- File storage (jika diperlukan)

### **✅ Integration Ready:**
- Website admin terhubung ke Supabase
- Website public bisa akses data
- Auto-backup dan version control
- Monitoring dan analytics

---

**Status**: Siap untuk implementasi  
**Estimasi Waktu**: 15-30 menit  
**Tingkat Kesulitan**: Mudah-Menengah