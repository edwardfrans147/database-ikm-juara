# 🚨 MANUAL FIX: VERCEL ENVIRONMENT VARIABLES

## ❌ **MASALAH SAAT INI**
- Website menampilkan error: "Terjadi kesalahan saat menyimpan buku tamu"
- Build logs menunjukkan deprecated packages (tidak kritis)
- **PENYEBAB UTAMA**: Environment variables Supabase tidak ada di Vercel production

## 🎯 **SOLUSI MANUAL (5 MENIT)**

### **LANGKAH 1: Buka Vercel Dashboard**
1. Buka: https://vercel.com/dashboard
2. Login dengan akun Anda
3. Klik project: **apkfixikmjuara**

### **LANGKAH 2: Masuk ke Environment Variables**
1. Klik tab **"Settings"** (di bagian atas)
2. Di sidebar kiri, klik **"Environment Variables"**

### **LANGKAH 3: Tambahkan 3 Variables**

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

### **LANGKAH 4: Save & Redeploy**
1. Klik **"Save"** untuk setiap variable
2. Setelah semua tersimpan, klik tab **"Deployments"**
3. Pada deployment terbaru, klik **"..."** → **"Redeploy"**
4. Tunggu 2-3 menit hingga selesai

## 🧪 **TESTING SETELAH FIX**

### **Test 1: API Health Check**
- URL: https://apkfixikmjuara.vercel.app/api/health
- Expected: `{"status":"OK","database":"Supabase"}`

### **Test 2: Buku Tamu**
- URL: https://apkfixikmjuara.vercel.app/login.html
- Isi form dengan data test
- Klik "Akses Data"
- Harus berhasil tanpa error

### **Test 3: Dashboard Admin**
- URL: https://apkfixikmjuara.vercel.app/admin/
- Login dengan admin credentials
- Cek apakah data muncul

## ⚡ **ALTERNATIF: GUNAKAN SCRIPT OTOMATIS**
Jika Anda punya Vercel CLI terinstall:
```powershell
./fix-vercel-env-auto.ps1
```

## 📋 **CHECKLIST**
- [ ] Environment variables ditambahkan di Vercel
- [ ] Website di-redeploy
- [ ] API health check berhasil
- [ ] Buku tamu berfungsi
- [ ] Dashboard admin menampilkan data

**Status**: CRITICAL - Website tidak functional tanpa fix ini
**Estimasi**: 5 menit manual, 2 menit dengan script