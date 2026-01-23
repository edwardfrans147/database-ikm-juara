// Server yang menggunakan API Supabase
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 
        ['https://database-ikm-juara.vercel.app', 'https://*.vercel.app'] : 
        ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Debug middleware - log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Serve static files
app.use(express.static('shared'));

// Use Supabase API for all /api routes
app.use('/api', require('./api/simple-api.js'));

// Serve admin website
app.use('/admin', express.static('admin'));

// Serve public website
app.use('/public', express.static('public'));

// Root redirect to admin login
app.get('/', (req, res) => {
    res.redirect('/admin/login.html');
});

// Admin root redirect to login
app.get('/admin', (req, res) => {
    res.redirect('/admin/login.html');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: err.message,
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    console.log(`📊 Admin: http://localhost:${PORT}/admin`);
    console.log(`🌐 Public: http://localhost:${PORT}/public`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
});

module.exports = app;