// ===== IKM JUARA API - FIXED VERSION FOR VERCEL =====
// Versi: 3.0 - Complete Data Display Fix
// Tanggal: 23 Januari 2026

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration - use environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://krylvwwguczwwoyqghlc.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeWx2d3dndWN6d3dveXFnaGxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNTg4NDEsImV4cCI6MjA4NDYzNDg0MX0.ikuvFZB4zjChsh-cM2MMMYYmWYTfC-P67gQZPBvCZqA';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeWx2d3dndWN6d3dveXFnaGxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA1ODg0MSwiZXhwIjoyMDg0NjM0ODQxfQ.ysubAuDeIPshMww709q092yI37j1wZUIwK5vQttUsmE';

console.log('🔧 Vercel API Fixed - Supabase URL:', supabaseUrl);
console.log('🔧 Vercel API Fixed - Service Key exists:', !!supabaseServiceKey);

// Create Supabase clients
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Helper function untuk error handling
const handleError = (res, error, message = 'Internal server error') => {
    console.error(message, error);
    res.status(500).json({
        success: false,
        error: message,
        details: error.message
    });
};

// Data mapping untuk table names
const tableMapping = {
    'ikm-binaan': 'ikm_binaan',
    'hki-merek': 'hki_merek',
    'sertifikat-halal': 'sertifikat_halal',
    'tkdn-ik': 'tkdn_ik',
    'siinas': 'siinas',
    'uji-nilai-gizi': 'uji_nilai_gizi',
    'kurasi-produk': 'kurasi_produk',
    'pelatihan-pemberdayaan': 'pelatihan_pemberdayaan',
    'activity-logs': 'activity_logs',
    'admin-users': 'admin_users',
    'buku-tamu': 'buku_tamu',
    'recycle-bin': 'recycle_bin',
    'website-content': 'website_content'
};

// Field mapping untuk camelCase conversion
const convertSnakeToCamel = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(convertSnakeToCamel);
    } else if (obj !== null && typeof obj === 'object') {
        const converted = {};
        for (const [key, value] of Object.entries(obj)) {
            const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
            converted[camelKey] = convertSnakeToCamel(value);
        }
        return converted;
    }
    return obj;
};

const convertCamelToSnake = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(convertCamelToSnake);
    } else if (obj !== null && typeof obj === 'object') {
        const converted = {};
        for (const [key, value] of Object.entries(obj)) {
            const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
            converted[snakeKey] = convertCamelToSnake(value);
        }
        return converted;
    }
    return obj;
};

// Dashboard handler
const handleDashboard = async (req, res) => {
    try {
        console.log('📊 Loading dashboard data from Supabase...');
        
        const tables = Object.values(tableMapping);
        const counts = {};
        
        // Get counts for each table
        for (const table of tables) {
            try {
                const { count, error } = await supabaseAdmin
                    .from(table)
                    .select('*', { count: 'exact', head: true });
                
                if (error) {
                    console.warn(`Warning: Could not get count for ${table}:`, error.message);
                    counts[table] = 0;
                } else {
                    counts[table] = count || 0;
                }
            } catch (err) {
                console.warn(`Warning: Error counting ${table}:`, err.message);
                counts[table] = 0;
            }
        }
        
        // Calculate total participants from pelatihan
        let totalPesertaPelatihan = 0;
        try {
            const { data: pelatihanData, error } = await supabaseAdmin
                .from('pelatihan_pemberdayaan')
                .select('peserta');
            
            if (!error && pelatihanData) {
                pelatihanData.forEach(pelatihan => {
                    if (pelatihan.peserta && Array.isArray(pelatihan.peserta)) {
                        totalPesertaPelatihan += pelatihan.peserta.length;
                    }
                });
            }
        } catch (err) {
            console.warn('Warning: Could not calculate total participants:', err.message);
        }
        
        const dashboardData = {
            ikmBinaan: counts.ikm_binaan || 0,
            hkiMerek: counts.hki_merek || 0,
            sertifikatHalal: counts.sertifikat_halal || 0,
            tkdnIk: counts.tkdn_ik || 0,
            siinas: counts.siinas || 0,
            ujiNilaiGizi: counts.uji_nilai_gizi || 0,
            kurasiProduk: counts.kurasi_produk || 0,
            pelatihanPemberdayaan: counts.pelatihan_pemberdayaan || 0,
            totalPesertaPelatihan: totalPesertaPelatihan,
            lastUpdated: new Date().toISOString()
        };
        
        console.log('✅ Dashboard data loaded:', dashboardData);
        res.json(dashboardData);
    } catch (error) {
        console.error('❌ Dashboard error:', error);
        handleError(res, error, 'Failed to load dashboard data');
    }
};

