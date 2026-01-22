# 📋 PANDUAN INPUT MANUAL DATA KE SUPABASE

## 🎯 **FILE-FILE YANG SUDAH DISIAPKAN**

Saya telah menyiapkan file-file berikut untuk input manual ke Supabase:

### **📄 FILE SQL (Untuk SQL Editor)**
1. **`supabase-data-insert.sql`** - Semua data dalam satu file
2. **`supabase-insert-ikm-binaan.sql`** - Data IKM Binaan (7 records)
3. **`supabase-insert-website-content.sql`** - Konten website (9 records)
4. **`supabase-insert-hki-merek.sql`** - Data HKI Merek (2 records)
5. **`supabase-insert-admin-user.sql`** - User admin default

### **📊 FILE CSV (Untuk Import)**
1. **`supabase-ikm-binaan.csv`** - Data IKM Binaan format CSV
2. **`supabase-website-content.csv`** - Konten website format CSV

---

## 🚀 **CARA INPUT DATA**

### **METODE 1: VIA SQL EDITOR (RECOMMENDED)**

**Langkah 1: Buka Supabase Dashboard**
1. Pergi ke https://supabase.com/dashboard
2. Pilih project `ikm-juara-database`
3. Klik **SQL Editor** di sidebar kiri

**Langkah 2: Input Data IKM Binaan**
1. Klik **"New Query"**
2. Copy seluruh isi file `supabase-insert-ikm-binaan.sql`
3. Paste ke SQL Editor
4. Klik **"Run"** atau tekan Ctrl+Enter
5. Verifikasi: Harus muncul "7 rows affected"

**Langkah 3: Input Website Content**
1. Buat query baru
2. Copy isi file `supabase-insert-website-content.sql`
3. Paste dan Run
4. Verifikasi: Harus muncul "9 rows affected"

**Langkah 4: Input Admin User**
1. Buat query baru
2. Copy isi file `supabase-insert-admin-user.sql`
3. Paste dan Run
4. Verifikasi: Harus muncul "1 row affected"

**Langkah 5: Input HKI Merek (Opsional)**
1. Buat query baru
2. Copy isi file `supabase-insert-hki-merek.sql`
3. **PENTING**: Ikuti instruksi di file untuk mendapatkan UUID yang benar
4. Paste dan Run setelah UUID diganti

### **METODE 2: VIA TABLE EDITOR (Manual)**

**Untuk IKM Binaan:**
1. Buka **Table Editor** → pilih table `ikm_binaan`
2. Klik **"Insert"** → **"Insert row"**
3. Isi data manual:
   ```
   NIB: 1234567890123
   NIK: 3518012345678901
   Nama Lengkap: Ahmad Rizki Pratama
   Alamat: Jl. Merdeka No. 123, Kelurahan Madiun Lor, Kecamatan Manguharjo, Kota Madiun
   Nama Usaha: Keripik Singkong Rizki
   Nomor HP: 081234567891
   ```
4. Klik **"Save"**
5. Ulangi untuk data lainnya

### **METODE 3: VIA CSV IMPORT**

**Langkah 1: Buka Table Editor**
1. Pilih table `ikm_binaan`
2. Klik **"Insert"** → **"Import data via spreadsheet"**

**Langkah 2: Upload CSV**
1. Upload file `supabase-ikm-binaan.csv`
2. Map columns dengan benar:
   - nib → nib
   - nik → nik
   - nama_lengkap → nama_lengkap
   - alamat_lengkap → alamat_lengkap
   - nama_usaha → nama_usaha
   - nomor_hp → nomor_hp
3. Klik **"Import"**

---

## ✅ **VERIFIKASI DATA**

Setelah input data, jalankan query ini untuk verifikasi:

```sql
-- Cek total records
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
FROM admin_users;

-- Cek data IKM Binaan
SELECT nib, nama_lengkap, nama_usaha FROM ikm_binaan ORDER BY nib;

-- Cek website content
SELECT section, item_id, title FROM website_content WHERE is_active = true;
```

**Expected Results:**
- ikm_binaan: 7 records
- website_content: 9 records  
- admin_users: 1 record

---

## 📊 **DATA YANG AKAN DIINPUT**

### **IKM Binaan (7 records):**
1. Ahmad Rizki Pratama - Keripik Singkong Rizki
2. Siti Nurhaliza Dewi - Batik Tulis Siti
3. Budi Santoso - Furniture Kayu Budi
4. Test User Baru 2 - Usaha Test Baru 2
5. Yanuar P - Keripik Pisang
6. Dewi Nurlaili - Siti Rhayau
7. Test User Baru 3 - Usaha Test Baru 3

### **Website Content (9 records):**
**Layanan:**
- Pendaftaran HKI Merek
- Pendaftaran Sertifikat Halal
- Pendaftaran TKDN IK
- Pendaftaran SIINas
- Pendaftaran Uji Nilai Gizi
- Kurasi Produk

**Pelatihan:**
- Program pelatihan (default)
- Workshop Digital Marketing
- Pelatihan Branding 2026

### **Admin User (1 record):**
- Username: BidIndustri08#
- Role: super_admin

---

## 🚨 **TROUBLESHOOTING**

### **Error: "duplicate key value violates unique constraint"**
**Solusi:** Data sudah ada, gunakan `ON CONFLICT DO NOTHING` atau hapus data existing terlebih dahulu.

### **Error: "relation does not exist"**
**Solusi:** Pastikan schema database sudah dijalankan dengan benar.

### **Error: "permission denied"**
**Solusi:** Pastikan menggunakan service_role key untuk admin operations.

---

## 🎯 **HASIL YANG DIHARAPKAN**

Setelah input manual selesai:

### **✅ Database Ready:**
- 7 IKM Binaan siap untuk pencarian
- 9 konten website untuk halaman public
- 1 admin user untuk login sistem
- Relasi antar table berfungsi dengan baik

### **✅ Website Functional:**
- Halaman public menampilkan layanan dan pelatihan
- Dashboard admin menampilkan statistik
- Fitur pencarian berfungsi
- CRUD operations ready

---

## ⏱️ **ESTIMASI WAKTU**

- **Metode SQL Editor**: 10-15 menit
- **Metode Table Editor**: 30-45 menit  
- **Metode CSV Import**: 15-20 menit

**Recommended:** Gunakan Metode SQL Editor untuk efisiensi maksimal.

---

**Status**: File siap untuk input manual  
**Total Records**: 17 records  
**Tingkat Kesulitan**: Mudah