# 🌐 SETUP 2 WEBSITE TERPISAH - DATABASE IKM JUARA

## 📋 OVERVIEW

Memisahkan aplikasi menjadi 2 website terpisah dengan domain berbeda:

1. **Admin Website** - Untuk master admin
2. **Public Website** - Untuk pengguna umum

---

## 🎯 STRATEGI DEPLOYMENT

### **Opsi 1: Subdomain Setup (RECOMMENDED)**

#### **Admin Website:**
- **Domain**: `admin.database-ikm-juara.vercel.app`
- **Folder**: `/admin`
- **Target User**: Master Admin (BidIndustri08#)
- **Features**: Full CRUD, Dashboard, Management

#### **Public Website:**
- **Domain**: `public.database-ikm-juara.vercel.app` atau `www.database-ikm-juara.vercel.app`
- **Folder**: `/public`
- **Target User**: Masyarakat umum
- **Features**: Search, View, Guest Login

### **Opsi 2: Separate Projects**

#### **Project 1: Admin Dashboard**
- **Repo**: `database-ikm-juara-admin`
- **Domain**: `ikm-admin-madiun.vercel.app`
- **Content**: Admin panel only

#### **Project 2: Public Portal**
- **Repo**: `database-ikm-juara-public`
- **Domain**: `ikm-juara-madiun.vercel.app`
- **Content**: Public website only

---

## 🔧 IMPLEMENTASI OPSI 1 (SUBDOMAIN)

### **1. Konfigurasi Vercel untuk Admin**

**File: `vercel-admin.json`**
```json
{
  "version": 2,
  "name": "ikm-juara-admin",
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node",
      "config": {
        "maxLambdaSize": "50mb",
        "memory": 1024,
        "maxDuration": 30
      }
    },
    {
      "src": "admin/**",
      "use": "@vercel/static"
    },
    {
      "src": "shared/**",
      "use": "@vercel/static"
    },
    {
      "src": "data/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/shared/(.*)",
      "dest": "/shared/$1"
    },
    {
      "src": "/data/(.*)",
      "dest": "/data/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/admin/$1"
    },
    {
      "src": "/",
      "dest": "/admin/login.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

### **2. Konfigurasi Vercel untuk Public**

**File: `vercel-public.json`**
```json
{
  "version": 2,
  "name": "ikm-juara-public",
  "builds": [
    {
      "src": "api/public.js",
      "use": "@vercel/node"
    },
    {
      "src": "public/**",
      "use": "@vercel/static"
    },
    {
      "src": "shared/**",
      "use": "@vercel/static"
    },
    {
      "src": "data/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/public.js"
    },
    {
      "src": "/shared/(.*)",
      "dest": "/shared/$1"
    },
    {
      "src": "/data/(.*)",
      "dest": "/data/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/public/$1"
    },
    {
      "src": "/",
      "dest": "/public/login.html"
    }
  ]
}
```

---

## 🚀 IMPLEMENTASI OPSI 2 (SEPARATE PROJECTS)

### **Project Structure:**

#### **Admin Project:**
```
ikm-juara-admin/
├── admin/           # Admin pages
├── shared/          # Shared assets
├── data/            # Data files
├── api/             # Admin API
├── server/          # Admin server
├── vercel.json      # Admin config
└── package.json     # Admin dependencies
```

#### **Public Project:**
```
ikm-juara-public/
├── public/          # Public pages
├── shared/          # Shared assets (copy)
├── data/            # Data files (read-only)
├── api/             # Public API (limited)
├── vercel.json      # Public config
└── package.json     # Public dependencies
```

---

## 📝 LANGKAH-LANGKAH DEPLOYMENT

### **Untuk Opsi 1 (Subdomain):**

1. **Deploy Admin Website:**
   ```bash
   # Rename vercel.json to vercel-admin.json
   mv vercel.json vercel-admin.json
   
   # Deploy with custom config
   vercel --prod --name ikm-juara-admin
   ```

2. **Deploy Public Website:**
   ```bash
   # Create public-only config
   cp vercel-admin.json vercel-public.json
   # Edit vercel-public.json for public routes
   
   # Deploy public version
   vercel --prod --name ikm-juara-public
   ```

### **Untuk Opsi 2 (Separate Projects):**

1. **Create Admin Repository:**
   ```bash
   mkdir ikm-juara-admin
   cp -r admin/ shared/ data/ api/ server/ ikm-juara-admin/
   cd ikm-juara-admin
   git init && git add . && git commit -m "Admin website"
   vercel --prod
   ```

2. **Create Public Repository:**
   ```bash
   mkdir ikm-juara-public
   cp -r public/ shared/ data/ ikm-juara-public/
   # Create limited API for public
   cd ikm-juara-public
   git init && git add . && git commit -m "Public website"
   vercel --prod
   ```

---

## 🔐 SECURITY CONSIDERATIONS

### **Admin Website Security:**
- Password protection on all admin routes
- IP whitelist (optional)
- Admin-only API endpoints
- Enhanced logging and monitoring

### **Public Website Security:**
- Rate limiting on search
- Guest session management
- Read-only data access
- Public API endpoints only

---

## 🌐 DOMAIN MAPPING

### **Custom Domains (Optional):**

#### **Admin Website:**
- `admin.ikmjuara.madiun.go.id`
- `dashboard.ikmjuara.madiun.go.id`

#### **Public Website:**
- `www.ikmjuara.madiun.go.id`
- `ikmjuara.madiun.go.id`

### **Vercel Domains:**
- **Admin**: `ikm-admin-madiun.vercel.app`
- **Public**: `ikm-juara-madiun.vercel.app`

---

## 📊 BENEFITS OF SEPARATION

### **Performance Benefits:**
- Faster loading (smaller bundles)
- Targeted optimization
- Independent scaling
- Better caching strategies

### **Security Benefits:**
- Isolated admin access
- Reduced attack surface
- Separate authentication
- Independent monitoring

### **Maintenance Benefits:**
- Independent deployments
- Easier updates
- Separate error tracking
- Targeted optimizations

---

## 🎯 RECOMMENDATION

**Saya merekomendasikan Opsi 1 (Subdomain Setup)** karena:

1. **Easier to maintain** - Single codebase
2. **Shared data** - No synchronization issues
3. **Cost effective** - Single Vercel project
4. **Simpler deployment** - One repository
5. **Better for your use case** - Same organization, different access levels

---

## 🚀 NEXT STEPS

1. **Choose deployment strategy** (Opsi 1 atau 2)
2. **Configure domain settings**
3. **Update DNS records** (if using custom domains)
4. **Test both websites**
5. **Update documentation**

Mana yang Anda pilih? Saya bisa membantu implementasi sesuai pilihan Anda.