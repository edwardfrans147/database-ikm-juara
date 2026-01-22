# 🗄️ SUPABASE DATABASE SETUP LENGKAP

## 📋 LANGKAH-LANGKAH SETUP SUPABASE

### **Step 1: Buat Project Supabase**

1. **Buka Supabase Dashboard**: https://supabase.com/dashboard
2. **Login/Register** dengan akun GitHub atau email
3. **Klik "New Project"**
4. **Isi detail project:**
   - **Name**: `ikm-juara-database`
   - **Database Password**: Buat password yang kuat (simpan dengan aman!)
   - **Region**: Singapore (Southeast Asia)
   - **Pricing Plan**: Free tier (cukup untuk development)
5. **Klik "Create new project"**
6. **Tunggu 2-3 menit** hingga database siap

### **Step 2: Setup Database Schema**

1. **Buka SQL Editor** di Supabase Dashboard
2. **Copy-paste** isi file `supabase-schema.sql`
3. **Klik "Run"** untuk execute schema
4. **Verifikasi** semua table berhasil dibuat di tab "Table Editor"

### **Step 3: Get API Keys & URL**

Di Supabase Dashboard → Settings → API:

1. **Project URL**: `https://your-project-id.supabase.co`
2. **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (untuk admin operations)

### **Step 4: Install Supabase Client**

```bash
npm install @supabase/supabase-js
```

### **Step 5: Create Environment Variables**

Buat file `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database Configuration
DATABASE_URL=postgresql://postgres:your-password@db.your-project-id.supabase.co:5432/postgres
```

### **Step 6: Update Vercel Environment Variables**

Di Vercel Dashboard → Project → Settings → Environment Variables:

1. **NEXT_PUBLIC_SUPABASE_URL**: `https://your-project-id.supabase.co`
2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**: `your-anon-key`
3. **SUPABASE_SERVICE_ROLE_KEY**: `your-service-role-key`

---

## 🔧 INTEGRASI SUPABASE KE APLIKASI

### **Database Helper Functions**

```javascript
// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Client untuk public access
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client untuk admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
```

### **Migration dari JSON ke Supabase**

```javascript
// scripts/migrate-to-supabase.js
const fs = require('fs')
const { supabaseAdmin } = require('../lib/supabase')

async function migrateData() {
    // Migrate IKM Binaan
    const ikmData = JSON.parse(fs.readFileSync('data/ikm-binaan.json'))
    const { error } = await supabaseAdmin
        .from('ikm_binaan')
        .insert(ikmData)
    
    if (error) console.error('Migration error:', error)
    else console.log('IKM Binaan migrated successfully')
    
    // Migrate other tables...
}

migrateData()
```

---

## 📊 DATABASE SCHEMA OVERVIEW

### **Main Tables:**

1. **ikm_binaan** - Data IKM Binaan utama
2. **hki_merek** - Data HKI Merek
3. **sertifikat_halal** - Data Sertifikat Halal
4. **tkdn_ik** - Data TKDN IK
5. **siinas** - Data SIINas
6. **uji_nilai_gizi** - Data Uji Nilai Gizi
7. **kurasi_produk** - Data Kurasi Produk
8. **pelatihan_pemberdayaan** - Data Pelatihan
9. **peserta_pelatihan** - Junction table untuk peserta
10. **admin_users** - Data admin users
11. **buku_tamu** - Data guest login
12. **activity_logs** - Log aktivitas sistem
13. **website_content** - Konten website
14. **recycle_bin** - Data terhapus

### **Key Features:**

- ✅ **UUID Primary Keys** - Better for distributed systems
- ✅ **Foreign Key Relationships** - Data integrity
- ✅ **Indexes** - Optimized queries
- ✅ **Row Level Security** - Fine-grained access control
- ✅ **Triggers** - Auto-update timestamps
- ✅ **Policies** - Public read, admin write access

---

## 🚀 BENEFITS SUPABASE INTEGRATION

### **Performance:**
- ⚡ **PostgreSQL** - Much faster than JSON files
- ⚡ **Indexes** - Optimized search queries
- ⚡ **Connection Pooling** - Better concurrent access
- ⚡ **CDN** - Global edge locations

### **Scalability:**
- 📈 **Unlimited Records** - No file size limits
- 📈 **Concurrent Users** - Handle thousands of users
- 📈 **Real-time** - Live updates with subscriptions
- 📈 **Backup** - Automated daily backups

### **Security:**
- 🔒 **Row Level Security** - Fine-grained permissions
- 🔒 **API Keys** - Secure access control
- 🔒 **SSL** - Encrypted connections
- 🔒 **Audit Logs** - Track all database changes

### **Developer Experience:**
- 🛠️ **SQL Editor** - Direct database access
- 🛠️ **Auto API** - Generated REST & GraphQL APIs
- 🛠️ **Dashboard** - Visual data management
- 🛠️ **Migrations** - Version controlled schema changes

---

## 📝 MIGRATION CHECKLIST

### **Pre-Migration:**
- [ ] Create Supabase project
- [ ] Run schema migration
- [ ] Setup environment variables
- [ ] Install Supabase client
- [ ] Test database connection

### **Migration Process:**
- [ ] Backup existing JSON data
- [ ] Create migration scripts
- [ ] Migrate data table by table
- [ ] Verify data integrity
- [ ] Update application code

### **Post-Migration:**
- [ ] Test all CRUD operations
- [ ] Verify search functionality
- [ ] Test import/export features
- [ ] Update deployment configs
- [ ] Monitor performance

### **Rollback Plan:**
- [ ] Keep JSON files as backup
- [ ] Document rollback procedure
- [ ] Test rollback process
- [ ] Monitor for issues

---

## 🎯 NEXT STEPS

1. **Create Supabase Project** - Follow Step 1-3
2. **Setup Environment Variables** - Add to Vercel
3. **Install Dependencies** - Add Supabase client
4. **Update Application Code** - Replace JSON with Supabase calls
5. **Migrate Existing Data** - Run migration scripts
6. **Test Thoroughly** - Verify all features work
7. **Deploy** - Update production environment

---

**Supabase Dashboard**: https://supabase.com/dashboard  
**Documentation**: https://supabase.com/docs  
**Status**: Ready for migration  
**Estimated Migration Time**: 2-4 hours