// Supabase API endpoint untuk menggantikan JSON files
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create Supabase clients
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

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
};

// Middleware
const compression = require('compression');
app.use(compression());
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 
        ['https://database-ikm-juara.vercel.app', 'https://*.vercel.app'] : 
        ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Helper function untuk error handling
const handleError = (res, error, message = 'Internal server error') => {
    console.error(message, error);
    res.status(500).json({
        success: false,
        error: message,
        details: error.message
    });
};

// Dashboard API dengan Supabase
app.get('/api/dashboard', async (req, res) => {
    try {
        const cacheKey = 'dashboard_stats';
        const cached = getCachedData(cacheKey);
        
        if (cached) {
            return res.json(cached);
        }
        
        // Get counts from all tables
        const [
            ikmBinaan,
            hkiMerek,
            sertifikatHalal,
            tkdnIk,
            siinas,
            ujiNilaiGizi,
            kurasiProduk,
            pelatihan,
            pesertaPelatihan
        ] = await Promise.all([
            supabase.from('ikm_binaan').select('id', { count: 'exact' }),
            supabase.from('hki_merek').select('id', { count: 'exact' }),
            supabase.from('sertifikat_halal').select('id', { count: 'exact' }),
            supabase.from('tkdn_ik').select('id', { count: 'exact' }),
            supabase.from('siinas').select('id', { count: 'exact' }),
            supabase.from('uji_nilai_gizi').select('id', { count: 'exact' }),
            supabase.from('kurasi_produk').select('id', { count: 'exact' }),
            supabase.from('pelatihan_pemberdayaan').select('id', { count: 'exact' }),
            supabase.from('peserta_pelatihan').select('id', { count: 'exact' })
        ]);

        const dashboardData = {
            ikmBinaan: ikmBinaan.count || 0,
            hkiMerek: hkiMerek.count || 0,
            sertifikatHalal: sertifikatHalal.count || 0,
            tkdnIk: tkdnIk.count || 0,
            siinas: siinas.count || 0,
            ujiNilaiGizi: ujiNilaiGizi.count || 0,
            kurasiProduk: kurasiProduk.count || 0,
            pelatihanPemberdayaan: pelatihan.count || 0,
            totalPesertaPelatihan: pesertaPelatihan.count || 0,
            lastUpdated: new Date().toISOString(),
            cached: false
        };
        
        setCachedData(cacheKey, { ...dashboardData, cached: true });
        res.json(dashboardData);
        
    } catch (error) {
        handleError(res, error, 'Error fetching dashboard data');
    }
});

// Get IKM Binaan data
app.get('/api/ikm-binaan', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('ikm_binaan')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        res.json({
            success: true,
            data: data || []
        });
        
    } catch (error) {
        handleError(res, error, 'Error fetching IKM Binaan data');
    }
});

// Search IKM Binaan
app.get('/api/search', async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.json({
                success: true,
                data: []
            });
        }
        
        const { data, error } = await supabase
            .from('ikm_binaan')
            .select('*')
            .or(`nib.eq.${query},nik.eq.${query},nama_lengkap.ilike.%${query}%,nama_usaha.ilike.%${query}%`);
        
        if (error) throw error;
        
        res.json({
            success: true,
            data: data || []
        });
        
    } catch (error) {
        handleError(res, error, 'Error searching IKM data');
    }
});

// Get specific service data
app.get('/api/:service', async (req, res) => {
    try {
        const { service } = req.params;
        
        // Map service names to table names
        const tableMap = {
            'hki-merek': 'hki_merek',
            'sertifikat-halal': 'sertifikat_halal',
            'tkdn-ik': 'tkdn_ik',
            'siinas': 'siinas',
            'uji-nilai-gizi': 'uji_nilai_gizi',
            'kurasi-produk': 'kurasi_produk',
            'pelatihan-pemberdayaan': 'pelatihan_pemberdayaan'
        };
        
        const tableName = tableMap[service];
        
        if (!tableName) {
            return res.status(404).json({
                success: false,
                error: 'Service not found'
            });
        }
        
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        res.json({
            success: true,
            data: data || []
        });
        
    } catch (error) {
        handleError(res, error, `Error fetching ${req.params.service} data`);
    }
});

// Add new IKM Binaan (Admin only)
app.post('/api/ikm-binaan', async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('ikm_binaan')
            .insert(req.body)
            .select()
            .single();
        
        if (error) throw error;
        
        // Log activity
        await supabaseAdmin.from('activity_logs').insert({
            type: 'admin_activity',
            action: 'create_ikm_binaan',
            user_name: req.body.admin_user || 'Unknown',
            details: { ikm_id: data.id, nama: data.nama_lengkap },
            success: true
        });
        
        res.json({
            success: true,
            data: data
        });
        
    } catch (error) {
        handleError(res, error, 'Error creating IKM Binaan');
    }
});

