# Panduan Penggunaan Edit Redaksi Website Pengguna

## Akses Menu Edit Redaksi

1. **Login ke Panel Admin**
   - Buka `http://localhost:3000/admin`
   - Masukkan username dan password admin
   - Klik "Login"

2. **Buka Menu Edit Redaksi**
   - Di sidebar kiri, klik menu "Edit Redaksi Website"
   - Halaman akan menampilkan dua section utama:
     - Layanan IKM Juara
     - Program Pelatihan Pemberdayaan Industri

## Menambah Layanan IKM Juara Baru

### Langkah-langkah:
1. **Klik Tombol Tambah**
   - Klik tombol hijau "Tambah Layanan Baru" di section Layanan IKM Juara
   - Form tambah layanan akan muncul

2. **Isi Form Layanan**
   - **Nama Layanan**: Masukkan nama layanan (contoh: "Pendaftaran Sertifikat ISO")
   - **Deskripsi Layanan**: Jelaskan detail layanan, syarat, dan prosedur
   - **Kontak yang Bisa Dihubungi**: Masukkan informasi kontak (contoh: "WhatsApp: 081234567890, Email: iso@disnakerukm-madiun.go.id")
   - **Link Informasi/Pendaftaran**: Masukkan URL jika ada (opsional)

3. **Simpan Layanan**
   - Klik tombol "Simpan Layanan"
   - Sistem akan menampilkan notifikasi sukses
   - Layanan baru akan muncul di daftar
   - Perubahan otomatis tersinkron ke website pengguna

### Contoh Input Layanan:
```
Nama Layanan: 📋 Pendaftaran Sertifikat ISO 9001
Deskripsi: Fasilitasi pendaftaran sertifikat ISO 9001 untuk meningkatkan kualitas manajemen IKM. Syarat: KTP, NIB, Dokumen SOP perusahaan, Struktur organisasi
Kontak: WhatsApp: 081234567890, Email: iso@disnakerukm-madiun.go.id, Telp: (0351) 123456
Link: https://iso.kemenperin.go.id/pendaftaran
```

## Menambah Program Pelatihan Baru

### Langkah-langkah:
1. **Klik Tombol Tambah**
   - Klik tombol hijau "Tambah Program Pelatihan Baru" di section Program Pelatihan
   - Form tambah program akan muncul

2. **Isi Form Program Pelatihan**
   - **Nama Kegiatan Pelatihan**: Masukkan nama program pelatihan
   - **Deskripsi Kegiatan**: Jelaskan tujuan, materi, dan manfaat pelatihan
   - **Kontak Pendaftaran/Informasi**: Informasi untuk mendaftar atau bertanya
   - **Link Pendaftaran Pelatihan**: URL form pendaftaran online

3. **Simpan Program**
   - Klik tombol "Simpan Program Pelatihan"
   - Sistem akan menampilkan notifikasi sukses
   - Program baru akan muncul di daftar
   - Perubahan otomatis tersinkron ke website pengguna

### Contoh Input Program Pelatihan:
```
Nama Kegiatan: 🎯 Workshop Digital Marketing untuk IKM
Deskripsi: Pelatihan intensif 3 hari tentang strategi pemasaran digital, social media marketing, dan e-commerce untuk meningkatkan penjualan produk IKM. Materi: SEO, Google Ads, Facebook Marketing, Instagram Business, Marketplace
Kontak: WhatsApp: 081234567895, Email: pelatihan@disnakerukm-madiun.go.id, Telp: (0351) 123457
Link: https://forms.google.com/daftar-workshop-digital-marketing
```

## Mengedit Konten yang Sudah Ada

### Langkah-langkah:
1. **Klik Tombol Edit**
   - Pada konten yang ingin diedit, klik tombol kuning "Edit"
   - Form edit akan muncul di bawah konten

2. **Ubah Informasi**
   - Modifikasi field yang diperlukan
   - Semua field dapat diubah (judul, deskripsi, kontak, link)

3. **Simpan Perubahan**
   - Klik tombol "Simpan"
   - Klik "Batal" jika ingin membatalkan perubahan

## Menghapus Konten

### Langkah-langkah:
1. **Klik Tombol Hapus**
   - Pada konten yang ingin dihapus, klik tombol merah "Hapus"
   - Sistem akan menampilkan konfirmasi

2. **Konfirmasi Penghapusan**
   - Klik "OK" untuk menghapus
   - Klik "Cancel" untuk membatalkan

## Memantau Sinkronisasi

### Indikator Sinkronisasi:
- **Animasi Hijau**: Di pojok kanan atas terdapat indikator "Tersinkron dengan Website Pengguna"
- **Pulse Effect**: Animasi berkedip menunjukkan koneksi aktif
- **Notifikasi**: Setiap perubahan akan memicu animasi sinkronisasi

### Cara Memverifikasi:
1. Buka website pengguna di tab baru: `http://localhost:3000/public`
2. Scroll ke section "Layanan IKM Juara" dan "Program Pelatihan Pemberdayaan Industri"
3. Pastikan perubahan yang dibuat di admin sudah muncul

## Tips Penggunaan

### Format Kontak yang Disarankan:
```
WhatsApp: 081234567890
Email: layanan@disnakerukm-madiun.go.id
Telp: (0351) 123456
```

### Format Link yang Valid:
- Gunakan URL lengkap dengan https://
- Contoh: `https://forms.google.com/form-id`
- Contoh: `https://wa.me/6281234567890`

### Penulisan Deskripsi:
- Gunakan kalimat yang jelas dan informatif
- Sertakan syarat-syarat jika ada
- Jelaskan manfaat untuk IKM
- Gunakan emoji untuk mempercantik tampilan

## Troubleshooting

### Jika Form Tidak Muncul:
1. Refresh halaman
2. Pastikan JavaScript aktif di browser
3. Cek koneksi internet

### Jika Perubahan Tidak Tersimpan:
1. Pastikan semua field wajib terisi
2. Cek format URL jika mengisi link
3. Refresh halaman dan coba lagi

### Jika Sinkronisasi Tidak Berfungsi:
1. Cek koneksi ke server
2. Refresh kedua halaman (admin dan pengguna)
3. Pastikan server berjalan normal

## Keamanan dan Backup

### Otomatis:
- Semua perubahan dicatat dalam activity logs
- Data di-backup sebelum perubahan
- Validasi input untuk mencegah error

### Manual:
- Backup file `data/website-content.json` secara berkala
- Catat perubahan penting dalam log terpisah

## Dukungan

Jika mengalami masalah atau butuh bantuan:
1. Cek file log di `data/activity-logs.json`
2. Hubungi administrator sistem
3. Dokumentasikan error yang terjadi untuk troubleshooting