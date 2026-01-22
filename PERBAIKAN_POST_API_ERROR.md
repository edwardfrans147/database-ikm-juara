# Perbaikan Error POST API Website Content

## Masalah yang Diidentifikasi

Dari console browser terlihat error:
- **"Unexpected token '<', '<!DOCTYPE '... is not valid JSON"**
- **"Failed to load resource: the server responded with a status of 404 (Not Found)"**

Ini menunjukkan bahwa:
1. Server mengembalikan HTML (halaman error) bukan JSON
2. Route POST `/api/website-content` tidak ditemukan atau tidak berfungsi

## Penyebab dan Solusi

### 1. Body Parser Configuration
**Masalah**: Body parser mungkin tidak menghandle JSON dengan benar
**Solusi**: ✅ Menambahkan konfigurasi body parser yang lebih eksplisit

```javascript
// SEBELUM
app.use(bodyParser.json());

// SESUDAH - DIPERBAIKI
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
```

### 2. Request Logging
**Masalah**: Tidak ada visibility tentang request yang masuk ke server
**Solusi**: ✅ Menambahkan middleware logging untuk debugging

```javascript
// Debug middleware - log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.method === 'POST' && req.url.includes('/api/')) {
        console.log('Request body:', req.body);
    }
    next();
});
```

### 3. Route Registration Order
**Masalah**: Kemungkinan ada masalah dengan urutan middleware
**Solusi**: ✅ Memastikan API routes didefinisikan setelah body parser

## Langkah Perbaikan

### 1. WAJIB: Restart Server
```bash
# Stop server yang sedang berjalan (Ctrl+C di terminal)
# Start server lagi:
cd server
node app.js
```

### 2. Test Manual API
Setelah restart, test di browser:
```
GET: http://localhost:3000/api/website-content
```
Seharusnya mengembalikan JSON data.

### 3. Monitor Server Console
Setelah restart, server console seharusnya menampilkan:
```
Server berjalan di http://localhost:3000
Admin: http://localhost:3000/admin
Public: http://localhost:3000/public
```

### 4. Test dari Browser
1. Buka halaman edit redaksi
2. Buka Console (F12)
3. Coba tambah konten baru
4. Lihat log di server console

## Yang Seharusnya Muncul di Server Console

### Saat Halaman Dibuka:
```
2026-01-22T06:20:00.000Z - GET /admin/edit-redaksi.html
2026-01-22T06:20:00.001Z - GET /api/website-content
```

### Saat Submit Form:
```
2026-01-22T06:20:10.000Z - POST /api/website-content
Request body: {
  section: "pelatihan",
  title: "Test Pelatihan", 
  description: "Test deskripsi",
  contact: "081234567890",
  link: "https://example.com"
}
POST /api/website-content called with body: { section: "pelatihan", ... }
Generated new ID: pelatihan-1737523210000
Content saved successfully
```

## Jika Masih Error

### 1. Periksa Server Console
Lihat apakah ada error saat server start:
```bash
cd server
node app.js
```

Jika ada error, akan muncul pesan error yang spesifik.

### 2. Test API Manual dengan curl/Postman
```bash
# Test GET
curl http://localhost:3000/api/website-content

# Test POST (di PowerShell)
$body = @{
    section = "pelatihan"
    title = "Test Manual"
    description = "Test deskripsi manual"
    contact = "081234567890"
    link = "https://example.com"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/website-content" -Method POST -ContentType "application/json" -Body $body
```

### 3. Periksa Port
Pastikan tidak ada aplikasi lain yang menggunakan port 3000:
```bash
netstat -ano | findstr :3000
```

### 4. Periksa File Permissions
Pastikan file `data/website-content.json` bisa dibaca dan ditulis:
```bash
# Periksa apakah file ada
dir data\website-content.json

# Periksa isi file
type data\website-content.json
```

## Error Messages dan Solusi

### "Cannot POST /api/website-content"
- **Penyebab**: Route POST tidak terdaftar atau ada error syntax
- **Solusi**: Restart server, periksa console untuk error

### "Unexpected token '<'"
- **Penyebab**: Server mengembalikan HTML bukan JSON
- **Solusi**: Periksa apakah API endpoint benar-benar dipanggil

### "404 Not Found"
- **Penyebab**: Route tidak ditemukan
- **Solusi**: Periksa URL dan method yang digunakan

### "500 Internal Server Error"
- **Penyebab**: Error di server saat memproses request
- **Solusi**: Periksa server console untuk detail error

## Kode yang Diperbaiki

### server/app.js - Middleware Section
```javascript
// Middleware - DIPERBAIKI
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Debug middleware - log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.method === 'POST' && req.url.includes('/api/')) {
        console.log('Request body:', req.body);
    }
    next();
});

app.use(express.static('shared'));
```

## Hasil yang Diharapkan

Setelah perbaikan dan restart server:

### 1. Server Console
```
Server berjalan di http://localhost:3000
Admin: http://localhost:3000/admin
Public: http://localhost:3000/public
```

### 2. Test GET API
Browser: `http://localhost:3000/api/website-content`
Response: JSON data dengan status 200

### 3. Test POST dari Form
- Form bisa disubmit tanpa error
- Muncul popup hijau "Konten baru berhasil ditambahkan"
- Konten baru muncul di daftar

### 4. Server Logs
```
2026-01-22T06:20:10.000Z - POST /api/website-content
Request body: { section: "pelatihan", title: "...", ... }
POST /api/website-content called with body: { ... }
Content saved successfully
```

## Checklist Troubleshooting

- [ ] Server di-restart setelah perubahan
- [ ] Server console tidak menampilkan error saat startup
- [ ] GET `/api/website-content` mengembalikan JSON
- [ ] Server console menampilkan log request
- [ ] Browser console tidak menampilkan network error
- [ ] File `data/website-content.json` ada dan valid

## Kontak Support

Jika masih bermasalah setelah restart server:
1. Screenshot server console saat startup
2. Screenshot browser console saat error
3. Test manual API dengan curl/Postman
4. Periksa apakah ada aplikasi lain di port 3000