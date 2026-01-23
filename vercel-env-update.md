# 🔧 UPDATE VERCEL ENVIRONMENT VARIABLES

## 📋 **ENVIRONMENT VARIABLES YANG PERLU DITAMBAHKAN**

Buka Vercel Dashboard dan tambahkan environment variables berikut:

### **1. Buka Vercel Dashboard**
- URL: https://vercel.com/dashboard
- Pilih project: `database-ikm-juara`
- Klik **Settings** → **Environment Variables**

### **2. Tambahkan Variables Berikut:**

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://krylvwwguczwwoyqghlc.supabase.co
Environment: Production, Preview, Development

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY  
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeWx2d3dndWN6d3dveXFnaGxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNTg4NDEsImV4cCI6MjA4NDYzNDg0MX0.ikuvFZB4zjChsh-cM2MMMYYmWYTfC-P67gQZPBvCZqA
Environment: Production, Preview, Development

Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeWx2d3dndWN6d3dveXFnaGxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA1ODg0MSwiZXhwIjoyMDg0NjM0ODQxfQ.ysubAuDeIPshMww709q092yI37j1wZUIwK5vQttUsmE
Environment: Production, Preview, Development
```

### **3. Klik "Save" untuk setiap variable**

Setelah semua environment variables ditambahkan, lanjut ke deployment.