# 🚨 SUPABASE TROUBLESHOOTING - SOLUSI ERROR

## ❌ **ERROR YANG TERJADI**

```
Error: failed to run sql query: ERROR: 42601: syntax error at or near "/" LINE 1: // Test
Supabase Connection Script ^
```

### **🔍 PENYEBAB:**
Anda mencoba menjalankan **JavaScript code** di **SQL Editor** Supabase. SQL Editor hanya menerima SQL queries, bukan JavaScript.

---

## ✅ **SOLUSI LANGKAH DEMI LANGKAH**

### **LANGKAH 1: SETUP DATABASE SCHEMA**

**Di SQL Editor Supabase:**
1. **Buka** SQL Editor di dashboard Supabase
2. **Klik** "New Query"
3. **Copy** seluruh isi file `supabase-schema.sql`
4. **Paste** ke SQL Editor
5. **Klik** "Run" atau tekan Ctrl+Enter

**File yang benar untuk SQL Editor:**
```sql
-- SUPABASE DATABASE SCHEMA FOR IKM JUARA
-- Migration script to create all necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create IKM Binaan table
CREATE TABLE ikm_binaan (
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
-- ... (lanjutan schema)
```

### **LANGKAH 2: TEST CONNECTION**

**Di Terminal/PowerShell Lokal (BUKAN SQL Editor):**
```powershell
# Pastikan environment variables sudah diset di .env.local
node test-supabase-connection.js
```

**Atau test di SQL Editor dengan query SQL:**
```sql
-- Test connection dengan SQL query
SELECT 'Connection successful!' as status, now() as timestamp;
```

### **LANGKAH 3: VERIFIKASI SETUP**

**Di SQL Editor Supabase:**
```sql
-- Check tables yang sudah dibuat
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

---

## 📋 **CHECKLIST PERBAIKAN**

### **✅ Yang Harus Dilakukan:**

1. **Setup Database Schema:**
   - [ ] Buka SQL Editor di Supabase Dashboard
   - [ ] Copy isi `supabase-schema.sql`
   - [ ] Paste dan Run di SQL Editor
   - [ ] Verifikasi 14 tables berhasil dibuat

2. **Update Environment Variables:**
   - [ ] Update `.env.local` dengan credentials Supabase
   - [ ] Pastikan Project URL benar
   - [ ] Pastikan API keys benar

3. **Test Connection:**
   - [ ] Jalankan `node test-supabase-connection.js` di terminal
   - [ ] JANGAN jalankan JavaScript di SQL Editor
   - [ ] Gunakan SQL queries untuk test di SQL Editor

### **❌ Yang JANGAN Dilakukan:**

- ❌ Jangan jalankan JavaScript di SQL Editor
- ❌ Jangan copy file `.js` ke SQL Editor
- ❌ Jangan gunakan `//` comments di SQL Editor

---

## 🔧 **LANGKAH PERBAIKAN CEPAT**

### **1. Bersihkan SQL Editor**
1. **Hapus** semua kode JavaScript dari SQL Editor
2. **Klik** "New Query" untuk mulai fresh

### **2. Jalankan Schema Database**
1. **Buka** file `supabase-schema.sql` di project
2. **Copy All** (Ctrl+A, Ctrl+C)
3. **Paste** di SQL Editor Supabase
4. **Run** (Ctrl+Enter)

### **3. Verifikasi Tables**
```sql
-- Jalankan query ini di SQL Editor untuk verifikasi
SELECT count(*) as total_tables 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

**Expected Result:** `total_tables: 14`

### **4. Test Connection dari Terminal**
```powershell
# Di terminal/PowerShell project (bukan SQL Editor)
node test-supabase-connection.js
```

---

## 🎯 **HASIL YANG DIHARAPKAN**

### **Setelah Schema Setup:**
```sql
-- Query ini harus berhasil di SQL Editor
SELECT 
    'ikm_binaan' as table_name,
    count(*) as records
FROM ikm_binaan;
```

### **Setelah Connection Test:**
```
🧪 TESTING SUPABASE CONNECTION...
=====================================

1️⃣ Testing basic connection...
✅ Basic connection: SUCCESS

2️⃣ Testing public database access...
✅ Public DB access: SUCCESS
   Found 0 records

🎉 CONNECTION TEST COMPLETED!
```

---

## 📞 **BANTUAN LEBIH LANJUT**

Jika masih ada masalah:

1. **Screenshot** error message yang muncul
2. **Pastikan** sudah ikuti langkah di `SUPABASE_SETUP_MANUAL.md`
3. **Cek** file `.env.local` sudah diupdate dengan benar
4. **Verifikasi** internet connection stabil

---

**File untuk SQL Editor:** `supabase-schema.sql`, `supabase-test-connection.sql`  
**File untuk Terminal:** `test-supabase-connection.js`, `scripts/migrate-to-supabase.js`  
**Status:** Siap untuk perbaikan