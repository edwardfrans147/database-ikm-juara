// Optimized Vercel API endpoint dengan caching dan error handling
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();

// Cache untuk optimisasi performa
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 menit

const getCachedData = (key) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }
    cache.delete(key);
    return null;
};

const setCachedData = (key, data) => {
    cache.set(key, {
        data: data,
        timestamp: Date.now()
    });
    
    // Cleanup old cache entries
    if (cache.size > 100) {
        const oldestKey = cache.keys().next().value;
        cache.delete(oldestKey);
    }
};

// Optimized middleware dengan compression
const compression = require('compression');
app.use(compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) return false;
        return compression.filter(req, res);
    }
}));

app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 
        ['https://database-ikm-juara.vercel.app', 'https://*.vercel.app'] : 
        ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(bodyParser.json({ 
    limit: '10mb',
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));
app.use(bodyParser.urlencoded({ 
    extended: true, 
    limit: '10mb',
    parameterLimit: 1000
}));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('API error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
        timestamp: new Date().toISOString()
    });
});

// Optimized helper function dengan caching
const readData = (filename) => {
    const cacheKey = `file_${filename}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;
    
    try {
        const dataPath = path.join(process.cwd(), 'data', filename);
        if (!fs.existsSync(dataPath)) {
            console.warn(`File not found: ${dataPath}`);
            return [];
        }
        
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        setCachedData(cacheKey, data);
        return data;
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return [];
    }
};

// Optimized Dashboard API dengan caching
app.get('/api/dashboard', (req, res) => {
    try {
        const cacheKey = 'dashboard_stats';
        const cached = getCachedData(cacheKey);
        
        if (cached) {
            return res.json(cached);
        }
        
        const ikmBinaan = readData('ikm-binaan.json');
        const hkiMerek = readData('hki-merek.json');
        const sertifikatHalal = readData('sertifikat-halal.json');
        const tkdnIk = readData('tkdn-ik.json');
        const siinas = readData('siinas.json');
        const ujiNilaiGizi = readData('uji-nilai-gizi.json');
        const kurasiProduk = readData('kurasi-produk.json');
        const pelatihanPemberdayaan = readData('pelatihan-pemberdayaan.json');

        // Calculate total participants across all trainings
        let totalPesertaPelatihan = 0;
        pelatihanPemberdayaan.forEach(pelatihan => {
            if (pelatihan.peserta && Array.isArray(pelatihan.peserta)) {
                totalPesertaPelatihan += pelatihan.peserta.length;
            }
        });

        const dashboardData = {
            ikmBinaan: ikmBinaan.length,
            hkiMerek: hkiMerek.length,
            sertifikatHalal: sertifikatHalal.length,
            tkdnIk: tkdnIk.length,
            siinas: siinas.length,
            ujiNilaiGizi: ujiNilaiGizi.length,
            kurasiProduk: kurasiProduk.length,
            pelatihanPemberdayaan: pelatihanPemberdayaan.length,
            totalPesertaPelatihan: totalPesertaPelatihan,
            lastUpdated: new Date().toISOString(),
            cached: false
        };
        
        // Cache untuk 2 menit
        setCachedData(cacheKey, { ...dashboardData, cached: true });
        res.json(dashboardData);
        
    } catch (error) {
        console.error('Dashboard API error:', error);
        res.status(500).json({ 
            error: 'Failed to load dashboard data',
            timestamp: new Date().toISOString()
        });
    }
});

// Health check dengan system info
app.get('/api/health', (req, res) => {
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        message: 'Database IKM JUARA API is running',
        version: '2.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: `${Math.floor(uptime / 60)} minutes`,
        memory: {
            used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
            total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`
        },
        cache: {
            size: cache.size,
            maxSize: 100
        }
    });
});

// API status endpoint
app.get('/api/status', (req, res) => {
    try {
        // Test data access
        const testData = readData('ikm-binaan.json');
        
        res.json({
            api: 'operational',
            database: 'connected',
            dataFiles: {
                'ikm-binaan': testData.length,
                accessible: true
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            api: 'operational',
            database: 'error',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Root redirect dengan better handling
app.get('/', (req, res) => {
    res.redirect(301, '/admin/login.html');
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });
});

// Export for Vercel
module.exports = app;