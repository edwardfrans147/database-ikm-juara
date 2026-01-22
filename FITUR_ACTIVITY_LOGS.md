# Fitur Activity Logs - Database IKM JUARA

## 📋 Deskripsi

Fitur Activity Logs adalah sistem monitoring dan audit yang mencatat semua aktivitas yang terjadi di dalam sistem Database IKM JUARA. Fitur ini mencatat aktivitas dari 2 website:

1. **Website Admin** (localhost:3000/admin) - Aktivitas admin dan pengelolaan data
2. **Website Publik** (localhost:3000/public) - Aktivitas penelusuran data oleh pengguna

## ✅ Fitur yang Diimplementasikan

### 1. **Admin Activity Logging**
Mencatat semua aktivitas admin meliputi:
- ✅ **Login/Logout** - Berhasil dan gagal
- ✅ **CRUD Operations** - Create, Read, Update, Delete data
- ✅ **Import Data** - Import Excel dengan detail jumlah data
- ✅ **Export Data** - Export Excel/PDF dengan detail
- ✅ **User Information** - Username, IP Address, User Agent

### 2. **Public Search Logging**
Mencatat aktivitas penelusuran di website publik:
- ✅ **Search Queries** - Query pencarian yang digunakan
- ✅ **Search Results** - Apakah data ditemukan atau tidak
- ✅ **Result Details** - Nama IKM yang ditemukan
- ✅ **User Information** - IP Address, User Agent

### 3. **Activity Logs Dashboard**
Interface admin untuk melihat dan mengelola logs:
- ✅ **Statistics Cards** - Total logs, hari ini, minggu ini, dll
- ✅ **Filter System** - Filter by type, user, limit
- ✅ **Pagination** - Navigasi halaman untuk logs banyak
- ✅ **Export Logs** - Export logs ke Excel
- ✅ **Real-time Updates** - Refresh otomatis

## 🎯 Jenis Aktivitas yang Dicatat

### Admin Activities (`admin_activity`)

| Action | Deskripsi | Data yang Dicatat |
|--------|-----------|-------------------|
| `login` | Login berhasil | Username, IP, User Agent, Role |
| `login_failed` | Login gagal | Username, IP, Alasan kegagalan |
| `create` | Tambah data baru | Data type, Item ID, Data lengkap |
| `update` | Edit data existing | Data type, Item ID, Data lama & baru |
| `delete` | Hapus data | Data type, Item ID, Data yang dihapus |
| `import_data` | Import Excel | Jumlah total, berhasil, duplikat |
| `export_data` | Export Excel/PDF | Data type, format, jumlah records |

### Public Search Activities (`public_search`)

| Action | Deskripsi | Data yang Dicatat |
|--------|-----------|-------------------|
| `search_ikm` | Pencarian IKM | Query, hasil found/not found, nama IKM |

## 🔧 Implementasi Teknis

### Backend (server/app.js)

#### 1. **Logging Functions**
```javascript
const logActivity = (activityData) => {
    // Menyimpan log ke data/activity-logs.json
    // Auto-generate ID dan timestamp
}

const logAdminActivity = (action, details) => {
    // Middleware untuk log admin activities
    // Capture user info dari headers
}
```

#### 2. **API Endpoints**
- `GET /api/activity-logs` - Get logs dengan filter dan pagination
- `GET /api/activity-logs/stats` - Statistik logs
- `GET /api/activity-logs/export` - Export logs ke Excel

#### 3. **Automatic Logging**
- Login/logout events
- CRUD operations pada semua data types
- Import/export operations
- Public search activities

### Frontend (admin/activity-logs.html)

#### 1. **Dashboard Components**
- **Statistics Cards** - Menampilkan ringkasan aktivitas
- **Filter Panel** - Filter by type, user, limit
- **Logs Display** - List logs dengan detail lengkap
- **Pagination** - Navigasi halaman

#### 2. **Real-time Features**
- Auto-refresh statistics
- Filter dan search real-time
- Export functionality

## 📊 Struktur Data Log

### Log Entry Format
```json
{
  "id": 1,
  "timestamp": "2024-01-21T10:30:00.000Z",
  "type": "admin_activity",
  "action": "login",
  "user": "admin_ikm",
  "details": {
    "userId": 2,
    "userName": "Administrator IKM",
    "role": "admin",
    "ip": "127.0.0.1",
    "userAgent": "Mozilla/5.0..."
  },
  "success": true
}
```

### Admin Activity Details
```json
{
  "dataType": "ikm-binaan",
  "itemId": 123,
  "method": "POST",
  "url": "/api/ikm-binaan",
  "ip": "127.0.0.1",
  "userAgent": "Mozilla/5.0...",
  "recordCount": 50,
  "importedCount": 45,
  "duplicateCount": 5
}
```

### Public Search Details
```json
{
  "query": "1234567890123",
  "found": true,
  "resultId": 1,
  "resultName": "Ahmad Rizki Pratama",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0..."
}
```

## 🚀 Cara Penggunaan

### 1. **Mengakses Activity Logs**
1. Login sebagai admin
2. Klik menu "Activity Logs" di sidebar
3. Dashboard akan menampilkan statistik dan logs terbaru

### 2. **Filter Logs**
1. Gunakan dropdown "Tipe Aktivitas":
   - **Semua Tipe** - Tampilkan semua logs
   - **Admin Activity** - Hanya aktivitas admin
   - **Public Search** - Hanya pencarian publik

