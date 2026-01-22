# Troubleshooting Edit Redaksi Website

## Masalah: Konten Tidak Muncul di Halaman Edit Redaksi

### Gejala:
- Halaman edit redaksi hanya menampilkan tombol "Tambah Layanan Baru" dan "Tambah Program Pelatihan Baru"
- Konten layanan dan pelatihan yang sudah ada tidak muncul
- Area konten kosong

### Penyebab yang Sudah Diperbaiki:

#### 1. Fungsi loadWebsiteContent Tidak Terdefinisi
**Masalah**: Fungsi `loadWebsiteContent` dipanggil di `DOMContentLoaded` tapi tidak didefinisikan
**Solusi**: ✅ Menambahkan definisi fungsi `loadWebsiteContent`

#### 2. Script Konflik
**Masalah**: Ada `<script src="/script.js"></script>` yang menyebabkan konflik
**Solusi**: ✅ Menghapus script external dan menggunakan inline script

#### 3. Duplikasi Fungsi
**Masalah**: Fungsi `loadWebsiteContent` didefinisikan dua kali
**Solusi**: ✅ Menghapus duplikasi fungsi

#### 4. Error Handling Kurang
**Masalah**: Tidak ada logging untuk debugging
**Solusi**: ✅ Menambahkan console.log untuk debugging

### Langkah Debugging:

#### 1. Buka Browser Console
1. Buka halaman edit redaksi: `http://localhost:3000/admin/edit-redaksi.html`
2. Tekan F12 untuk membuka Developer Tools
3. Buka tab Console
4. Refresh halaman dan lihat log

#### 2. Periksa Console Output
Seharusnya muncul log seperti ini:
```
Loading website content...
Response status: 200
Loaded data: [array of content]
Layanan section: {section: "layanan-ikm", content: [...]}
Pelatihan section: {section: "pelatihan", content: [...]}
```

#### 3. Jika Ada Error
**Error 404**: API endpoint tidak ditemukan
- Pastikan server berjalan di port 3000
- Cek apakah file `server/app.js` memiliki endpoint `/api/website-content`

**Error 500**: Server error
- Cek apakah file `data/website-content.json` ada dan valid
- Cek console server untuk error message

**Network Error**: Koneksi gagal
- Pastikan server berjalan
- Cek apakah port 3000 tidak diblokir

### Cara Test Manual:

#### 1. Test API Endpoint
Buka di browser: `http://localhost:3000/api/website-content`
Seharusnya menampilkan JSON data seperti:
```json
[
  {
    "id": 1,
    "section": "layanan-ikm",
    "title": "Layanan IKM Juara",
    "content": [...]
  },
  {
    "id": 2,
    "section": "pelatihan", 
    "title": "Program Pelatihan Pemberdayaan Industri",
    "content": [...]
  }
]
```

#### 2. Test Data File
Pastikan file `data/website-content.json` ada dan berisi data yang benar.

#### 3. Test Server
Pastikan server berjalan dengan perintah:
```bash
cd server
node app.js
```

### Solusi Jika Masih Bermasalah:

#### 1. Restart Server
```bash
# Stop server (Ctrl+C)
# Start server again
cd server
node app.js
```

#### 2. Clear Browser Cache
- Tekan Ctrl+F5 untuk hard refresh
- Atau buka Developer Tools → Network → Disable cache

#### 3. Periksa File Permissions
Pastikan file `data/website-content.json` bisa dibaca oleh server

#### 4. Periksa Port
Pastikan tidak ada aplikasi lain yang menggunakan port 3000

### Kode yang Sudah Diperbaiki:

#### File: admin/edit-redaksi.html
```javascript
// Load website content - FIXED
const loadWebsiteContent = async () => {
    try {
        console.log('Loading website content...');
        const response = await fetch('/api/website-content');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Loaded data:', data);
        
        // Load layanan content
        const layananSection = data.find(section => section.section === 'layanan-ikm');
        console.log('Layanan section:', layananSection);
        if (layananSection) {
            renderLayananContent(layananSection.content);
        }
        
        // Load pelatihan content
        const pelatihanSection = data.find(section => section.section === 'pelatihan');
        console.log('Pelatihan section:', pelatihanSection);
        if (pelatihanSection) {
            renderPelatihanContent(pelatihanSection.content);
        }
    } catch (error) {
        console.error('Failed to load website content:', error);
        showAlert('Gagal memuat konten website: ' + error.message, 'error');
    }
};

// Load data on page load - FIXED
document.addEventListener('DOMContentLoaded', loadWebsiteContent);
```

### Hasil yang Diharapkan:

Setelah perbaikan, halaman edit redaksi seharusnya menampilkan:

#### Section Layanan IKM Juara:
- Tombol "Tambah Layanan Baru" (hijau)
- Daftar layanan existing dengan tombol Edit dan Hapus:
  - 📜 Pendaftaran HKI Merek
  - ✅ Pendaftaran Sertifikat Halal  
  - 🇮🇩 Pendaftaran TKDN IK
  - 💾 Pendaftaran dan Pendampingan SIINas
  - 🧪 Pendaftaran Uji Nilai Gizi
  - 🏆 Kurasi Produk

#### Section Program Pelatihan:
- Tombol "Tambah Program Pelatihan Baru" (hijau)
- Daftar program existing dengan tombol Edit dan Hapus:
  - 📚 Program pelatihan akan segera diumumkan

### Fitur yang Harus Berfungsi:

1. ✅ **Load Content**: Konten muncul saat halaman dibuka
2. ✅ **Edit Existing**: Klik Edit → Form muncul → Edit → Simpan
3. ✅ **Add New**: Klik Tambah → Form muncul → Isi → Simpan  
4. ✅ **Delete**: Klik Hapus → Konfirmasi → Hapus
5. ✅ **Sync Animation**: Animasi hijau berkedip saat ada perubahan

### Kontak Support:
Jika masih ada masalah, periksa:
1. Console browser untuk error JavaScript
2. Network tab untuk failed requests
3. Server console untuk backend errors
4. File permissions dan struktur folder