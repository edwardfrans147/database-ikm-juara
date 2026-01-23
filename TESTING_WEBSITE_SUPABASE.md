# 🧪 TESTING WEBSITE DENGAN SUPABASE

## 🌐 **URL WEBSITE YANG SUDAH DEPLOY**

### **Website Public (Pengguna):**
- **Production**: https://apkfixikmjuara.vercel.app
- **Preview**: https://apkfixikmjuara-8h3mnpgeu-edwardfrans-projects.vercel.app

### **Website Admin:**
- **Production**: https://apkfixikmjuara.vercel.app/admin
- **Preview**: https://apkfixikmjuara-8h3mnpgeu-edwardfrans-projects.vercel.app/admin

---

## 🔍 **TESTING CHECKLIST**

### **1. TEST WEBSITE PUBLIC**

**✅ Yang Harus Dicek:**
- [ ] **Homepage loading** - Apakah halaman utama muncul?
- [ ] **Layanan IKM** - Apakah 6 layanan tampil (HKI Merek, Sertifikat Halal, dll)?
- [ ] **Program Pelatihan** - Apakah 3 program pelatihan tampil?
- [ ] **Fitur Pencarian** - Apakah bisa search IKM Binaan?
- [ ] **Data Loading** - Apakah data dari Supabase muncul?

**🔗 Test URLs:**
```
Homepage: https://apkfixikmjuara.vercel.app
Login Pengguna: https://apkfixikmjuara.vercel.app/login.html
```

### **2. TEST WEBSITE ADMIN**

**✅ Yang Harus Dicek:**
- [ ] **Login Page** - Apakah halaman login admin muncul?
- [ ] **Dashboard** - Apakah statistik dari Supabase tampil?
- [ ] **IKM Binaan List** - Apakah 7 data IKM tampil?
- [ ] **CRUD Operations** - Apakah bisa tambah/edit/hapus data?
- [ ] **API Connection** - Apakah API Supabase berfungsi?

**🔗 Test URLs:**
```
Admin Login: https://apkfixikmjuara.vercel.app/admin/login.html
Admin Dashboard: https://apkfixikmjuara.vercel.app/admin/index.html
IKM Binaan: https://apkfixikmjuara.vercel.app/admin/ikm-binaan.html
```

**🔑 Login Credentials:**
```
Username: BidIndustri08#
Password: [password yang sudah diset di admin_users table]
```

### **3. TEST API ENDPOINTS**

**🔗 API Test URLs:**
```
Dashboard Stats: https://apkfixikmjuara.vercel.app/api/dashboard
IKM Binaan Data: https://apkfixikmjuara.vercel.app/api/ikm-binaan
Website Content: https://apkfixikmjuara.vercel.app/api/website-content
Health Check: https://apkfixikmjuara.vercel.app/api/health
Search Test: https://apkfixikmjuara.vercel.app/api/search?query=Ahmad
```

---

## 📊 **EXPECTED RESULTS**

### **Dashboard API Response:**
```json
{
  "ikmBinaan": 7,
  "hkiMerek": 0,
  "sertifikatHalal": 0,
  "tkdnIk": 0,
  "siinas": 0,
  "ujiNilaiGizi": 0,
  "kurasiProduk": 0,
  "pelatihanPemberdayaan": 0,
  "totalPesertaPelatihan": 0,
  "lastUpdated": "2026-01-23T...",
  "cached": false
}
```

### **IKM Binaan API Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "nib": "1234567890123",
      "nama_lengkap": "Ahmad Rizki Pratama",
      "nama_usaha": "Keripik Singkong Rizki",
      "alamat_lengkap": "Jl. Merdeka No. 123...",
      "nomor_hp": "081234567891"
    }
    // ... 6 more records
  ]
}
```

### **Website Content API Response:**
```json
{
  "success": true,
  "data": [
    {
      "section": "layanan",
      "item_id": "hki-merek",
      "title": "📜 Pendaftaran HKI Merek",
      "description": "Fasilitasi pendaftaran...",
      "is_active": true
    }
    // ... 8 more records
  ]
}
```

---

## 🚨 **POSSIBLE ISSUES & SOLUTIONS**

### **Issue 1: Environment Variables Not Set**
**Symptoms:** API returns 500 error, "Missing Supabase credentials"
**Solution:** 
1. Check Vercel Dashboard → Settings → Environment Variables
2. Ensure all 3 Supabase variables are set
3. Redeploy if needed

### **Issue 2: Database Connection Failed**
**Symptoms:** "TypeError: fetch failed" in API responses
**Solution:**
1. Check Supabase project is running
2. Verify API keys are correct
3. Test connection in Supabase SQL Editor

### **Issue 3: No Data Showing**
**Symptoms:** Empty arrays in API responses
**Solution:**
1. Verify data was inserted in Supabase
2. Check RLS policies allow public read access
3. Test queries directly in Supabase

### **Issue 4: CORS Errors**
**Symptoms:** Browser console shows CORS errors
**Solution:**
1. Check API CORS configuration
2. Verify domain whitelist includes Vercel URLs

---

## 🎯 **TESTING STEPS**

### **Step 1: Quick API Test**
```bash
# Test if API is responding
curl https://apkfixikmjuara.vercel.app/api/health

# Expected: {"status":"OK","timestamp":"...","database":"Supabase","version":"2.0.0"}
```

### **Step 2: Data API Test**
```bash
# Test dashboard data
curl https://apkfixikmjuara.vercel.app/api/dashboard

# Expected: JSON with ikmBinaan: 7
```

### **Step 3: Frontend Test**
1. Open https://apkfixikmjuara.vercel.app
2. Check browser console for errors
3. Verify data loads on page

### **Step 4: Admin Test**
1. Open https://apkfixikmjuara.vercel.app/admin
2. Try to login
3. Check dashboard statistics

---

## 📋 **TESTING REPORT TEMPLATE**

```
🧪 TESTING RESULTS - [Date/Time]

✅ WEBSITE PUBLIC:
- Homepage: ✅/❌
- Layanan Display: ✅/❌ 
- Pelatihan Display: ✅/❌
- Search Function: ✅/❌

✅ WEBSITE ADMIN:
- Login Page: ✅/❌
- Dashboard Stats: ✅/❌
- IKM Binaan List: ✅/❌
- CRUD Operations: ✅/❌

✅ API ENDPOINTS:
- /api/health: ✅/❌
- /api/dashboard: ✅/❌
- /api/ikm-binaan: ✅/❌
- /api/website-content: ✅/❌

🚨 ISSUES FOUND:
- [List any issues here]

📊 DATA COUNTS:
- IKM Binaan: [number]
- Website Content: [number]
- Admin Users: [number]
```

---

**Status**: Ready for testing  
**Deployment**: ✅ Success  
**Database**: ✅ Connected  
**Next**: Manual testing and verification