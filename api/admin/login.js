// Admin login API endpoint for Vercel
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://krylvwwguczwwoyqghlc.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeWx2d3dndWN6d3dveXFnaGxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA1ODg0MSwiZXhwIjoyMDg0NjM0ODQxfQ.ysubAuDeIPshMww709q092yI37j1wZUIwK5vQttUsmE';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
    
    console.log('🔐 Admin login API called');
    
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
        res.status(500).json({
            success: false,
            error: 'Error during login',
            details: error.message
        });
    }
};