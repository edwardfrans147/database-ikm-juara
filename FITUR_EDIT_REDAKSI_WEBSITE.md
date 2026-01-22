# Fitur Edit Redaksi Website Pengguna

## Deskripsi
Fitur ini memungkinkan admin untuk mengedit konten website pengguna secara real-time, termasuk menambahkan layanan IKM Juara dan Program Pelatihan Pemberdayaan Industri dengan informasi kontak dan link pendaftaran.

## Fitur Utama

### 1. Edit Konten Layanan IKM Juara
- **Tambah Layanan Baru**: Admin dapat menambahkan layanan baru dengan form yang mencakup:
  - Nama Layanan
  - Deskripsi Layanan
  - Kontak yang Bisa Dihubungi
  - Link Informasi/Pendaftaran (opsional)
- **Edit Layanan Existing**: Mengubah informasi layanan yang sudah ada
- **Hapus Layanan**: Menghapus layanan yang tidak diperlukan

### 2. Edit Konten Program Pelatihan
- **Tambah Program Pelatihan Baru**: Admin dapat menambahkan program pelatihan dengan:
  - Nama Kegiatan Pelatihan
  - Deskripsi Kegiatan
  - Kontak Pendaftaran/Informasi
  - Link Pendaftaran Pelatihan (bisa diklik)
- **Edit Program Existing**: Mengubah informasi program yang sudah ada
- **Hapus Program**: Menghapus program yang tidak diperlukan

### 3. Animasi Sinkronisasi
- **Indikator Sinkronisasi**: Animasi kelip-kelip hijau di pojok kanan atas kedua website
- **Signal Koneksi**: Menunjukkan bahwa website admin dan pengguna tersinkron
- **Animasi Pulse**: Efek visual yang menambah kesan website canggih

## Implementasi Teknis

### Frontend (Admin)
- **File**: `admin/edit-redaksi.html`
- **Fitur**:
  - Form tambah konten baru dengan validasi
  - Edit inline untuk konten existing
  - Tombol hapus dengan konfirmasi
  - Animasi sinkronisasi real-time

### Frontend (Pengguna)
- **File**: `public/index.html`
- **Fitur**:
  - Tampilan konten yang diperbarui secara otomatis
  - Link pendaftaran yang bisa diklik
  - Informasi kontak yang jelas
  - Animasi sinkronisasi

### Backend API
- **File**: `server/app.js`
- **Endpoints**:
  - `GET /api/website-content` - Mengambil konten website
  - `PUT /api/website-content` - Mengupdate konten existing
  - `POST /api/website-content` - Menambah konten baru
  - `DELETE /api/website-content` - Menghapus konten

### Data Storage
- **File**: `data/website-content.json`
- **Struktur**:
  ```json
  {
    "id": "unique-id",
    "title": "Nama Layanan/Program",
    "description": "Deskripsi lengkap",
    "contact": "Informasi kontak",
    "link": "URL pendaftaran (opsional)"
  }
  ```

## Cara Penggunaan

### Untuk Admin:
1. Login ke panel admin
2. Buka menu "Edit Redaksi Website"
3. Klik tombol "Tambah Layanan Baru" atau "Tambah Program Pelatihan Baru"
4. Isi form dengan informasi lengkap:
   - Nama kegiatan/layanan
   - Deskripsi detail
   - Kontak yang bisa dihubungi
   - Link pendaftaran (jika ada)
5. Klik "Simpan" untuk menyimpan
6. Perubahan akan langsung tersinkron ke website pengguna

### Untuk Pengguna:
1. Buka website publik
2. Lihat section "Layanan IKM Juara" dan "Program Pelatihan Pemberdayaan Industri"
3. Informasi kontak dan link pendaftaran akan ditampilkan
4. Klik link pendaftaran untuk mendaftar program/layanan

## Fitur Keamanan
- Validasi input untuk mencegah XSS
- Konfirmasi sebelum menghapus konten
- Activity logging untuk semua perubahan
- Authentication required untuk akses admin

## Responsive Design
- Form dan konten responsive untuk semua ukuran layar
- Animasi sinkronisasi menyesuaikan ukuran layar
- Mobile-friendly interface

## Manfaat
1. **Kemudahan Update**: Admin dapat mengupdate konten tanpa perlu edit kode
2. **Real-time Sync**: Perubahan langsung terlihat di website pengguna
3. **User Experience**: Informasi kontak dan link pendaftaran memudahkan pengguna
4. **Professional Look**: Animasi sinkronisasi memberikan kesan website modern
5. **Centralized Management**: Semua konten website dikelola dari satu tempat

## Catatan Implementasi
- Semua perubahan dicatat dalam activity logs
- Backup otomatis data sebelum perubahan
- Validasi URL untuk link pendaftaran
- Support untuk format kontak yang fleksibel (WhatsApp, Email, Telepon)