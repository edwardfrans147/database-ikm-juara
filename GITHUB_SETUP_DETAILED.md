# 🔗 SETUP GITHUB - PANDUAN DETAIL STEP-BY-STEP

## 🎯 **TUJUAN**
Menghubungkan project Database IKM JUARA ke GitHub repository untuk:
- ✅ Version control dan backup otomatis
- ✅ Auto-deploy ke Vercel saat ada perubahan
- ✅ Collaboration dengan team
- ✅ Professional development workflow

---

## 📋 **LANGKAH 1: BUAT REPOSITORY DI GITHUB**

### **Step 1.1: Akses GitHub**
1. **Buka browser** (Chrome, Firefox, Edge, dll)
2. **Pergi ke:** `https://github.com`
3. **Login** dengan akun GitHub Anda
   - Jika belum punya akun: Klik "Sign up" dan buat akun baru

### **Step 1.2: Buat Repository Baru**
1. **Klik tombol hijau "New"** di sebelah kiri atas
   - Atau klik ikon "+" di pojok kanan atas → pilih "New repository"

2. **Isi Form Repository:**
   ```
   📝 Repository name: database-ikm-juara
   📄 Description: Database IKM JUARA - Sistem Informasi Industri Kecil Menengah Kota Madiun
   🔒 Visibility: Public (Recommended)
   ```

3. **PENTING - Jangan Centang Apapun:**
   - ❌ **JANGAN** centang "Add a README file"
   - ❌ **JANGAN** centang "Add .gitignore" 
   - ❌ **JANGAN** centang "Choose a license"
   
   > **Mengapa?** Karena kita sudah punya file-file ini di local

4. **Klik "Create repository"**

### **Step 1.3: Copy Repository URL**
Setelah repository dibuat, Anda akan melihat halaman seperti ini:

```
Quick setup — if you've done this kind of thing before

HTTPS: https://github.com/USERNAME/database-ikm-juara.git
```

**Copy URL tersebut!** (Ganti USERNAME dengan username GitHub Anda)

---

## 🔗 **LANGKAH 2: CONNECT LOCAL KE GITHUB**

### **Step 2.1: Buka Terminal/PowerShell**
1. **Buka PowerShell** di folder project Anda
2. **Pastikan** Anda berada di folder `D:\apkfixikmjuara`

### **Step 2.2: Update Remote URL**
```powershell
# Ganti USERNAME dengan username GitHub Anda yang sebenarnya
git remote set-url origin https://github.com/USERNAME/database-ikm-juara.git
```

**Contoh:**
```powershell
# Jika username GitHub Anda adalah "johndoe"
git remote set-url origin https://github.com/johndoe/database-ikm-juara.git
```

### **Step 2.3: Verifikasi Remote**
```powershell
git remote -v
```

**Output yang diharapkan:**
```
origin  https://github.com/USERNAME/database-ikm-juara.git (fetch)
origin  https://github.com/USERNAME/database-ikm-juara.git (push)
```

### **Step 2.4: Push ke GitHub**
```powershell
git push -u origin main
```

**Jika diminta login:**
- **Username:** Masukkan username GitHub Anda
- **Password:** Masukkan Personal Access Token (bukan password biasa)

> **Catatan:** GitHub tidak lagi menerima password biasa. Anda perlu Personal Access Token.

---

## 🔑 **LANGKAH 3: SETUP PERSONAL ACCESS TOKEN (Jika Diperlukan)**

### **Step 3.1: Buat Personal Access Token**
1. **Buka GitHub** → Settings (pojok kanan atas, klik foto profil)
2. **Scroll ke bawah** → klik "Developer settings"
3. **Klik "Personal access tokens"** → "Tokens (classic)"
4. **Klik "Generate new token"** → "Generate new token (classic)"

### **Step 3.2: Konfigurasi Token**
```
Note: Database IKM JUARA - Development
Expiration: 90 days (atau sesuai kebutuhan)

Scopes (centang yang diperlukan):
✅ repo (Full control of private repositories)
✅ workflow (Update GitHub Action workflows)
```

### **Step 3.3: Copy dan Simpan Token**
1. **Klik "Generate token"**
2. **Copy token** yang muncul (dimulai dengan `ghp_`)
3. **SIMPAN TOKEN INI** di tempat yang aman!
4. **Gunakan token ini** sebagai password saat git push

---

## ✅ **LANGKAH 4: VERIFIKASI SETUP**

### **Step 4.1: Cek Repository di GitHub**
1. **Refresh halaman** repository di GitHub
2. **Pastikan semua file** sudah ter-upload
3. **Cek commit history** - harus ada commit terbaru

### **Step 4.2: Test Auto-Deploy (Opsional)**
1. **Edit file README.md** di local
2. **Commit dan push:**
   ```powershell
   git add README.md
   git commit -m "test: Update README"
   git push origin main
   ```
3. **Cek Vercel Dashboard** - harus ada auto-deploy

---

## 🔧 **TROUBLESHOOTING**

### **Problem 1: Repository not found**
**Solusi:**
- Pastikan repository sudah dibuat di GitHub
- Cek URL remote dengan `git remote -v`
- Pastikan username dalam URL sudah benar

### **Problem 2: Authentication failed**
**Solusi:**
- Gunakan Personal Access Token, bukan password
- Pastikan token memiliki scope `repo`
- Cek username GitHub sudah benar

### **Problem 3: Permission denied**
**Solusi:**
- Pastikan Anda adalah owner repository
- Cek apakah repository adalah private dan Anda punya akses
- Gunakan HTTPS URL, bukan SSH (jika belum setup SSH)

### **Problem 4: Push rejected**
**Solusi:**
```powershell
# Pull latest changes first
git pull origin main --allow-unrelated-histories

# Then push
git push origin main
```

---

## 🎉 **HASIL YANG DIHARAPKAN**

Setelah setup berhasil, Anda akan memiliki:

### **✅ GitHub Repository:**
- Repository public di `https://github.com/USERNAME/database-ikm-juara`
- Semua file project ter-upload
- Commit history tersimpan
- README.md yang informatif

### **✅ Auto-Deploy Integration:**
- Vercel otomatis deploy saat ada push ke GitHub
- Preview deployments untuk setiap commit
- Easy rollback melalui Vercel dashboard

### **✅ Professional Workflow:**
- Version control untuk semua perubahan
- Backup otomatis di cloud
- Collaboration ready
- Issue tracking tersedia

---

## 📋 **CHECKLIST SETUP GITHUB**

- [ ] **Repository dibuat** di GitHub dengan nama `database-ikm-juara`
- [ ] **Remote URL** sudah diset dengan benar
- [ ] **Personal Access Token** dibuat (jika diperlukan)
- [ ] **Code berhasil di-push** ke GitHub
- [ ] **Repository terlihat** di GitHub dengan semua file
- [ ] **Vercel integration** working (auto-deploy)
- [ ] **README.md** updated dengan info repository

---

## 🚀 **LANGKAH SELANJUTNYA**

Setelah GitHub setup selesai:

1. **✅ Setup Supabase** - Database integration
2. **✅ Update Vercel** - Connect GitHub untuk auto-deploy
3. **✅ Team Collaboration** - Invite team members
4. **✅ Branch Protection** - Setup branch rules
5. **✅ GitHub Actions** - Automated testing (opsional)

---

**Estimasi Waktu:** 5-10 menit  
**Tingkat Kesulitan:** Mudah  
**Prerequisites:** Akun GitHub  
**Status:** ✅ BERHASIL TERHUBUNG - Repository aktif di https://github.com/edwardfrans147/database-ikm-juara