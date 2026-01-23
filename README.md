# Database IKM JUARA

Sistem manajemen database untuk IKM (Industri Kecil Menengah) binaan Dinas Perindustrian dan Perdagangan Kota Madiun.

## 🚀 Fitur Utama

- **Dashboard Admin**: Kelola data IKM binaan dan layanan
- **Website Publik**: Informasi layanan untuk masyarakat
- **Database Terintegrasi**: Menggunakan Supabase sebagai backend
- **Responsive Design**: Dapat diakses dari desktop dan mobile

## 📁 Struktur Project

```
├── admin/          # Halaman dashboard admin
├── api/            # API endpoints (simple-api.js)
├── data/           # File data JSON
├── lib/            # Supabase client configuration
├── public/         # Website publik
├── shared/         # CSS dan assets bersama
├── .env.local      # Environment variables
├── package.json    # Dependencies
├── vercel.json     # Konfigurasi deployment
└── README.md       # Dokumentasi
```

## 🛠️ Setup & Installation

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd database-ikm-juara
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   Buat file `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
   ```

4. **Run development server**
   ```bash
   node server-supabase.js
   ```

## 🌐 Deployment

### Deploy ke Vercel

1. **Otomatis dengan script**
   ```bash
   ./deploy.ps1
   ```

2. **Manual**
   ```bash
   vercel --prod
   ```

### Environment Variables di Vercel

Set environment variables berikut di Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 👤 Login Admin

Gunakan akun demo berikut:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | admin |
| operator | operator123 | operator |
| staff | staff123 | staff |

## 📊 Database Schema

Database menggunakan Supabase dengan tabel:
- `ikm_binaan` - Data IKM binaan
- `admin_users` - User admin
- `hki_merek` - Data HKI & Merek
- `sertifikat_halal` - Data Sertifikat Halal
- `tkdn_ik` - Data TKDN & IK
- `siinas` - Data SIINAS
- `uji_nilai_gizi` - Data Uji Nilai Gizi
- `kurasi_produk` - Data Kurasi Produk
- `pelatihan_pemberdayaan` - Data Pelatihan
- `peserta_pelatihan` - Data Peserta Pelatihan

## 🔧 API Endpoints

- `GET /api/dashboard` - Dashboard statistics
- `POST /api/admin/login` - Admin login
- `GET /api/ikm-binaan` - Get IKM binaan data
- `GET /api/{service}` - Get service data
- `PUT /api/{service}/{id}` - Update service data
- `DELETE /api/{service}/{id}` - Delete service data

## 📱 Akses Website

- **Admin Dashboard**: `/admin/login.html`
- **Website Publik**: `/public/index.html`
- **API**: `/api/`

## 🆘 Support

Untuk bantuan teknis, hubungi tim pengembang atau buat issue di repository ini.

---

© 2026 Dinas Perindustrian dan Perdagangan Kota Madiun