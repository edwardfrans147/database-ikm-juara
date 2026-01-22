# Panduan Penggunaan Fitur Import dengan Deteksi Duplikat

## Gambaran Umum
Fitur ini memungkinkan Anda mengimpor data IKM Binaan dari file Excel, dengan sistem yang secara otomatis mendeteksi dan menangani data duplikat. Data yang tidak duplikat akan tetap berhasil diimpor, sedangkan data duplikat akan ditampilkan dalam popup hasil untuk review.

## Langkah-langkah Penggunaan

### 1. Persiapan File Excel
- Gunakan template yang disediakan atau buat file dengan format yang sama
- Pastikan data dimulai dari baris ke-10 (setelah header dan petunjuk)
- Format kolom:
  - Kolom A: No. NIB (13 digit angka)
  - Kolom B: No. NIK (16 digit angka)  
  - Kolom C: Nama Lengkap
  - Kolom D: Alamat Lengkap
  - Kolom E: Nama Usaha
  - Kolom F: Nomor HP

### 2. Proses Import
1. Buka halaman "Data IKM Binaan"
2. Klik tombol "Import Excel"
3. Pilih file Excel (.xlsx) yang akan diimpor
4. Klik tombol "Import"
5. Tunggu proses import selesai

### 3. Melihat Hasil Import
Setelah proses import selesai, akan muncul popup "Hasil Import Data" yang menampilkan:

#### A. Ringkasan Hasil
- **Hijau (Berhasil)**: Semua data berhasil diimpor
- **Kuning (Peringatan)**: Sebagian data berhasil, sebagian duplikat
- **Merah (Gagal)**: Semua data duplikat, tidak ada yang diimpor

#### B. Tabel Data Berhasil Diimpor
- Menampilkan daftar data yang berhasil masuk ke database
- Informasi: No, NIB, NIK, Nama Lengkap, Nama Usaha
- Tabel dapat di-scroll jika data banyak

#### C. Tabel Data Duplikat
- Menampilkan daftar data yang ditolak karena duplikat
- Informasi: Baris, NIB, NIK, Nama Lengkap, Alasan penolakan
- Alasan bisa berupa "NIB sudah terdaftar" atau "NIK sudah terdaftar"

## Contoh Skenario Penggunaan

### Skenario 1: Import Berhasil Semua
```
File berisi: 5 data baru
Hasil: 5 data berhasil diimpor, 0 duplikat
Status: Hijau - "Import Berhasil"
```

### Skenario 2: Import Sebagian Berhasil
```
File berisi: 3 data baru + 2 data duplikat
Hasil: 3 data berhasil diimpor, 2 duplikat
Status: Kuning - "Import Selesai dengan Peringatan"
```

### Skenario 3: Import Gagal Total
```
File berisi: 5 data duplikat
Hasil: 0 data berhasil diimpor, 5 duplikat
Status: Merah - "Import Gagal"
```

## Validasi Data

### Format yang Harus Dipenuhi
1. **NIB**: Harus 13 digit angka (contoh: 1234567890123)
2. **NIK**: Harus 16 digit angka (contoh: 3518012345678901)
3. **Nama Lengkap**: Wajib diisi, tidak boleh kosong
4. **Alamat Lengkap**: Wajib diisi, tidak boleh kosong
5. **Nama Usaha**: Wajib diisi, tidak boleh kosong
6. **Nomor HP**: Opsional, boleh kosong

### Kriteria Duplikat
Data dianggap duplikat jika:
- NIB sudah ada dalam database
- NIK sudah ada dalam database
- Ada duplikat dalam file yang sama (internal)

## Pesan Error dan Solusi

### Error: "NIB harus 13 digit angka"
**Penyebab**: Format NIB tidak sesuai
**Solusi**: Pastikan NIB berisi tepat 13 digit angka tanpa spasi atau karakter lain

### Error: "NIK harus 16 digit angka"
**Penyebab**: Format NIK tidak sesuai
**Solusi**: Pastikan NIK berisi tepat 16 digit angka tanpa spasi atau karakter lain

### Error: "Data tidak lengkap"
**Penyebab**: Ada kolom wajib yang kosong
**Solusi**: Lengkapi semua kolom wajib (NIB, NIK, Nama Lengkap, Alamat, Nama Usaha)

### Error: "NIB/NIK sudah terdaftar"
**Penyebab**: Data duplikat dengan database existing
**Solusi**: Periksa data yang sudah ada, atau gunakan NIB/NIK yang berbeda

## Tips Penggunaan

### 1. Persiapan Data
- Gunakan template Excel yang disediakan
- Periksa format NIB dan NIK sebelum import
- Pastikan tidak ada data kosong di kolom wajib

### 2. Menangani Duplikat
- Review data duplikat di popup hasil
- Periksa apakah data memang sudah ada di database
- Jika perlu update data existing, gunakan fitur edit manual

### 3. Import Data Besar
- Untuk file dengan banyak data, proses mungkin memakan waktu
- Jangan tutup browser selama proses import
- Popup hasil akan menampilkan semua detail setelah selesai

### 4. Backup Data
- Sistem tidak akan menghapus data existing
- Data duplikat hanya tidak diimpor, tidak mempengaruhi data lama
- Data yang berhasil diimpor langsung tersimpan di database

## File Test
Untuk mencoba fitur ini, gunakan file `test-import-dengan-duplikat.xlsx` yang berisi:
- 3 data baru (akan berhasil diimpor)
- 2 data duplikat (akan ditolak)

File ini dapat digunakan untuk memahami cara kerja fitur deteksi duplikat.

## Troubleshooting

### Import Tidak Berjalan
1. Pastikan file format .xlsx
2. Periksa koneksi internet
3. Refresh halaman dan coba lagi

### Popup Tidak Muncul
1. Tunggu hingga proses import selesai
2. Periksa console browser untuk error
3. Pastikan JavaScript tidak diblokir

### Data Tidak Muncul di Tabel
1. Refresh halaman setelah import
2. Periksa apakah data benar-benar berhasil diimpor
3. Cek popup hasil untuk konfirmasi

## Dukungan
Jika mengalami masalah atau butuh bantuan, periksa:
1. Format file Excel sesuai template
2. Validasi data sesuai kriteria
3. Console browser untuk pesan error detail