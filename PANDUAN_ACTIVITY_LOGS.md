# Panduan Penggunaan Activity Logs

## 🎯 Apa itu Activity Logs?

Activity Logs adalah fitur monitoring yang mencatat semua aktivitas di sistem Database IKM JUARA, termasuk:
- **Admin Activities**: Login, CRUD, Import/Export
- **Public Search**: Pencarian data oleh pengguna website publik

## 🚀 Cara Mengakses

1. **Login** sebagai admin di http://localhost:3000/admin
2. **Klik menu "Activity Logs"** di sidebar
3. **Dashboard** akan menampilkan statistik dan logs terbaru

## 📊 Memahami Dashboard

### Statistics Cards
- **Total Logs**: Jumlah semua aktivitas yang tercatat
- **Hari Ini**: Aktivitas dalam 24 jam terakhir
- **Minggu Ini**: Aktivitas dalam 7 hari terakhir
- **Admin Activity**: Total aktivitas admin
- **Public Search**: Total pencarian publik

### Filter Logs
- **Tipe Aktivitas**: 
  - Semua Tipe
  - Admin Activity (login, CRUD, import/export)
  - Public Search (pencarian data)
- **User**: Filter berdasarkan nama user
- **Limit**: Jumlah logs per halaman (50-500)

## 🔍 Jenis Aktivitas yang Dicatat

### Admin Activities
| Aktivitas | Keterangan |
|-----------|------------|
| 🔐 **Login** | Login berhasil/gagal |
| ➕ **Create** | Tambah data baru |
| ✏️ **Update** | Edit data existing |
| 🗑️ **Delete** | Hapus data |
| 📥 **Import** | Import Excel |
| 📤 **Export** | Export Excel/PDF |

### Public Search
| Aktivitas | Keterangan |
|-----------|------------|
| 🔍 **Search IKM** | Pencarian data IKM oleh publik |

## 📋 Membaca Log Entry

### Contoh Log Admin:
```
🔐 Login
User: admin_ikm
IP: 127.0.0.1
Timestamp: 21/01/2024 10:30:15
```

### Contoh Log Public Search:
```
🔍 Search IKM
Query: 1234567890123
Found: Yes
Result: Ahmad Rizki Pratama
IP: 192.168.1.100
Timestamp: 21/01/2024 10:35:22
```

## 📤 Export Logs

1. **Set Filter** sesuai kebutuhan (opsional)
2. **Klik "Export Excel"**
3. **File akan terdownload** otomatis
4. **Buka dengan Excel** untuk analisis lebih lanjut

### Format Export Excel:
- ID, Timestamp, Type, Action, User
- IP Address, Details, Success Status
- Sampai 1000 records per export

## 🔄 Navigasi dan Pagination

### Pagination Controls:
- **Previous/Next**: Navigasi halaman
- **Page Numbers**: Jump ke halaman specific
- **Current Page**: Highlighted dengan warna biru

### Refresh Data:
- **Auto-refresh**: Statistics update otomatis
- **Manual Refresh**: Klik tombol "Refresh"

## 💡 Tips Penggunaan

### Monitoring Keamanan
- **Cek login gagal** secara berkala
- **Monitor aktivitas di luar jam kerja**
- **Track perubahan data penting**

### Analisis Performa
- **Lihat pola penggunaan** harian/mingguan
- **Identifikasi fitur populer**
- **Monitor search success rate**

### Audit dan Compliance
- **Export logs berkala** untuk backup
- **Review aktivitas admin** secara rutin
- **Track data changes** untuk audit trail

## ⚠️ Hal Penting

### Keamanan
- **Hanya admin** yang bisa akses logs
- **Password tidak pernah** dicatat dalam logs
- **IP address dicatat** untuk security tracking

### Performance
- **Logs bertambah terus** seiring aktivitas
- **Export berkala** untuk mencegah file terlalu besar
- **Filter yang tepat** untuk performa optimal

## 🛠️ Troubleshooting

### Logs Tidak Muncul
- Refresh halaman dan coba lagi
- Periksa filter yang dipilih
- Pastikan ada aktivitas yang tercatat

### Export Tidak Berjalan
- Periksa koneksi internet
- Coba dengan filter yang lebih spesifik
- Refresh halaman dan coba lagi

### Statistics Tidak Update
- Tunggu beberapa detik untuk auto-refresh
- Klik tombol "Refresh" manual
- Reload halaman jika perlu

## 📞 Support

Jika mengalami masalah:
1. **Periksa dokumentasi** lengkap di `FITUR_ACTIVITY_LOGS.md`
2. **Cek console browser** untuk error messages
3. **Restart server** jika diperlukan
4. **Hubungi administrator** sistem

---

**Fitur Activity Logs membantu Anda:**
- 🔒 **Monitor keamanan** sistem
- 📊 **Analisis penggunaan** aplikasi  
- 📋 **Audit trail** untuk compliance
- 🔍 **Track perubahan** data penting

Gunakan fitur ini secara rutin untuk menjaga keamanan dan performa sistem Database IKM JUARA!