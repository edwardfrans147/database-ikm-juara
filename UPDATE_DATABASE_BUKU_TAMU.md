# 🔧 UPDATE DATABASE: BUKU TAMU SCHEMA

## 🎯 **MASALAH YANG DIPERBAIKI**
- Error: "Could not find the 'alamat' column of 'buku_tamu' in the schema cache"
- Tabel buku_tamu tidak memiliki kolom yang diperlukan untuk form buku tamu

## 📋 **KOLOM YANG DITAMBAHKAN**
- `nama_lengkap` VARCHAR(255) NOT NULL
- `no_hp_aktif` VARCHAR(20) NOT NULL  
- `alamat` TEXT
- `tanggal_kunjungan` TIMESTAMP WITH TIME ZONE DEFAULT NOW()

## 🚀 **CARA UPDATE DATABASE**

### **OPSI 1: Via Supabase Dashboard (RECOMMENDED)**
1. Buka: https://supabase.com/dashboard
2. Login dan pilih project Anda
3. Klik **"SQL Editor"** di sidebar kiri
4. Copy-paste isi file `supabase-update-buku-tamu.sql`
5. Klik **"Run"** untuk execute

### **OPSI 2: Via psql Command Line**
```bash
# Connect to Supabase database
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres"

# Run the update script
\i supabase-update-buku-tamu.sql
```

### **OPSI 3: Copy-Paste Manual**
Jika tidak bisa akses file, copy-paste SQL berikut ke Supabase SQL Editor:

```sql
-- UPDATE BUKU TAMU TABLE SCHEMA
ALTER TABLE buku_tamu 
ADD COLUMN IF NOT EXISTS nama_lengkap VARCHAR(255),
ADD COLUMN IF NOT EXISTS no_hp_aktif VARCHAR(20),
ADD COLUMN IF NOT EXISTS alamat TEXT,
ADD COLUMN IF NOT EXISTS tanggal_kunjungan TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing data if any
UPDATE buku_tamu 
SET 
    nama_lengkap = COALESCE(nama_lengkap, nama),
    no_hp_aktif = COALESCE(no_hp_aktif, nik),
    tanggal_kunjungan = COALESCE(tanggal_kunjungan, waktu_akses)
WHERE nama_lengkap IS NULL OR no_hp_aktif IS NULL OR tanggal_kunjungan IS NULL;

-- Make new columns NOT NULL
ALTER TABLE buku_tamu 
ALTER COLUMN nama_lengkap SET NOT NULL,
ALTER COLUMN no_hp_aktif SET NOT NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_buku_tamu_tanggal ON buku_tamu(tanggal_kunjungan);
CREATE INDEX IF NOT EXISTS idx_buku_tamu_nama ON buku_tamu(nama_lengkap);

-- Update RLS policies
DROP POLICY IF EXISTS "Public insert access for buku_tamu" ON buku_tamu;
CREATE POLICY "Public insert access for buku_tamu" ON buku_tamu FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read access for buku_tamu" ON buku_tamu FOR SELECT USING (auth.role() = 'authenticated');
```

## ✅ **VERIFIKASI UPDATE**

Setelah menjalankan update, verifikasi dengan query:
```sql
-- Cek struktur tabel
\d buku_tamu

-- Cek apakah kolom baru ada
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'buku_tamu';
```

Expected output harus menunjukkan kolom:
- nama_lengkap (varchar, NOT NULL)
- no_hp_aktif (varchar, NOT NULL)  
- alamat (text, nullable)
- tanggal_kunjungan (timestamp with time zone)

## 🧪 **TEST SETELAH UPDATE**

Setelah database di-update, test API:
```bash
node test-buku-tamu-direct.js
```

Expected result:
- ✅ Status 200 (bukan 500)
- ✅ Response: `{"success": true, "message": "Buku tamu berhasil disimpan"}`

## 📊 **TIMELINE**
1. **Update database** (2 menit)
2. **Commit & push code** (1 menit)  
3. **Wait for deployment** (2 menit)
4. **Test website** (1 menit)
5. **Total**: 6 menit

## 🎯 **HASIL AKHIR**
Setelah update:
- ✅ Form buku tamu berfungsi normal
- ✅ Data tersimpan ke database
- ✅ Website redirect ke halaman utama
- ✅ No more "Gagal menyimpan buku tamu" error

**Status**: CRITICAL - Database schema harus di-update dulu
**Priority**: HIGH - Website tidak functional tanpa ini