// Update IKM Binaan (Admin only)
app.put('/api/ikm-binaan/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const { data, error } = await supabaseAdmin
            .from('ikm_binaan')
            .update(req.body)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        
        // Log activity
        await supabaseAdmin.from('activity_logs').insert({
            type: 'admin_activity',
            action: 'update_ikm_binaan',
            user_name: req.body.admin_user || 'Unknown',
            details: { ikm_id: id, nama: data.nama_lengkap },
            success: true
        });
        
        res.json({
            success: true,
            data: data
        });
        
    } catch (error) {
        handleError(res, error, 'Error updating IKM Binaan');
    }
});

// Delete IKM Binaan (Admin only)
app.delete('/api/ikm-binaan/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get data before deletion for recycle bin
        const { data: existingData } = await supabaseAdmin
            .from('ikm_binaan')
            .select('*')
            .eq('id', id)
            .single();
        
        // Move to recycle bin
        if (existingData) {
            await supabaseAdmin.from('recycle_bin').insert({
                table_name: 'ikm_binaan',
                record_id: id,
                data: existingData,
                deleted_by: req.body.admin_user || 'Unknown'
            });
        }
        
        // Delete from main table
        const { error } = await supabaseAdmin
            .from('ikm_binaan')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        // Log activity
        await supabaseAdmin.from('activity_logs').insert({
            type: 'admin_activity',
            action: 'delete_ikm_binaan',
            user_name: req.body.admin_user || 'Unknown',
            details: { ikm_id: id, nama: existingData?.nama_lengkap },
            success: true
        });
        
        res.json({
            success: true,
            message: 'IKM Binaan deleted successfully'
        });
        
    } catch (error) {
        handleError(res, error, 'Error deleting IKM Binaan');
    }
});

// Get website content
app.get('/api/website-content', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('website_content')
            .select('*')
            .eq('is_active', true)
            .order('section', { ascending: true });
        
        if (error) throw error;
        
        res.json({
            success: true,
            data: data || []
        });
        
    } catch (error) {
        handleError(res, error, 'Error fetching website content');
    }
});

// Buku Tamu API
app.post('/api/buku-tamu', async (req, res) => {
    try {
        const { nama_lengkap, no_hp_aktif, alamat } = req.body;
        
        if (!nama_lengkap || !no_hp_aktif || !alamat) {
            return res.status(400).json({
                success: false,
                error: 'Semua field harus diisi'
            });
        }
        
        const { data, error } = await supabaseAdmin
            .from('buku_tamu')
            .insert([{
                // New columns
                nama_lengkap,
                no_hp_aktif,
                alamat,
                tanggal_kunjungan: new Date().toISOString(),
                // Old columns (for compatibility)
                nama: nama_lengkap,
                nik: no_hp_aktif,
                waktu_akses: new Date().toISOString()
            }])
            .select();
        
        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({
                success: false,
                error: 'Gagal menyimpan data ke database',
                details: error.message
            });
        }
        
        res.json({
            success: true,
            message: 'Buku tamu berhasil disimpan',
            data: data[0]
        });
        
    } catch (error) {
        console.error('Buku tamu error:', error);
        res.status(500).json({
            success: false,
            error: 'Terjadi kesalahan saat menyimpan buku tamu',
            details: error.message
        });
    }
});

app.get('/api/buku-tamu', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('buku_tamu')
            .select('*')
            .order('tanggal_kunjungan', { ascending: false });
        
        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({
                success: false,
                error: 'Gagal mengambil data',
                details: error.message
            });
        }
        
        res.json({
            success: true,
            data: data || []
        });
        
    } catch (error) {
        console.error('Get buku tamu error:', error);
        res.status(500).json({
            success: false,
            error: 'Terjadi kesalahan saat mengambil data',
            details: error.message
        });
    }
});

// Admin Login API
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username dan password harus diisi'
            });
        }
        
        // Check admin users from Supabase
        // Note: Using password field for now (should be password_hash in production)
        const { data: adminUsers, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('username', username)
            .single();
        
        if (error || !adminUsers) {
            return res.status(401).json({
                success: false,
                message: 'Username atau password salah'
            });
        }
        
        // Check password (using both password and password_hash fields for compatibility)
        const passwordMatch = adminUsers.password === password || 
                             adminUsers.password_hash === password;
        
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Username atau password salah'
            });
        }
        
        // Update last login
        await supabaseAdmin
            .from('admin_users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', adminUsers.id);
        
        // Log login activity
        await supabaseAdmin.from('activity_logs').insert({
            type: 'admin_activity',
            action: 'login',
            user_name: adminUsers.nama,
            details: { username: username },
            success: true
        });
        
        res.json({
            success: true,
            message: 'Login berhasil',
            user: {
                id: adminUsers.id,
                username: adminUsers.username,
                nama: adminUsers.nama,
                role: adminUsers.role
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat login'
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: 'Supabase',
        version: '2.0.0'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        details: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

module.exports = app;