2. Filter by User:
   - Ketik nama user untuk filter logs specific user

3. Set Limit:
   - Pilih jumlah logs per halaman (50, 100, 200, 500)

### 3. **Export Logs**
1. Set filter sesuai kebutuhan
2. Klik "Export Excel"
3. File akan terdownload otomatis

### 4. **Monitoring Real-time**
- Logs akan update otomatis saat ada aktivitas baru
- Refresh manual dengan tombol "Refresh"
- Statistics update real-time

## 📈 Statistik yang Tersedia

### Dashboard Statistics
- **Total Logs** - Jumlah total semua logs
- **Hari Ini** - Aktivitas hari ini
- **Minggu Ini** - Aktivitas 7 hari terakhir
- **Admin Activity** - Total aktivitas admin
- **Public Search** - Total pencarian publik

### Detailed Analytics
- Breakdown by action type
- User activity patterns
- Peak usage times
- Search success rates

## 🔐 Keamanan dan Privacy

### Data Protection
- **IP Address Logging** - Untuk tracking dan security
- **User Agent Logging** - Untuk device/browser identification
- **Sensitive Data** - Password tidak pernah di-log
- **Data Retention** - Logs disimpan untuk audit trail

### Access Control
- **Admin Only** - Hanya admin yang bisa akses logs
- **Role-based** - Different access levels untuk different roles
- **Audit Trail** - Logs tidak bisa diedit atau dihapus

## 📋 Contoh Use Cases

### 1. **Security Monitoring**
- Monitor login attempts yang gagal
- Track aktivitas user yang mencurigakan
- Audit trail untuk compliance

### 2. **Performance Analysis**
- Analisis pola penggunaan sistem
- Identifikasi fitur yang paling sering digunakan
- Optimasi berdasarkan usage patterns

### 3. **Data Management**
- Track perubahan data penting
- Monitor import/export activities
- Backup dan recovery planning

### 4. **User Behavior**
- Analisis pencarian publik
- Popular search queries
- Success rate pencarian

## 🛠️ File yang Dimodifikasi/Dibuat

### Backend Files
1. **server/app.js**
   - ✅ Logging functions dan middleware
   - ✅ Activity logs API endpoints
   - ✅ Integration dengan existing endpoints

2. **data/activity-logs.json**
   - ✅ Storage file untuk logs
   - ✅ JSON format untuk easy processing

### Frontend Files
3. **admin/activity-logs.html**
   - ✅ Dashboard interface lengkap
   - ✅ Statistics, filters, pagination
   - ✅ Export functionality

4. **shared/script.js**
   - ✅ Modified API requests untuk include user info
   - ✅ Header X-User untuk tracking

5. **admin/index.html**
   - ✅ Added Activity Logs menu item

## 🧪 Testing

### Test Scenarios

#### 1. **Admin Activity Logging**
```bash
# Test login logging
1. Login dengan akun admin → Check log entry
2. Login dengan kredensial salah → Check failed login log
3. Create new IKM data → Check create log
4. Update existing data → Check update log with old/new data
5. Delete data → Check delete log
6. Import Excel file → Check import log with counts
7. Export data → Check export log
```

#### 2. **Public Search Logging**
```bash
# Test search logging
1. Search dengan NIB valid → Check found=true log
2. Search dengan data tidak ada → Check found=false log
3. Search dengan nama partial → Check query log
```

#### 3. **Dashboard Functionality**
```bash
# Test dashboard features
1. Load statistics → Verify counts
2. Filter by admin_activity → Verify filtered results
3. Filter by user → Verify user-specific logs
4. Pagination → Verify page navigation
5. Export logs → Verify Excel download
```

## 📊 Performance Considerations

### Scalability
- **Log Rotation** - Implement log rotation untuk large datasets
- **Indexing** - Add indexing untuk faster queries
- **Archiving** - Archive old logs untuk performance

### Storage
- **File Size** - Monitor activity-logs.json size
- **Backup** - Regular backup logs untuk disaster recovery
- **Compression** - Compress old logs untuk save space

## 🔄 Future Enhancements

### Potential Improvements
1. **Real-time Notifications** - Alert untuk suspicious activities
2. **Advanced Analytics** - Charts dan graphs untuk trends
3. **Log Retention Policy** - Auto-delete old logs
4. **Database Integration** - Move from JSON to database
5. **API Rate Limiting** - Prevent log spam
6. **User Activity Heatmap** - Visual representation

### Integration Possibilities
- **Email Alerts** - Notify admin untuk critical events
- **Slack/Discord** - Integration dengan messaging platforms
- **External SIEM** - Integration dengan security tools

## ✅ Summary

Fitur Activity Logs berhasil diimplementasikan dengan lengkap:

- ✅ **Comprehensive Logging** - Admin dan public activities
- ✅ **Rich Dashboard** - Statistics, filters, export
- ✅ **Security Focus** - Audit trail dan monitoring
- ✅ **User-friendly Interface** - Easy to use dan navigate
- ✅ **Export Capability** - Excel export untuk reporting
- ✅ **Real-time Updates** - Live monitoring capabilities

Sistem ini memberikan visibility penuh terhadap semua aktivitas di Database IKM JUARA, mendukung audit, security monitoring, dan performance analysis.