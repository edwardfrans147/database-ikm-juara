# 🔗 PANDUAN LENGKAP INTEGRASI GITHUB & SUPABASE

## 📋 STATUS SAAT INI

### ✅ **Yang Sudah Selesai:**
- ✅ Aplikasi sudah di-deploy ke 2 website terpisah
- ✅ Optimisasi performa maksimal
- ✅ Git repository sudah diinisialisasi
- ✅ Supabase schema sudah dibuat
- ✅ Dependencies sudah ditambahkan

### ❌ **Yang Perlu Dilakukan:**
- ❌ Koneksi ke GitHub repository
- ❌ Setup Supabase project
- ❌ Migrasi data dari JSON ke Supabase
- ❌ Update kode untuk menggunakan Supabase

---

## 🔗 STEP 1: SETUP GITHUB CONNECTION

### **Manual Setup (Recommended):**

1. **Buat Repository di GitHub:**
   - Buka https://github.com/new
   - Repository name: `database-ikm-juara`
   - Description: `Database IKM JUARA - Sistem Informasi Industri Kecil Menengah Kota Madiun`
   - Public/Private: Pilih sesuai kebutuhan
   - **JANGAN** centang "Add a README file"
   - Klik "Create repository"

2. **Connect Local ke GitHub:**
   ```bash
   # Ganti USERNAME dengan username GitHub Anda
   git remote add origin https://github.com/USERNAME/database-ikm-juara.git
   git branch -M main
   git push -u origin main
   ```

3. **Verifikasi Connection:**
   ```bash
   git remote -v
   # Harus menampilkan origin dengan URL GitHub
   ```

### **Automated Setup:**
```bash
# Jalankan script setup (jika GitHub CLI tersedia)
.\setup-github.ps1
```

---

## 🗄️ STEP 2: SETUP SUPABASE DATABASE

### **1. Buat Supabase Project:**

1. **Buka Supabase Dashboard:** https://supabase.com/dashboard
2. **Login/Register** dengan akun GitHub
3. **Klik "New Project"**
4. **Isi detail:**
   - Name: `ikm-juara-database`
   - Database Password: **SIMPAN PASSWORD INI!**
   - Region: Singapore (Southeast Asia)
5. **Klik "Create new project"**
6. **Tunggu 2-3 menit** hingga ready

### **2. Setup Database Schema:**

1. **Buka SQL Editor** di Supabase Dashboard
2. **Copy semua isi file `supabase-schema.sql`**
3. **Paste ke SQL Editor**
4. **Klik "Run"**
5. **Verifikasi** di Table Editor - harus ada 14 tables

### **3. Get API Credentials:**

Di Supabase Dashboard → Settings → API:
- **Project URL**: `https://xxxxx.supabase.co`
- **anon key**: `eyJhbGciOiJIUzI1NiIs...`
- **service_role key**: `eyJhbGciOiJIUzI1NiIs...`

### **4. Setup Environment Variables:**

Buat file `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### **5. Update Vercel Environment Variables:**

Di Vercel Dashboard → Project Settings → Environment Variables:
1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. `SUPABASE_SERVICE_ROLE_KEY`

**Lakukan untuk KEDUA project (admin & public)!**

---

## 📊 STEP 3: MIGRASI DATA KE SUPABASE

### **1. Install Dependencies:**
```bash
npm install @supabase/supabase-js
```

### **2. Test Connection:**
```bash
node -e "
const { testConnection } = require('./lib/supabase.js');
testConnection().then(result => {
    console.log('Connection test:', result ? 'SUCCESS' : 'FAILED');
});
"
```

### **3. Migrate Existing Data:**

Buat script `migrate-data.js`:
```javascript
const fs = require('fs');
const { adminDB } = require('./lib/supabase.js');

async function migrateAllData() {
    try {
        // Migrate IKM Binaan
        const ikmData = JSON.parse(fs.readFileSync('data/ikm-binaan.json'));
        for (const ikm of ikmData) {
            await adminDB.create('ikm_binaan', {
                nib: ikm.nib,
                nik: ikm.nik,
                nama_lengkap: ikm.namaLengkap,
                alamat_lengkap: ikm.alamatLengkap,
                nama_usaha: ikm.namaUsaha,
                nomor_hp: ikm.nomorHP
            });
        }
        console.log('✅ IKM Binaan migrated');

        // Migrate other tables...
        // (Add similar code for other JSON files)
        
    } catch (error) {
        console.error('Migration error:', error);
    }
}

