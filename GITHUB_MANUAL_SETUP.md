# 🔗 MANUAL GITHUB SETUP GUIDE

## 📋 LANGKAH-LANGKAH SETUP GITHUB

### **Step 1: Buat Repository di GitHub**

1. **Buka GitHub.com** dan login ke akun Anda
2. **Klik tombol "New"** atau "+" di pojok kanan atas
3. **Isi detail repository:**
   - **Repository name**: `database-ikm-juara`
   - **Description**: `Database IKM JUARA - Sistem Informasi Industri Kecil Menengah Kota Madiun`
   - **Visibility**: Public (atau Private sesuai kebutuhan)
   - **Initialize**: JANGAN centang "Add a README file" (karena sudah ada)
4. **Klik "Create repository"**

### **Step 2: Connect Local Repository ke GitHub**

Setelah repository dibuat, jalankan command berikut di terminal:

```bash
# Add remote origin (ganti USERNAME dengan username GitHub Anda)
git remote add origin https://github.com/USERNAME/database-ikm-juara.git

# Rename branch ke main (jika diperlukan)
git branch -M main

# Push ke GitHub
git push -u origin main
```

### **Step 3: Verifikasi Connection**

```bash
# Cek remote connection
git remote -v

# Cek status
git status
```

### **Step 4: Setup Vercel GitHub Integration**

1. **Login ke Vercel Dashboard**: https://vercel.com/dashboard
2. **Import Project**: Klik "Add New" → "Project"
3. **Connect GitHub**: Pilih repository `database-ikm-juara`
4. **Configure Build Settings**:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

### **Step 5: Environment Variables (Jika diperlukan)**

Di Vercel Dashboard → Project Settings → Environment Variables:

```
NODE_ENV=production
```

---

## 🎯 BENEFITS SETELAH GITHUB CONNECTION

### **Version Control:**
- ✅ Track semua perubahan code
- ✅ Rollback ke versi sebelumnya jika diperlukan
- ✅ Collaboration dengan team
- ✅ Backup otomatis di cloud

### **Deployment Integration:**
- ✅ Auto-deploy saat push ke GitHub
- ✅ Preview deployments untuk setiap commit
- ✅ Easy rollback melalui Vercel dashboard
- ✅ Branch-based deployments

### **Professional Development:**
- ✅ Issue tracking
- ✅ Pull requests untuk code review
- ✅ GitHub Actions untuk CI/CD
- ✅ Documentation dengan README

---

## 📝 NEXT STEPS AFTER GITHUB SETUP

1. **Test Auto-deployment**: Push perubahan dan lihat auto-deploy
2. **Setup Branch Protection**: Protect main branch
3. **Add Collaborators**: Invite team members
4. **Setup GitHub Actions**: Automated testing dan deployment
5. **Create Issues**: Track bugs dan feature requests

---

**Repository URL**: `https://github.com/USERNAME/database-ikm-juara`  
**Vercel Integration**: Auto-deploy on push  
**Status**: Ready for production