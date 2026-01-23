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
    
    const { url, method, query } = req;
    console.log(`🌐 API: ${method} ${url}`);
    
    try {
        // Parse URL path
        const path = url.replace('/api', '') || '/';
        
        // Test endpoint
        if (path === '/' || path === '') {
            return res.json({
                success: true,
                message: 'API is working!',
                timestamp: new Date().toISOString()
            });
        }
        
        // Dashboard endpoint
        if (path === '/dashboard') {
            return await handleDashboard(req, res);
        }
        
        // Admin login endpoint - handle both /admin/login and /login
        if (path === '/admin/login' || path === '/login') {
            return await handleAdminLogin(req, res);
        }
        
        // IKM Binaan endpoints
        if (path === '/ikm-binaan') {
            if (method === 'GET') {
                return await handleGetIkmBinaan(req, res);
            } else if (method === 'POST') {
                return await handleCreateIkmBinaan(req, res);
            }
        }
        
        if (path.startsWith('/ikm-binaan/') && method === 'GET') {
            const id = path.split('/')[2];
            return await handleGetIkmBinaanById(req, res, id);
        }
        
        if (path.startsWith('/ikm-binaan/') && method === 'PUT') {
            const id = path.split('/')[2];
            return await handleUpdateIkmBinaan(req, res, id);
        }
        
        if (path.startsWith('/ikm-binaan/') && method === 'DELETE') {
            const id = path.split('/')[2];
            return await handleDeleteIkmBinaan(req, res, id);
        }
        
        // 404 for unmatched routes
        res.status(404).json({
            success: false,
            error: 'API endpoint not found',
            path: path,
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

// Get IKM Binaan data
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

// Get IKM Binaan by ID
async function handleGetIkmBinaanById(req, res, id) {
    try {
        const { data, error } = await supabase
            .from('ikm_binaan')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        
        res.json({
            success: true,
            data: data
        });
        
    } catch (error) {
        handleError(res, error, 'Error fetching IKM Binaan by ID');
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

// Update IKM Binaan
async function handleUpdateIkmBinaan(req, res, id) {
    try {
        const data = req.body;
        delete data.id; // Remove ID from update data
        
        const { data: updatedData, error } = await supabase
            .from('ikm_binaan')
            .update(data)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        
        res.json({
            success: true,
            message: 'IKM Binaan berhasil diupdate',
            data: updatedData
        });
        
    } catch (error) {
        handleError(res, error, 'Error updating IKM Binaan');
    }
}

// Delete IKM Binaan
async function handleDeleteIkmBinaan(req, res, id) {
    try {
        // Get data before deletion for recycle bin
        const { data: existingData } = await supabase
            .from('ikm_binaan')
            .select('*')
            .eq('id', id)
            .single();
        
        // Move to recycle bin (if table exists)
        if (existingData) {
            try {
                await supabase.from('recycle_bin').insert({
                    table_name: 'ikm_binaan',
                    record_id: id,
                    data: existingData,
                    deleted_by: req.headers['x-user'] || 'Unknown',
                    deleted_at: new Date().toISOString()
                });
            } catch (recycleError) {
                console.log('Recycle bin not available:', recycleError.message);
            }
        }
        
        // Delete from main table
        const { error } = await supabase
            .from('ikm_binaan')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        res.json({
            success: true,
            message: 'IKM Binaan berhasil dihapus'
        });
        
    } catch (error) {
        handleError(res, error, 'Error deleting IKM Binaan');
    }
}