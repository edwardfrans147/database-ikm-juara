# Fitur Import Data dengan Deteksi Duplikat

## Deskripsi
Fitur ini memungkinkan import data IKM Binaan dari file Excel dengan deteksi otomatis data duplikat. Data yang tidak duplikat akan tetap berhasil diimpor, sedangkan data duplikat akan ditampilkan dalam popup hasil import.

## Fitur Utama

### 1. Deteksi Data Duplikat
- Sistem akan mendeteksi duplikat berdasarkan NIB dan NIK
- Data duplikat tidak akan diimpor ke database
- Data yang tidak duplikat tetap berhasil diimpor

### 2. Popup Hasil Import
- Menampilkan ringkasan hasil import
- Menampilkan daftar data yang berhasil diimpor
- Menampilkan daftar data duplikat dengan alasan penolakan
- Interface yang user-friendly dengan tabel yang dapat di-scroll

### 3. Validasi Data
- Validasi format NIB (13 digit)
- Validasi format NIK (16 digit)
- Validasi kelengkapan data wajib
- Validasi duplikat internal dalam file yang diimpor

## Implementasi Backend

### Endpoint: POST /api/import/ikm-binaan
```javascript
// Logika utama:
1. Validasi format file dan data
2. Deteksi duplikat dengan data existing
3. Pisahkan data valid dan duplikat
4. Import hanya data yang valid
5. Return hasil detail dengan data berhasil dan duplikat
```

### Response Format
```json
{
  "success": true,
  "message": "Import selesai: X data berhasil, Y data duplikat",
  "imported": 5,
  "duplicates": 2,
  "duplicateData": [
    {
      "row": 10,
      "data": { ... },
      "reason": "NIB 1234567890123 sudah terdaftar",
      "existingData": { ... }
    }
  ],
  "importedData": [
    { "id": 4, "nib": "...", ... }
  ]
}
```

## Implementasi Frontend

### Modal Import Result
- Modal popup yang menampilkan hasil import
- Tabel data berhasil diimpor (hijau)
- Tabel data duplikat (merah)
- Summary dengan warna sesuai status

### Fungsi JavaScript
```javascript
showImportResultModal(result) // Menampilkan popup hasil
hideImportResultModal()       // Menutup popup hasil
```

## Cara Penggunaan

1. **Upload File Excel**
   - Klik tombol "Import Excel"
   - Pilih file Excel dengan format template
   - Klik "Import"

2. **Lihat Hasil Import**
   - Popup akan muncul otomatis setelah import selesai
   - Lihat ringkasan di bagian atas
   - Scroll tabel untuk melihat detail data

3. **Interpretasi Hasil**
   - **Hijau**: Data berhasil diimpor
   - **Kuning**: Import selesai dengan peringatan (ada duplikat)
   - **Merah**: Semua data duplikat, tidak ada yang diimpor

## Validasi Data

### Format yang Diterima
- NIB: 13 digit angka
- NIK: 16 digit angka
- Nama Lengkap: Wajib diisi
- Alamat Lengkap: Wajib diisi
- Nama Usaha: Wajib diisi
- Nomor HP: Opsional

### Kriteria Duplikat
- NIB sudah ada dalam database
- NIK sudah ada dalam database
- Duplikat dalam file yang sama (internal)

## Error Handling

### Validasi Gagal
- Format file tidak sesuai
- Data tidak lengkap
- Format NIB/NIK salah
- Duplikat internal dalam file

### Import Berhasil Sebagian
- Beberapa data berhasil diimpor
- Beberapa data duplikat ditolak
- Popup menampilkan detail keduanya

### Import Gagal Total
- Semua data duplikat
- Tidak ada data yang diimpor
- Popup menampilkan semua data yang ditolak

## Keunggulan Fitur

1. **User Experience**
   - Tidak perlu mengulang import dari awal
   - Informasi detail tentang data yang berhasil/gagal
   - Interface yang jelas dan informatif

2. **Data Integrity**
   - Mencegah duplikasi data
   - Validasi format yang ketat
   - Backup data existing tetap aman

3. **Efisiensi**
   - Import data valid tetap berjalan meski ada duplikat
   - Tidak perlu membersihkan file secara manual
   - Proses import yang cepat dan reliable

## File yang Dimodifikasi

1. **server/app.js**
   - Endpoint import dengan deteksi duplikat
   - Response format yang diperluas

2. **admin/ikm-binaan.html**
   - Modal popup hasil import
   - Styling untuk tabel hasil
   - JavaScript handler untuk popup

## Testing

Untuk menguji fitur ini:
1. Buat file Excel dengan data campuran (baru dan duplikat)
2. Upload melalui interface import
3. Verifikasi popup menampilkan hasil yang benar
4. Cek database untuk memastikan hanya data valid yang tersimpan