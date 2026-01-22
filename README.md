# Database IKM JUARA - Sistem Informasi Industri Kecil Menengah

![IKM JUARA](https://img.shields.io/badge/IKM-JUARA-green)
![Node.js](https://img.shields.io/badge/Node.js-18+-blue)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)

## 📋 Deskripsi

Database IKM JUARA adalah sistem informasi terintegrasi untuk mengelola data Industri Kecil Menengah (IKM) Binaan di Kota Madiun. Sistem ini menyediakan platform untuk:

- **Admin Panel**: Pengelolaan data IKM, layanan, dan pelatihan
- **Website Publik**: Portal informasi dan penelusuran data untuk masyarakat
- **Activity Logs**: Monitoring aktivitas sistem
- **Export/Import**: Fitur ekspor dan impor data Excel

## 🚀 Fitur Utama

### Admin Panel
- ✅ Dashboard dengan statistik real-time
- ✅ Manajemen data IKM Binaan
- ✅ Input layanan IKM (HKI Merek, Sertifikat Halal, TKDN IK, dll)
- ✅ Manajemen pelatihan pemberdayaan
- ✅ Sistem penelusuran data
- ✅ Activity logs dan monitoring
- ✅ Edit redaksi website
- ✅ Recycle bin untuk data terhapus
- ✅ Export data ke Excel/PDF
- ✅ Import data dari Excel dengan validasi duplikat

### Website Publik
- ✅ Portal informasi layanan IKM
- ✅ Penelusuran data IKM Binaan
- ✅ Informasi program pelatihan
- ✅ Export hasil penelusuran
- ✅ Responsive design
- ✅ Guest login system

### Layanan IKM yang Didukung
- 📜 Pendaftaran HKI Merek
- ✅ Pendaftaran Sertifikat Halal
- 🇮🇩 Pendaftaran TKDN IK
- 💾 Pendaftaran dan Pendampingan SIINas
- 🧪 Pendaftaran Uji Nilai Gizi
- 🏆 Kurasi Produk

## 🛠️ Teknologi yang Digunakan

- **Backend**: Node.js + Express.js
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Database**: JSON Files (File-based)
- **File Processing**: ExcelJS untuk Excel, Multer untuk upload
- **UI Framework**: Custom CSS dengan Font Awesome icons
- **Deployment**: Vercel (Serverless)

## 📦 Instalasi

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Git

### Local Development

1. **Clone repository**
```bash
git clone https://github.com/yourusername/database-ikm-juara.git
cd database-ikm-juara
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
# atau
node server/app.js
```

4. **Akses aplikasi**
- Admin Panel: http://localhost:3000/admin
- Website Publik: http://localhost:3000/public
- API Documentation: http://localhost:3000/api

## 🔧 Konfigurasi

### Environment Variables
Buat file `.env` di root directory:
```env
PORT=3000
NODE_ENV=development
```

### Default Admin Account
```
Username: BidIndustri08#
Password: DisnakerKUKM2024!
Role: super_admin
```

### Default Guest Account
```
Nama: Tamu
NIK: 1234567890123456
```

## 📚 API Documentation

### Authentication
- `POST /api/login` - Admin login
- `POST /api/buku-tamu` - Guest registration

### Data Management
- `GET /api/dashboard` - Dashboard statistics
- `GET /api/{dataType}` - Get all data
- `POST /api/{dataType}` - Create new data
- `PUT /api/{dataType}/:id` - Update data
- `DELETE /api/{dataType}/:id` - Delete data

### Search & Export
- `POST /api/search-ikm` - Search IKM data
- `GET /api/export/{dataType}/excel` - Export to Excel
- `GET /api/export/{dataType}/pdf` - Export to PDF
- `POST /api/import/ikm-binaan` - Import from Excel

### Website Content
- `GET /api/website-content` - Get website content
- `POST /api/website-content` - Add content
- `PUT /api/website-content` - Update content
- `DELETE /api/website-content` - Delete content

## 📁 Struktur Project

```
database-ikm-juara/
├── admin/                  # Admin panel files
│   ├── index.html         # Dashboard
│   ├── ikm-binaan.html    # IKM management
│   ├── inputan-layanan.html # Service input
│   ├── pelatihan.html     # Training management
│   ├── penelusuran.html   # Data search
│   ├── edit-redaksi.html  # Website editor
│   ├── activity-logs.html # Activity monitoring
│   └── recycle-bin.html   # Deleted data
├── public/                # Public website files
│   ├── index.html         # Main public page
│   ├── login.html         # Guest login
│   └── *-simple.html      # Simplified versions
├── server/                # Backend server
│   └── app.js            # Main server file
├── shared/               # Shared assets
│   ├── style.css         # Global styles
│   └── script.js         # Shared JavaScript
├── data/                 # JSON database files
│   ├── ikm-binaan.json   # IKM data
│   ├── admin-users.json  # Admin accounts
│   ├── website-content.json # Website content
│   └── *.json           # Other data files
└── uploads/              # File uploads
```

## 🚀 Deployment

### Vercel Deployment

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel --prod
```

3. **Configure vercel.json**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server/app.js"
    }
  ]
}
```

## 📊 Monitoring & Logs

### Activity Logs
Sistem mencatat semua aktivitas:
- Login/logout admin dan guest
- CRUD operations pada data
- Export/import activities
- Search activities
- Website content changes

### Performance Monitoring
- Request logging dengan timestamp
- Error tracking dan debugging
- API response time monitoring

## 🔒 Security Features

- Input validation dan sanitization
- File upload restrictions
- Session management
- Activity logging
- Data backup dan recovery
- SQL injection prevention (JSON-based)

## 🧪 Testing

### Manual Testing
```bash
# Test server
npm test

# Test API endpoints
curl http://localhost:3000/api/dashboard
```

### Automated Testing
- Unit tests untuk API endpoints
- Integration tests untuk workflows
- UI testing untuk admin panel

## 📈 Roadmap

### Version 2.0 (Planned)
- [ ] Database migration ke PostgreSQL/MySQL
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-tenant support
- [ ] Advanced user roles

### Version 1.5 (In Progress)
- [x] Enhanced security features
- [x] Performance optimizations
- [x] Better error handling
- [x] Improved UI/UX

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: Kiro AI Assistant
- **Client**: Dinas Tenaga Kerja dan KUKM Kota Madiun
- **Project Manager**: BidIndustri08#

## 📞 Support

Untuk bantuan dan support:
- Email: support@ikmjuara.com
- WhatsApp: +62812-3456-7890
- Documentation: [Wiki](https://github.com/yourusername/database-ikm-juara/wiki)

## 🙏 Acknowledgments

- Dinas Tenaga Kerja dan KUKM Kota Madiun
- Tim Pengembang IKM JUARA
- Komunitas Open Source Indonesia

---

**Database IKM JUARA** - Memajukan Industri Kecil Menengah Indonesia 🇮🇩

## 🌐 DUAL WEBSITE DEPLOYMENT

### **🔐 Admin Website (Master Admin)**
- **URL Production**: `https://ikm-juara-admin.vercel.app`
- **Target User**: Master Admin (BidIndustri08#)
- **Login**: 
  - Username: `BidIndustri08#`
  - Password: `DisnakerKUKM2024!`
- **Features**: 
  - Dashboard real-time
  - CRUD semua data
  - Import/Export Excel
  - Activity logs
  - Edit redaksi website
  - Recycle bin

### **👥 Public Website (Masyarakat Umum)**
- **URL Production**: `https://ikm-juara-public.vercel.app`
- **Target User**: Masyarakat umum
- **Login**: Guest login dengan nama dan NIK (16 digit)
- **Features**:
  - Penelusuran data IKM
  - Informasi layanan
  - Program pelatihan
  - Export hasil penelusuran

### **🚀 Deployment Commands**

#### Deploy Both Websites:
```powershell
.\deploy-dual.ps1
```

#### Deploy Admin Only:
```bash
cp vercel-admin.json vercel.json
vercel --prod --name ikm-juara-admin
```

#### Deploy Public Only:
```bash
cp vercel-public.json vercel.json
vercel --prod --name ikm-juara-public
```

### **🔧 Development URLs**
- **Admin Local**: `http://localhost:3000/admin/login.html`
- **Public Local**: `http://localhost:3000/public/login.html`

---

## 📊 WEBSITE COMPARISON

| Feature | Admin Website | Public Website |
|---------|---------------|----------------|
| **Authentication** | Username/Password | Guest (Nama/NIK) |
| **Data Access** | Full CRUD | Read-only |
| **Dashboard** | Real-time stats | Public stats only |
| **Export** | Excel/PDF | Limited export |
| **Import** | Excel import | No import |
| **Management** | Full management | View only |
| **Security** | High security | Public access |
| **Performance** | Full features | Optimized for speed |

---

## 🎯 BENEFITS OF SEPARATION

### **Performance Benefits:**
- ⚡ Faster loading (smaller bundles)
- ⚡ Targeted optimization
- ⚡ Independent scaling
- ⚡ Better caching strategies

### **Security Benefits:**
- 🔒 Isolated admin access
- 🔒 Reduced attack surface
- 🔒 Separate authentication
- 🔒 Independent monitoring

### **Maintenance Benefits:**
- 🛠️ Independent deployments
- 🛠️ Easier updates
- 🛠️ Separate error tracking
- 🛠️ Targeted optimizations