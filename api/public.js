// Public API - Limited endpoints untuk website publik
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();

// Cache untuk optimisasi performa
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 menit untuk public

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
    if (cache.size > 50) {
        const oldestKey = cache.keys().next().value;
        cache.delete(oldestKey);
    }
};

// Middleware dengan rate limiting untuk public
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 
        ['https://ikm-juara-public.vercel.app', 'https://*.vercel.app'] : 
        ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));

// Rate limiting middleware (simple implementation)
const rateLimitMap = new Map();
const RATE_LIMIT = 100; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

const rateLimit = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
        return next();
    }
    
    const limit = rateLimitMap.get(ip);
    if (now > limit.resetTime) {
        limit.count = 1;
        limit.resetTime = now + RATE_WINDOW;
        return next();
    }
    
    if (limit.count >= RATE_LIMIT) {
        return res.status(429).json({ 
            error: 'Too many requests',
            message: 'Rate limit exceeded. Please try again later.'
        });
    }
    
    limit.count++;
    next();
};

app.use(rateLimit);

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - PUBLIC - ${req.method} ${req.url}`);
    next();
});

// Helper function untuk read data
const readData = (filename) => {
    const cacheKey = `public_file_${filename}`;
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

// Activity logging untuk public
const logPublicActivity = (activityData) => {
    try {
        const logs = readData('activity-logs.json');
        const newLog = {
            id: logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1,
            timestamp: new Date().toISOString(),
            type: 'public_activity',
            ...activityData
        };
        
        // Note: Public API tidak bisa write ke file di Vercel
        // Ini hanya untuk logging, bisa dikirim ke external service
        console.log('Public activity:', newLog);
    } catch (error) {
        console.error('Failed to log public activity:', error);
    }
};

// PUBLIC API ENDPOINTS (READ-ONLY)

// Website content untuk public
app.get('/api/website-content', (req, res) => {
    try {
        const cacheKey = 'public_website_content';
        const cached = getCachedData(cacheKey);
        
        if (cached) {
            return res.json(cached);
        }
        
        const content = readData('website-content.json');
        setCachedData(cacheKey, content);
        res.json(content);
    } catch (error) {
        console.error('Failed to load website content:', error);
        res.status(500).json({ error: 'Failed to load website content' });
    }
});

// Search IKM untuk public (limited)
app.post('/api/search-ikm', (req, res) => {
    try {
        const { query } = req.body;
        
        if (!query || query.length < 3) {
            return res.status(400).json({ 
                error: 'Query minimal 3 karakter' 
            });
        }
        
        const ikmBinaan = readData('ikm-binaan.json');
        
        const result = ikmBinaan.find(ikm => 
            ikm.nib === query || 
            ikm.nik === query || 
            ikm.namaLengkap.toLowerCase().includes(query.toLowerCase())
        );
        
        // Log search activity
        logPublicActivity({
            action: 'search_ikm',
            user: 'public_user',
            details: {
                query: query,
                found: !!result,
                resultId: result ? result.id : null,
                resultName: result ? result.namaLengkap : null,
                ip: req.ip || req.connection.remoteAddress,
                userAgent: req.headers['user-agent']
            },
            success: true
        });
        
        if (result) {
            // Get related data (read-only)
            const hkiMerek = readData('hki-merek.json').filter(h => h.ikmBinaanId === result.id);
            const sertifikatHalal = readData('sertifikat-halal.json').filter(s => s.ikmBinaanId === result.id);
            const tkdnIk = readData('tkdn-ik.json').filter(t => t.ikmBinaanId === result.id);
            const siinas = readData('siinas.json').filter(s => s.ikmBinaanId === result.id);
            const ujiNilaiGizi = readData('uji-nilai-gizi.json').filter(u => u.ikmBinaanId === result.id);
            const kurasiProduk = readData('kurasi-produk.json').filter(k => k.ikmBinaanId === result.id);
            const pelatihanPemberdayaan = readData('pelatihan-pemberdayaan.json');
            
            // Find pelatihan where this IKM is a participant
            const pelatihan = pelatihanPemberdayaan.filter(p => 
                p.peserta && p.peserta.some(peserta => peserta.ikmBinaanId === result.id)
            );
            
            res.json({
                found: true,
                data: {
                    ikmBinaan: result,
                    hkiMerek,
                    sertifikatHalal,
                    tkdnIk,
                    siinas,
                    ujiNilaiGizi,
                    kurasiProduk,
                    pelatihan
                }
            });
        } else {
            res.json({ found: false, message: 'Data tidak ditemukan' });
        }
        
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat mencari data' });
    }
});

// Buku Tamu API (write-only endpoint yang bisa digunakan public)
app.post('/api/buku-tamu', (req, res) => {
    try {
        const { nama, nik } = req.body;
        
        if (!nama || !nik) {
            return res.status(400).json({ 
                error: 'Nama dan NIK wajib diisi' 
            });
        }
        
        if (nik.length !== 16 || !/^\d{16}$/.test(nik)) {
            return res.status(400).json({ 
                error: 'NIK harus 16 digit angka' 
            });
        }
        
        // Log buku tamu entry
        logPublicActivity({
            action: 'guest_login',
            user: nama,
            details: {
                nama: nama,
                nik: nik,
                ip: req.ip || req.connection.remoteAddress,
                userAgent: req.headers['user-agent']
            },
            success: true
        });
        
        res.json({ 
            success: true, 
            message: 'Selamat datang! Anda berhasil masuk sebagai tamu.',
            session: {
                nama: nama,
                nik: nik,
                loginTime: new Date().toISOString()
            }
        });
        
    } catch (error) {
        console.error('Buku tamu error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat menyimpan data' });
    }
});

// Public statistics (limited)
app.get('/api/public-stats', (req, res) => {
    try {
        const cacheKey = 'public_stats';
        const cached = getCachedData(cacheKey);
        
        if (cached) {
            return res.json(cached);
        }
        
        const ikmBinaan = readData('ikm-binaan.json');
        const pelatihanPemberdayaan = readData('pelatihan-pemberdayaan.json');
        
        // Calculate total participants
        let totalPesertaPelatihan = 0;
        pelatihanPemberdayaan.forEach(pelatihan => {
            if (pelatihan.peserta && Array.isArray(pelatihan.peserta)) {
                totalPesertaPelatihan += pelatihan.peserta.length;
            }
        });
        
        const stats = {
            totalIkmBinaan: ikmBinaan.length,
            totalPelatihan: pelatihanPemberdayaan.length,
            totalPesertaPelatihan: totalPesertaPelatihan,
            lastUpdated: new Date().toISOString()
        };
        
        setCachedData(cacheKey, stats);
        res.json(stats);
        
    } catch (error) {
        console.error('Public stats error:', error);
        res.status(500).json({ error: 'Failed to load statistics' });
    }
});

// Health check untuk public API
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        message: 'IKM JUARA Public API is running',
        version: '2.0.0-public',
        environment: 'public',
        cache: {
            size: cache.size,
            maxSize: 50
        }
    });
});

// Root redirect
app.get('/', (req, res) => {
    res.redirect(301, '/public/login.html');
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: 'This is a public API with limited endpoints',
        availableEndpoints: [
            '/api/health',
            '/api/website-content',
            '/api/search-ikm',
            '/api/buku-tamu',
            '/api/public-stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// Export for Vercel
module.exports = app;