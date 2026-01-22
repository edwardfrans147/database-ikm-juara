# Testing Fitur Import dengan Deteksi Duplikat

## Langkah Testing

### 1. Persiapan
- Server sudah berjalan di http://localhost:3000
- File test `test-import-dengan-duplikat.xlsx` sudah tersedia
- Database memiliki 3 data existing dengan NIB/NIK tertentu

### 2. Data Test dalam File Excel
File `test-import-dengan-duplikat.xlsx` berisi:

**Data Baru (akan berhasil diimpor):**
- Baris 10: NIB 9876543210987, NIK 3518019876543210
- Baris 11: NIB 8765432109876, NIK 3518018765432109  
- Baris 14: NIB 7654321098765, NIK 3518017654321098

**Data Duplikat (akan ditolak):**
- Baris 12: NIB 1234567890123 (duplikat dengan data existing)
- Baris 13: NIK 3518012345678901 (duplikat dengan data existing)

### 3. Hasil yang Diharapkan
Setelah import:
- ✅ 3 data berhasil diimpor
- ❌ 2 data duplikat ditolak
- Popup hasil menampilkan detail kedua kategori

### 4. Cara Testing
1. Buka http://localhost:3000/admin/ikm-binaan.html
2. Login jika diperlukan
3. Klik tombol "Import Excel"
4. Upload file `test-import-dengan-duplikat.xlsx`
5. Klik "Import"
6. Tunggu popup hasil muncul
7. Verifikasi data dalam popup sesuai ekspektasi

### 5. Verifikasi Hasil
**Popup harus menampilkan:**
- Summary: "Import selesai dengan peringatan" (warna kuning)
- Tabel hijau: 3 data berhasil diimpor
- Tabel merah: 2 data duplikat dengan alasan penolakan

**Database harus berisi:**
- 6 data total (3 existing + 3 baru)
- Data duplikat tidak masuk ke database

### 6. Troubleshooting
Jika popup tidak muncul:
- Periksa console browser untuk error
- Pastikan server berjalan dengan benar
- Refresh halaman dan coba lagi

Jika masih menampilkan alert error:
- Periksa response dari server di Network tab
- Pastikan backend mengembalikan status 200 untuk import berhasil sebagian