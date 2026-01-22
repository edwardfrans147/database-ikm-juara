# Fitur Export Hasil Penelusuran Data IKM Binaan

## Deskripsi
Fitur ini memungkinkan export hasil penelusuran data IKM Binaan ke dalam format Excel (.xlsx) atau PDF. Export mencakup semua data lengkap IKM beserta riwayat layanan dan pelatihan yang pernah diikuti.

## Fitur Utama

### 1. Export ke Excel (.xlsx)
- Format file Excel asli dengan multiple sheet/section
- Data terstruktur dengan header dan formatting
- Auto-fit column width untuk readability
- Mencakup semua data layanan dan pelatihan
- File dapat diedit dan diproses lebih lanjut

### 2. Export ke PDF
- Format PDF siap print
- Layout yang rapi dan professional
- Dapat dibuka di browser baru
- Tombol print/save as PDF built-in
- Cocok untuk dokumentasi dan arsip

### 3. Tombol "Cari Data Lainnya"
- Reset form pencarian dengan satu klik
- Clear hasil pencarian sebelumnya
- Auto-focus ke field pencarian pertama
- Scroll otomatis ke form pencarian

## Implementasi

### Frontend (admin/penelusuran.html)

#### Tombol Export dan Cari Data Lainnya
```html
<div style="display: flex; gap: 10px;">
    <button class="btn btn-success" onclick="exportSearchResult('excel')">
        <i class="fas fa-file-excel"></i> Export Excel
    </button>
    <button class="btn btn-warning" onclick="exportSearchResult('pdf')">
        <i class="fas fa-file-pdf"></i> Export PDF
    </button>
    <button class="btn btn-primary" onclick="startNewSearch()">
        <i class="fas fa-search-plus"></i> Cari Data Lainnya
    </button>
</div>
```

#### Fungsi JavaScript
```javascript
// Export hasil pencarian
const exportSearchResult = async (format) => {
    // Validasi data tersedia
    // Kirim request ke backend
    // Handle download file (Excel) atau buka window baru (PDF)
}

// Mulai pencarian baru
const startNewSearch = () => {
    // Clear form inputs
    // Hide hasil pencarian
    // Reset variabel global
    // Focus dan scroll ke form
}
```

### Backend (server/app.js)

#### Endpoint: POST /api/export-search-result
```javascript
// Parameter:
{
  "data": { /* hasil pencarian */ },
  "format": "excel" | "pdf"
}

// Response:
- Excel: File binary (.xlsx)
- PDF: HTML content untuk print
```

#### Struktur Export Excel
1. **Header**: Judul dan tanggal export
2. **Data Dasar IKM**: NIB, NIK, nama, alamat, dll
3. **Layanan per Kategori**:
   - HKI Merek
   - Sertifikat Halal
   - TKDN IK
   - SIINas
   - Uji Nilai Gizi
   - Kurasi Produk
4. **Pelatihan Pemberdayaan**
5. **Ringkasan**: Total layanan dan pelatihan

#### Struktur Export PDF
- Layout responsive untuk print
- Styling professional
- Grid layout untuk data
- Tabel untuk layanan multiple
- Summary box dengan highlight

## Cara Penggunaan

### 1. Melakukan Pencarian
1. Buka halaman "Penelusuran Data"
2. Masukkan NIB, NIK, atau Nama Lengkap
3. Klik "Cari Data"
4. Tunggu hasil pencarian muncul

### 2. Export Hasil
1. Setelah hasil pencarian muncul
2. Klik tombol "Export Excel" atau "Export PDF"
3. Tunggu proses export selesai
4. **Excel**: File akan otomatis terdownload
5. **PDF**: Akan terbuka di tab/window baru

### 3. Cari Data Lainnya
1. Klik tombol "Cari Data Lainnya"
2. Form akan ter-reset otomatis
3. Cursor akan fokus ke field NIB
4. Halaman akan scroll ke form pencarian

## Format File Export

### Excel (.xlsx)
```
Filename: Penelusuran_[Nama_Lengkap]_[YYYY-MM-DD].xlsx
Contoh: Penelusuran_Ahmad_Rizki_Pratama_2024-01-21.xlsx
```

**Struktur Sheet:**
- Row 1: Judul utama (merged cells)
- Row 3: Tanggal export
- Row 5+: Data dasar IKM
- Sections terpisah untuk setiap layanan
- Headers dengan background abu-abu
- Auto-fit column width

### PDF
```
Title: Hasil Penelusuran Data IKM Binaan
Layout: A4 portrait
Font: Arial, 12px
```

**Struktur Halaman:**
- Header dengan judul dan tanggal
- Data dasar dalam grid 2 kolom
- Setiap layanan dalam tabel terpisah
- Summary box dengan background hijau
- Print-friendly styling

## Keunggulan Fitur

### 1. Fleksibilitas Format
- **Excel**: Untuk analisis dan pengolahan data
- **PDF**: Untuk dokumentasi dan presentasi

### 2. Data Lengkap
- Semua informasi IKM dalam satu file
- Riwayat layanan dan pelatihan
- Summary statistik

### 3. User Experience
- Tombol export hanya muncul setelah ada hasil
- Loading indicator saat export
- Auto-download untuk Excel
- New tab untuk PDF

### 4. Professional Output
- Format yang rapi dan terstruktur
- Filename dengan timestamp
- Ready-to-use untuk laporan

## Error Handling

### Validasi Data
- Cek ketersediaan data sebelum export
- Alert jika tidak ada data untuk diekspor

### Network Error
- Timeout handling untuk request besar
- Error message yang informatif
- Restore button state setelah error

### File Generation Error
- Backend validation untuk data structure
- Graceful error handling
- User-friendly error messages

## Testing

### Test Cases
1. **Export Excel dengan data lengkap**
   - Semua layanan dan pelatihan ada
   - File terdownload dengan benar
   - Format Excel valid

2. **Export PDF dengan data minimal**
   - Hanya data dasar IKM
   - PDF terbuka di tab baru
   - Layout tetap rapi

3. **Tombol Cari Data Lainnya**
   - Form ter-reset dengan benar
   - Hasil pencarian hilang
   - Focus ke field pertama

4. **Error Scenarios**
   - Export tanpa data
   - Network timeout
   - Server error

### File Test
Gunakan data existing di database untuk testing:
- NIB: 1234567890123
- Akan menghasilkan export dengan data lengkap
- Test kedua format export

## Maintenance

### Update Format
- Modifikasi struktur Excel di backend
- Update styling PDF sesuai kebutuhan
- Tambah field baru jika diperlukan

### Performance
- Monitor ukuran file export
- Optimize query untuk data besar
- Cache hasil pencarian jika perlu

Fitur ini memberikan kemudahan untuk mendokumentasikan dan menganalisis data IKM secara komprehensif dalam format yang sesuai kebutuhan pengguna.