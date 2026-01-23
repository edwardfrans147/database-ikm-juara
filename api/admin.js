// Dedicated API for admin functions
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://krylvwwguczwwoyqghlc.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeWx2d3dndWN6d3dveXFnaGxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA1ODg0MSwiZXhwIjoyMDg0NjM0ODQxfQ.ysubAuDeIPshMww709q092yI37j1wZUIwK5vQttUsmE';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function untuk error handling
const handleError = (res, error, message = 'Internal server error') => {
    console.error(message, error);
    res.status(500).json({
        success: false,
        error: message,
        details: error.message
    });
};

// Main handler function for admin API
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
    const path = url.replace('/api/admin', '');
    
    console.log(`🌐 Admin API: ${method} ${path}`);
    
    try {
        // Dashboard endpoint
        if (path === '' || path === '/') {
            return await handleDashboard(req, res);
        }
        
        // Login endpoint
        if (path === '/login') {
            return await handleLogin(req, res);
        }
        
        // IKM Binaan endpoints
        if (path === '/ikm-binaan') {
            if (method === 'GET') {
                return await handleGetIkmBinaan(req, res);
            } else if (method === 'POST') {
                return await handleCreateIkmBinaan(req, res);
            }
        }
        
        // Service endpoints
        const serviceEndpoints = [
            'hki-merek', 'sertifikat-halal', 'tkdn-ik', 'siinas', 
            'uji-nilai-gizi', 'kurasi-produk', 'pelatihan-pemberdayaan'
        ];
        
        for (const service of serviceEndpoints) {
            if (path === `/${service}`) {
                if (method === 'GET') {
                    return await handleGetService(req, res, service);
                } else if (method === 'POST') {
                    return await handleCreateService(req, res, service);
                }
            }
        }
        
        // 404 for unmatched routes
        res.status(404).json({
            success: false,
            error: 'Admin endpoint not found',
            path: path
        });
        
    } catch (error) {
        console.error('Admin API Error:', error);
        handleError(res, error, 'Admin API Error');
    }
};

// Dashboard handler
async function handleDashboard(req, res) {
    try {
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
        
        res.json(dashboardData);
        
    } catch (error) {
        handleError(res, error, 'Error fetching dashboard data');
    }
}

// Login handler
async function handleLogin(req, res) {
    try {
        if (req.method !== 'POST') {
            return res.status(405).json({
                success: false,
                error: 'Method not allowed'
            });
        }
        
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username dan password harus diisi'
            });
        }
        
        // Get admin users from Supabase
        const { data: adminUsers, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('username', username)
            .eq('password_hash', password)
            .single();
        
        if (error || !adminUsers) {
            return res.status(401).json({
                success: false,
                message: 'Username atau password salah'
            });
        }
        
        // Update last login
        await supabase
            .from('admin_users')
            .update({ 
                last_login: new Date().toISOString()
            })
            .eq('id', adminUsers.id);
        
        // Return user data (without password)
        const userData = {
            id: adminUsers.id,
            username: adminUsers.username,
            nama: adminUsers.nama,
            role: adminUsers.role,
            lastLogin: adminUsers.last_login
        };
        
        res.json({
            success: true,
            message: 'Login berhasil',
            user: userData
        });
        
    } catch (error) {
        handleError(res, error, 'Error during login');
    }
}

// Get IKM Binaan
async function handleGetIkmBinaan(req, res) {
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
}

// Create IKM Binaan
async function handleCreateIkmBinaan(req, res) {
    try {
        const data = req.body;
        
        const { data: insertedData, error } = await supabase
            .from('ikm_binaan')
            .insert(data)
            .select()
            .single();
        
        if (error) throw error;
        
        res.json({
            success: true,
            message: 'IKM Binaan berhasil ditambahkan',
            data: insertedData
        });
        
    } catch (error) {
        handleError(res, error, 'Error creating IKM Binaan');
    }
}

// Get Service data
async function handleGetService(req, res, service) {
    try {
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
        
        let query = supabase.from(tableName).select('*');
        
        // For services that need IKM data, join with ikm_binaan
        if (service !== 'pelatihan-pemberdayaan') {
            query = supabase.from(tableName).select(`
                *,
                ikm_binaan!inner(
                    nib,
                    nik,
                    nama_lengkap,
                    nama_usaha,
                    nomor_hp
                )
            `);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Flatten data structure for easier frontend consumption
        let processedData = data || [];
        if (service !== 'pelatihan-pemberdayaan' && processedData.length > 0) {
            processedData = processedData.map(item => ({
                ...item,
                nib: item.ikm_binaan?.nib || '',
                nik: item.ikm_binaan?.nik || '',
                nama_lengkap: item.ikm_binaan?.nama_lengkap || item.nama_lengkap,
                nama_usaha: item.ikm_binaan?.nama_usaha || item.nama_usaha,
                nomor_hp: item.ikm_binaan?.nomor_hp || ''
            }));
        }
        
        res.json({
            success: true,
            data: processedData
        });
        
    } catch (error) {
        handleError(res, error, `Error fetching ${service} data`);
    }
}

// Create Service data
async function handleCreateService(req, res, service) {
    try {
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
        
        const data = req.body;
        
        const { data: insertedData, error } = await supabase
            .from(tableName)
            .insert(data)
            .select()
            .single();
        
        if (error) throw error;
        
        res.json({
            success: true,
            message: `Data ${service} berhasil ditambahkan`,
            data: insertedData
        });
        
    } catch (error) {
        handleError(res, error, `Error creating ${service} data`);
    }
}