migrateAllData();
```

### **4. Run Migration:**
```bash
node migrate-data.js
```

---

## 🔄 STEP 4: UPDATE APPLICATION CODE

### **1. Update API Endpoints:**

Replace JSON file operations with Supabase calls:

```javascript
// Before (JSON)
const data = readData('ikm-binaan.json');

// After (Supabase)
const { adminDB } = require('./lib/supabase.js');
const data = await adminDB.getAll('ikm_binaan');
```

### **2. Update Dashboard API:**

```javascript
// api/index.js - Dashboard endpoint
app.get('/api/dashboard', async (req, res) => {
    try {
        const stats = await adminDB.getDashboardStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

### **3. Update Search API:**

```javascript
// Search IKM
app.post('/api/search-ikm', async (req, res) => {
    try {
        const { query } = req.body;
        const results = await publicDB.searchIKM(query);
        res.json({ found: results.length > 0, data: results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

---

## 🚀 STEP 5: DEPLOY UPDATED VERSION

### **1. Commit Changes:**
```bash
git add .
git commit -m "feat: Add Supabase integration and GitHub connection"
git push origin main
```

### **2. Deploy to Vercel:**
```bash
# Deploy admin website
Copy-Item "vercel-admin.json" "vercel.json" -Force
vercel --prod

# Deploy public website  
Copy-Item "vercel-public.json" "vercel.json" -Force
vercel --prod
```

### **3. Test Integration:**
- Test database connection
- Verify CRUD operations
- Check dashboard statistics
- Test search functionality

---

## 📊 BENEFITS SETELAH INTEGRASI

### **GitHub Integration:**
- ✅ **Version Control** - Track semua perubahan
- ✅ **Auto-deploy** - Deploy otomatis saat push
- ✅ **Collaboration** - Team development
- ✅ **Backup** - Code tersimpan di cloud
- ✅ **Issue Tracking** - Bug dan feature requests

### **Supabase Integration:**
- ✅ **Performance** - 10x lebih cepat dari JSON
- ✅ **Scalability** - Handle jutaan records
- ✅ **Real-time** - Live updates
- ✅ **Security** - Row-level security
- ✅ **Backup** - Automated daily backups
- ✅ **Analytics** - Built-in dashboard

---

## 🔧 TROUBLESHOOTING

### **GitHub Issues:**
- **Repository not found**: Pastikan repository sudah dibuat
- **Permission denied**: Check SSH keys atau gunakan HTTPS
- **Push rejected**: Pull latest changes first

### **Supabase Issues:**
- **Connection failed**: Check URL dan API keys
- **Migration failed**: Verify schema dan data format
- **RLS errors**: Check row-level security policies

### **Deployment Issues:**
- **Build failed**: Check environment variables
- **API errors**: Verify Supabase connection
- **Performance issues**: Check database indexes

---

## 📋 CHECKLIST LENGKAP

### **GitHub Setup:**
- [ ] Repository dibuat di GitHub
- [ ] Local repository connected
- [ ] Code pushed to GitHub
- [ ] Vercel connected to GitHub
- [ ] Auto-deploy working

### **Supabase Setup:**
- [ ] Supabase project created
- [ ] Database schema deployed
- [ ] API keys obtained
- [ ] Environment variables set
- [ ] Connection tested

### **Data Migration:**
- [ ] Supabase client installed
- [ ] Migration script created
- [ ] Data migrated successfully
- [ ] Data integrity verified
- [ ] JSON files backed up

### **Code Update:**
- [ ] API endpoints updated
- [ ] Database calls replaced
- [ ] Error handling added
- [ ] Testing completed
- [ ] Documentation updated

### **Deployment:**
- [ ] Environment variables set in Vercel
- [ ] Both websites deployed
- [ ] Database connection working
- [ ] All features tested
- [ ] Performance verified

---

## 🎯 NEXT STEPS

1. **Complete GitHub Setup** - Create repository dan connect
2. **Setup Supabase Project** - Follow Step 2 guide
3. **Migrate Data** - Run migration scripts
4. **Update Code** - Replace JSON with Supabase
5. **Test Thoroughly** - Verify all functionality
6. **Deploy** - Update production environment
7. **Monitor** - Check performance dan errors

---

**Estimated Time**: 2-4 hours  
**Difficulty**: Intermediate  
**Status**: Ready to implement  
**Priority**: High (for scalability)