// Generic data handler
const handleDataEndpoint = async (req, res, endpoint) => {
    const tableName = tableMapping[endpoint];
    
    if (!tableName) {
        return res.status(404).json({
            success: false,
            error: `Endpoint ${endpoint} not found`
        });
    }
    
    try {
        if (req.method === 'GET') {
            console.log(`📊 Loading ${endpoint} data from Supabase...`);
            
            const { data, error } = await supabaseAdmin
                .from(tableName)
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) {
                throw error;
            }
            
            // Convert snake_case to camelCase for frontend compatibility
            const convertedData = convertSnakeToCamel(data || []);
            
            console.log(`✅ ${endpoint} data loaded: ${convertedData.length} records`);
            
            res.json({
                success: true,
                data: convertedData,
                count: convertedData.length,
                timestamp: new Date().toISOString()
            });
            
        } else if (req.method === 'POST') {
            console.log(`📝 Creating new ${endpoint} record...`);
            
            // Convert camelCase to snake_case for database
            const convertedBody = convertCamelToSnake(req.body);
            
            const { data, error } = await supabaseAdmin
                .from(tableName)
                .insert([{
                    ...convertedBody,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select()
                .single();
            
            if (error) {
                throw error;
            }
            
            // Convert back to camelCase
            const convertedData = convertSnakeToCamel(data);
            
            console.log(`✅ ${endpoint} record created with ID: ${data.id}`);
            
            res.json({
                success: true,
                message: `${endpoint} record created successfully`,
                data: convertedData,
                id: data.id
            });
            
        } else if (req.method === 'PUT') {
            const id = req.query.id || req.body.id;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    error: 'ID is required for update'
                });
            }
            
            console.log(`📝 Updating ${endpoint} record ID: ${id}...`);
            
            // Convert camelCase to snake_case for database
            const convertedBody = convertCamelToSnake(req.body);
            delete convertedBody.id; // Don't update ID
            
            const { data, error } = await supabaseAdmin
                .from(tableName)
                .update({
                    ...convertedBody,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();
            
            if (error) {
                throw error;
            }
            
            // Convert back to camelCase
            const convertedData = convertSnakeToCamel(data);
            
            console.log(`✅ ${endpoint} record updated: ${id}`);
            
            res.json({
                success: true,
                message: `${endpoint} record updated successfully`,
                data: convertedData
            });
            
        } else if (req.method === 'DELETE') {
            const id = req.query.id;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    error: 'ID is required for delete'
                });
            }
            
            console.log(`🗑️ Deleting ${endpoint} record ID: ${id}...`);
            
            const { data, error } = await supabaseAdmin
                .from(tableName)
                .delete()
                .eq('id', id)
                .select()
                .single();
            
            if (error) {
                throw error;
            }
            
            // Convert back to camelCase
            const convertedData = convertSnakeToCamel(data);
            
            console.log(`✅ ${endpoint} record deleted: ${id}`);
            
            res.json({
                success: true,
                message: `${endpoint} record deleted successfully`,
                data: convertedData
            });
        }
        
    } catch (error) {
        console.error(`❌ ${endpoint} ${req.method} error:`, error);
        handleError(res, error, `Failed to ${req.method.toLowerCase()} ${endpoint} data`);
    }
};

// Admin login handler
const handleAdminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(`🔐 Admin login attempt: ${username}`);
        
        const { data: users, error } = await supabaseAdmin
            .from('admin_users')
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .single();
        
        if (error || !users) {
            console.log(`❌ Admin login failed: ${username}`);
            return res.status(401).json({
                success: false,
                error: 'Username atau password salah'
            });
        }
        
        // Convert to camelCase
        const user = convertSnakeToCamel(users);
        
        console.log(`✅ Admin login successful: ${username}`);
        res.json({
            success: true,
            message: 'Login berhasil',
            user: {
                id: user.id,
                username: user.username,
                nama: user.nama,
                role: user.role
            }
        });
        
    } catch (error) {
        console.error('❌ Login error:', error);
        handleError(res, error, 'Login failed');
    }
};

// Main handler function for Vercel
module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    const { url, method } = req;
    const path = url.replace('/api', '');
    
    console.log(`🌐 Vercel API Fixed: ${method} ${path}`);
    
    try {
        // Health check
        if (path === '/health') {
            return res.json({
                status: 'OK',
                timestamp: new Date().toISOString(),
                version: '3.0.0',
                supabase: 'Connected'
            });
        }
        
        // Dashboard endpoint
        if (path === '/dashboard') {
            return await handleDashboard(req, res);
        }
        
        // Admin login endpoint
        if (path === '/admin/login' && method === 'POST') {
            return await handleAdminLogin(req, res);
        }
        
        // Data endpoints
        const dataEndpoints = Object.keys(tableMapping);
        for (const endpoint of dataEndpoints) {
            if (path === `/${endpoint}`) {
                return await handleDataEndpoint(req, res, endpoint);
            }
        }
        
        // Export endpoints (placeholder)
        if (path.startsWith('/export/')) {
            const parts = path.split('/');
            const dataType = parts[2];
            const format = parts[3];
            
            return res.json({
                success: true,
                message: `Export ${dataType} to ${format} feature will be implemented`,
                downloadUrl: `/downloads/${dataType}_${Date.now()}.${format}`
            });
        }
        
        // Template endpoints (placeholder)
        if (path.startsWith('/template/')) {
            const dataType = path.split('/')[2];
            
            return res.json({
                success: true,
                message: `Template ${dataType} download feature will be implemented`,
                downloadUrl: `/templates/template_${dataType}.xlsx`
            });
        }
        
        // Import endpoints (placeholder)
        if (path.startsWith('/import/')) {
            const dataType = path.split('/')[2];
            
            return res.json({
                success: true,
                message: `Import ${dataType} feature will be implemented`,
                imported: 0,
                skipped: 0,
                errors: []
            });
        }
        
        // 404 for unmatched routes
        res.status(404).json({
            success: false,
            error: 'API endpoint not found',
            method: method,
            path: path,
            availableEndpoints: [
                '/health',
                '/dashboard',
                '/admin/login',
                ...dataEndpoints.map(e => `/${e}`)
            ]
        });
        
    } catch (error) {
        console.error('❌ Vercel API Error:', error);
        handleError(res, error, 'Internal server error');
    }
};