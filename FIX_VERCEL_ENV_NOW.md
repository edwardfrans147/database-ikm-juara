# 🚨 FIX ERROR: SET VERCEL ENVIRONMENT VARIABLES

## ❌ **ERROR YANG TERJADI**
"Terjadi kesalahan saat menyimpan buku tamu. Silakan coba lagi."

## 🔍 **PENYEBAB**
Environment variables Supabase belum diset di Vercel, sehingga API tidak bisa connect ke database.

## ✅ **SOLUSI CEPAT (5 MENIT)**

### **1. Buka Vercel Dashboard**
- URL: https://vercel.com/dashboard
- Login dengan akun Anda
- Pilih project: `apkfixikmjuara`

### **2. Masuk ke Settings**
- Klik **Settings** (tab di atas)
- Pilih **Environment Variables** (sidebar kiri)

### **3. Tambahkan 3 Variables Ini:**

**Variable 1:**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://krylvwwguczwwoyqghlc.supabase.co
Environment: ✅ Production ✅ Preview ✅ Development
```

**Variable 2:**
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeWx2d3dndWN6d3dveXFnaGxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNTg4NDEsImV4cCI6MjA4NDYzNDg0MX0.ikuvFZB4zjChsh-cM2MMMYYmWYTfC-P67gQZPBvCZqA
Environment: ✅ Production ✅ Preview ✅ Development
```

**Variable 3:**
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeWx2d3dndWN6d3dveXFnaGxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA1ODg0MSwiZXhwIjoyMDg0NjM0ODQxfQ.ysubAuDeIPshMww709q092yI37j1wZUIwK5vQttUsmE
Environment: ✅ Production ✅ Preview ✅ Development
```

### **4. Klik "Save" untuk setiap variable**

### **5. Redeploy (PENTING!)**
Setelah semua variables ditambahkan:
- Klik tab **Deployments**
- Klik **"..."** pada deployment terbaru
- Pilih **"Redeploy"**
- Tunggu hingga selesai (2-3 menit)

## 🧪 **TEST SETELAH FIX**

### **Test API:**
1. Buka: https://apkfixikmjuara.vercel.app/api/health
2. Harus return: `{"status":"OK","database":"Supabase"}`

### **Test Buku Tamu:**
1. Buka: https://apkfixikmjuara.vercel.app/login.html
2. Isi form dengan data test
3. Klik "Akses Data"
4. Harus berhasil tanpa error

## ⏱️ **ESTIMASI WAKTU**
- Set environment variables: 3 menit
- Redeploy: 2 menit
- Test: 1 menit
- **Total: 6 menit**

## 🎯 **HASIL YANG DIHARAPKAN**
Setelah fix:
- ✅ Buku tamu berfungsi normal
- ✅ Dashboard admin menampilkan data
- ✅ Search IKM Binaan berfungsi
- ✅ Semua API endpoints working

**Status**: CRITICAL FIX REQUIRED
**Priority**: HIGH - Website tidak functional tanpa ini