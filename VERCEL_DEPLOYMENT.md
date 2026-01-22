# 🚀 Vercel Deployment Guide - Database IKM JUARA

## Step-by-Step Vercel Deployment

### 📋 Prerequisites
- ✅ GitHub repository setup dan terhubung
- ✅ Supabase database configured (optional untuk tahap awal)
- ✅ Vercel CLI installed
- ✅ Vercel account (buat di https://vercel.com jika belum ada)

---

## 🌐 Step 1: Vercel Account Setup

### 1.1 Create Vercel Account
1. **Buka https://vercel.com**
2. **Klik "Sign Up"**
3. **Login dengan GitHub** (recommended untuk integrasi mudah)

### 1.2 Connect GitHub
- Vercel akan otomatis connect dengan GitHub account
- Authorize Vercel untuk akses repositories

---

## 🔧 Step 2: Deploy via Vercel Dashboard

### 2.1 Import Project
1. **Go to Vercel Dashboard**
2. **Klik "New Project"**
3. **Import Git Repository:**
   - Select GitHub
   - Find "database-ikm-juara" repository
   - Klik "Import"

### 2.2 Configure Project Settings
```
Project Name: database-ikm-juara
Framework Preset: Other (atau Node.js)
Root Directory: ./
Build Command: npm run build (atau kosongkan)
Output Directory: (kosongkan)
Install Command: npm install
```

### 2.3 Environment Variables (Optional)
**Add environment variables jika sudah setup Supabase:**
```
NODE_ENV = production
SUPABASE_URL = https://your-project-id.supabase.co
SUPABASE_ANON_KEY = your-anon-key
SUPABASE_SERVICE_KEY = your-service-role-key
```

### 2.4 Deploy
1. **Klik "Deploy"**
2. **Wait for deployment** (2-3 menit)
3. **Get deployment URL**

---

## 💻 Step 3: Deploy via Vercel CLI (Alternative)

### 3.1 Login to Vercel CLI
```bash
vercel login
```
- Follow browser authentication
- Confirm login in terminal

### 3.2 Deploy Project
```bash
# Deploy to production
vercel --prod

# Follow the prompts:
# ? Set up and deploy "D:\apkfixikmjuara"? [Y/n] y
# ? Which scope do you want to deploy to? [Your Account]
# ? Link to existing project? [y/N] n
# ? What's your project's name? database-ikm-juara
# ? In which directory is your code located? ./
```

### 3.3 Configure Deployment
```bash
# Set environment variables
vercel env add NODE_ENV
# Enter: production

vercel env add SUPABASE_URL
# Enter: https://your-project-id.supabase.co

# Redeploy with new environment
vercel --prod
```

---

## ⚙️ Step 4: Vercel Configuration Optimization

### 4.1 Update vercel.json
**File sudah ada, tapi pastikan konfigurasi optimal:**

```json
{
  "version": 2,
  "name": "database-ikm-juara",
  "builds": [
    {
      "src": "server/app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/admin/(.*)",
      "dest": "/admin/$1"
    },
    {
      "src": "/public/(.*)",
      "dest": "/public/$1"
    },
    {
      "src": "/shared/(.*)",
      "dest": "/shared/$1"
    },
    {
      "src": "/api/(.*)",
      "dest": "/server/app.js"
    },
    {
      "src": "/",
      "dest": "/server/app.js"
    },
    {
      "src": "/(.*)",
      "dest": "/server/app.js"
    }
  ],
  "functions": {
    "server/app.js": {
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  },
  "regions": ["sin1"]
}
```

### 4.2 Create .vercelignore
**File sudah dibuat oleh script, pastikan isinya:**

```
node_modules
.git
*.md
*.log
test-*.xlsx
uploads/*
.env
.env.local
```

---

## 🧪 Step 5: Test Deployment

### 5.1 Access Deployed Application
**URL format:** `https://database-ikm-juara.vercel.app`

### 5.2 Test All Endpoints
1. **Root redirect:** `/` → should redirect to admin login
2. **Admin panel:** `/admin/login.html`
3. **Public website:** `/public/login.html`
4. **API endpoints:** `/api/dashboard`

### 5.3 Test Functionality
```bash
# Test API endpoint
curl https://database-ikm-juara.vercel.app/api/dashboard

# Expected: JSON response with dashboard data
```

### 5.4 Performance Test
1. **Page load speed** (should be < 3 seconds)
2. **API response time** (should be < 1 second)
3. **Mobile responsiveness**

---

## 🔧 Step 6: Domain Configuration (Optional)

### 6.1 Custom Domain Setup
1. **Go to Project Settings > Domains**
2. **Add custom domain:**
   ```
   ikmjuara.com
   www.ikmjuara.com
   ```
3. **Configure DNS records** di domain provider

### 6.2 SSL Certificate
- Vercel automatically provides SSL
- HTTPS enabled by default
- Certificate auto-renewal

---

## 📊 Step 7: Monitoring & Analytics

### 7.1 Enable Vercel Analytics
1. **Go to Project Settings > Analytics**
2. **Enable Web Analytics**
3. **Configure tracking**

### 7.2 Function Logs
1. **Go to Functions tab**
2. **Monitor server logs**
3. **Check for errors**

### 7.3 Performance Monitoring
1. **Monitor Core Web Vitals**
2. **Check deployment frequency**
3. **Track error rates**

---

## 🔄 Step 8: Continuous Deployment

### 8.1 Automatic Deployments
- **Production branch:** `main` (auto-deploy)
- **Preview deployments:** feature branches
- **Deployment hooks:** GitHub integration

### 8.2 Deployment Workflow
```bash
# Local development
git add .
git commit -m "Feature: Add new functionality"
git push origin main

# Automatic deployment triggered
# Vercel builds and deploys automatically
# Get deployment URL in GitHub commit status
```

---

## 🚨 Step 9: Troubleshooting

### 9.1 Common Deployment Issues

#### Build Errors
```
Error: Cannot find module 'xyz'
```
**Solution:**
- Check package.json dependencies
- Ensure all imports are correct
- Verify file paths

#### Function Timeout
```
Error: Function execution timed out
```
**Solution:**
- Optimize database queries
- Increase maxDuration in vercel.json
- Add caching

#### Static File Issues
```
Error: 404 - File not found
```
**Solution:**
- Check file paths in vercel.json routes
- Verify static files are committed to git
- Check .vercelignore

### 9.2 Debug Deployment
```bash
# Check deployment logs
vercel logs https://database-ikm-juara.vercel.app

# Local development mode
vercel dev

# Check function logs
vercel logs --follow
```

---

## 📋 Step 10: Production Checklist

### 10.1 Pre-Production Checklist
- ✅ All features tested locally
- ✅ Database connection working
- ✅ Environment variables set
- ✅ Error handling implemented
- ✅ Security measures in place

### 10.2 Post-Deployment Checklist
- ✅ Application accessible via URL
- ✅ Admin panel login working
- ✅ Public website functioning
- ✅ API endpoints responding
- ✅ Database operations working
- ✅ File uploads working (if applicable)
- ✅ Export/import features working
- ✅ Mobile responsiveness verified

### 10.3 Performance Checklist
- ✅ Page load time < 3 seconds
- ✅ API response time < 1 second
- ✅ No JavaScript errors in console
- ✅ All images loading properly
- ✅ Forms submitting correctly

---

## 🎯 Step 11: Post-Deployment Tasks

### 11.1 Update Documentation
1. **Update README.md** dengan production URL
2. **Update deployment status**
3. **Add live demo links**

### 11.2 Share Access
1. **Share production URL** dengan stakeholders
2. **Provide admin credentials**
3. **Create user documentation**

### 11.3 Monitoring Setup
1. **Setup uptime monitoring**
2. **Configure error alerts**
3. **Monitor resource usage**

---

## 📊 Deployment Summary

### Deployment URLs
```
Production: https://database-ikm-juara.vercel.app
Admin Panel: https://database-ikm-juara.vercel.app/admin
Public Website: https://database-ikm-juara.vercel.app/public
API Base: https://database-ikm-juara.vercel.app/api
```

### Key Features Deployed
- ✅ Admin Dashboard dengan real-time statistics
- ✅ IKM Binaan management system
- ✅ 6 layanan IKM (HKI, Halal, TKDN, SIINas, Uji Gizi, Kurasi)
- ✅ Pelatihan pemberdayaan dengan peserta management
- ✅ Public website dengan guest login
- ✅ Search dan export functionality
- ✅ Activity logs dan monitoring
- ✅ Edit redaksi website
- ✅ Recycle bin untuk data recovery

---

## 📞 Support & Resources

### Vercel Resources
- **Documentation:** https://vercel.com/docs
- **Community:** https://github.com/vercel/vercel/discussions
- **Status Page:** https://vercel-status.com

### Project Resources
- **GitHub Repository:** https://github.com/yourusername/database-ikm-juara
- **Live Demo:** https://database-ikm-juara.vercel.app
- **Documentation:** README.md

**Vercel Deployment - COMPLETED! 🚀**

**Status: Production Ready and Live!**