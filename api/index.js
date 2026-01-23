// Main API handler for Vercel
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

// Main handler function
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
    console.log(`🌐 API: ${method} ${url}`);
    
    try {
        // Test endpoint
        if (url === '/api' || url === '/api/') {
            return res.json({
                success: true,
                message: 'API is working!',
                timestamp: new Date().toISOString()
            });
        }
        
        // Dashboard endpoint
        if (url === '/api/dashboard') {
            return await handleDashboard(req, res);
        }
        
        // Admin login endpoint
        if (url === '/api/admin/login') {
            return await handleAdminLogin(req, res);
        }
        
        // 404 for unmatched routes
        res.status(404).json({
            success: false,
            error: 'API endpoint not found',
            url: url
        });
        
    } catch (error) {
        console.error('API Error:', error);
        handleError(res, error, 'API Error');
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

// Admin login handler
async function handleAdminLogin(req, res) {
    try {
        console.log('🔐 Admin login API called');
        
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
                error: 'Username dan password harus diisi'
            });
        }
        
        // Get admin users from Supabase
        const { data: adminUser, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('username', username)
            .eq('password_hash', password)
            .single();
        
        if (error || !adminUser) {
            console.log('Login failed for username:', username);
            return res.status(401).json({
                success: false,
                error: 'Username atau password salah'
            });
        }
        
        // Update last login
        await supabase
            .from('admin_users')
            .update({ 
                last_login: new Date().toISOString()
            })
            .eq('id', adminUser.id);
        
        // Return user data (without password)
        const userData = {
            id: adminUser.id,
            username: adminUser.username,
            nama: adminUser.nama,
            role: adminUser.role,
            lastLogin: adminUser.last_login
        };
        
        console.log('Login successful for user:', userData.username);
        
        res.json({
            success: true,
            message: 'Login berhasil',
            user: userData
        });
        
    } catch (error) {
        console.error('Error during login:', error);
        handleError(res, error, 'Error during login');
    }
}