// Vercel Serverless Function - Health Check
module.exports = (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Health check response
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: 'Supabase',
        version: '2.0.0',
        environment: process.env.NODE_ENV || 'production',
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'missing',
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'configured' : 'missing'
    });
};