const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// ===== MIDDLEWARE CONFIGURATION =====
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 
        ['https://database-ikm-juara.vercel.app', 'https://*.vercel.app'] : 
        ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Debug middleware - log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Serve static files
app.use(express.static('shared'));
app.use('/admin', express.static('admin'));

// ===== DATA HELPER FUNCTIONS =====
const readData = (filename) => {
    try {
        const filePath = path.join(__dirname, '..', 'data', filename);
        if (!fs.existsSync(filePath)) {
            console.log(`File ${filename} not found, creating empty array`);
            return [];
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return [];
    }
};

const writeData = (filename, data) => {
    try {
        const filePath = path.join(__dirname, '..', 'data', filename);
        const dir = path.dirname(filePath);
        
        // Ensure directory exists
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`Data written to ${filename} successfully`);
        return true;
    } catch (error) {
        console.error(`Error writing ${filename}:`, error);
        return false;
    }
};

// ===== API ENDPOINTS =====

// Dashboard endpoint
app.get('/api/dashboard', (req, res) => {
    try {
        console.log('📊 Loading dashboard data...');
        
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
            lastUpdated: new Date().toISOString()
        };

        console.log('✅ Dashboard data loaded:', dashboardData);
        res.json(dashboardData);
    } catch (error) {
        console.error('❌ Dashboard error:', error);
        res.status(500).json({ 
            error: 'Failed to load dashboard data',
            message: error.message 
        });
    }
});

// Generic GET endpoint for all data types
const dataEndpoints = [
    'ikm-binaan',
    'hki-merek', 
    'sertifikat-halal',
    'tkdn-ik',
    'siinas',
    'uji-nilai-gizi',
    'kurasi-produk',
    'pelatihan-pemberdayaan',
    'activity-logs',
    'admin-users',
    'buku-tamu',
    'recycle-bin',
    'website-content'
];

dataEndpoints.forEach(endpoint => {
    // GET endpoint
    app.get(`/api/${endpoint}`, (req, res) => {
        try {
            console.log(`📊 Loading ${endpoint} data...`);
            
            const filename = endpoint + '.json';
            const data = readData(filename);
            
            console.log(`✅ ${endpoint} data loaded: ${data.length} records`);
            
            // Return data in consistent format
            res.json({
                success: true,
                data: data,
                count: data.length,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error(`❌ ${endpoint} GET error:`, error);
            res.status(500).json({ 
                success: false,
                error: `Failed to load ${endpoint} data`,
                message: error.message 
            });
        }
    });
    
    // POST endpoint
    app.post(`/api/${endpoint}`, (req, res) => {
        try {
            console.log(`📝 Creating new ${endpoint} record...`);
            
            const filename = endpoint + '.json';
            const data = readData(filename);
            
            // Generate new ID
            const newId = data.length > 0 ? Math.max(...data.map(item => item.id || 0)) + 1 : 1;
            
            const newRecord = {
                id: newId,
                ...req.body,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            data.push(newRecord);
            
            if (writeData(filename, data)) {
                console.log(`✅ ${endpoint} record created with ID: ${newId}`);
                res.json({
                    success: true,
                    message: `${endpoint} record created successfully`,
                    data: newRecord,
                    id: newId
                });
            } else {
                throw new Error('Failed to write data');
            }
        } catch (error) {
            console.error(`❌ ${endpoint} POST error:`, error);
            res.status(500).json({ 
                success: false,
                error: `Failed to create ${endpoint} record`,
                message: error.message 
            });
        }
    });
    
    // PUT endpoint
    app.put(`/api/${endpoint}/:id`, (req, res) => {
        try {
            const id = parseInt(req.params.id);
            console.log(`📝 Updating ${endpoint} record ID: ${id}...`);
            
            const filename = endpoint + '.json';
            const data = readData(filename);
            
            const index = data.findIndex(item => item.id === id);
            if (index === -1) {
                return res.status(404).json({
                    success: false,
                    error: `${endpoint} record not found`,
                    id: id
                });
            }
            
            data[index] = {
                ...data[index],
                ...req.body,
                id: id, // Preserve ID
                updatedAt: new Date().toISOString()
            };
            
            if (writeData(filename, data)) {
                console.log(`✅ ${endpoint} record updated: ${id}`);
                res.json({
                    success: true,
                    message: `${endpoint} record updated successfully`,
                    data: data[index]
                });
            } else {
                throw new Error('Failed to write data');
            }
        } catch (error) {
            console.error(`❌ ${endpoint} PUT error:`, error);
            res.status(500).json({ 
                success: false,
                error: `Failed to update ${endpoint} record`,
                message: error.message 
            });
        }
    });
    
    // DELETE endpoint
    app.delete(`/api/${endpoint}/:id`, (req, res) => {
        try {
            const id = parseInt(req.params.id);
            console.log(`🗑️ Deleting ${endpoint} record ID: ${id}...`);
            
            const filename = endpoint + '.json';
            const data = readData(filename);
            
            const index = data.findIndex(item => item.id === id);
            if (index === -1) {
                return res.status(404).json({
                    success: false,
                    error: `${endpoint} record not found`,
                    id: id
                });
            }
            
            const deletedRecord = data.splice(index, 1)[0];
            
            if (writeData(filename, data)) {
                console.log(`✅ ${endpoint} record deleted: ${id}`);
                res.json({
                    success: true,
                    message: `${endpoint} record deleted successfully`,
                    data: deletedRecord
                });
            } else {
                throw new Error('Failed to write data');
            }
        } catch (error) {
            console.error(`❌ ${endpoint} DELETE error:`, error);
            res.status(500).json({ 
                success: false,
                error: `Failed to delete ${endpoint} record`,
                message: error.message 
            });
        }
    });
});

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(`🔐 Admin login attempt: ${username}`);
        
        const adminUsers = readData('admin-users.json');
        const user = adminUsers.find(u => u.username === username && u.password === password);
        
        if (user) {
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
        } else {
            console.log(`❌ Admin login failed: ${username}`);
            res.status(401).json({
                success: false,
                error: 'Username atau password salah'
            });
        }
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Login failed',
            message: error.message 
        });
    }
});

// Export endpoints
app.get('/api/export/:dataType/excel', (req, res) => {
    const { dataType } = req.params;
    console.log(`📤 Export ${dataType} to Excel requested`);
    
    // For now, return a placeholder response
    res.json({
        success: true,
        message: `Export ${dataType} to Excel feature will be implemented`,
        downloadUrl: `/downloads/${dataType}_${Date.now()}.xlsx`
    });
});

app.get('/api/export/:dataType/pdf', (req, res) => {
    const { dataType } = req.params;
    console.log(`📤 Export ${dataType} to PDF requested`);
    
    // For now, return a placeholder response
    res.json({
        success: true,
        message: `Export ${dataType} to PDF feature will be implemented`,
        downloadUrl: `/downloads/${dataType}_${Date.now()}.pdf`
    });
});

// Template download endpoints
app.get('/api/template/:dataType', (req, res) => {
    const { dataType } = req.params;
    console.log(`📥 Template ${dataType} download requested`);
    
    // For now, return a placeholder response
    res.json({
        success: true,
        message: `Template ${dataType} download feature will be implemented`,
        downloadUrl: `/templates/template_${dataType}.xlsx`
    });
});

// Import endpoints
app.post('/api/import/:dataType', (req, res) => {
    const { dataType } = req.params;
    console.log(`📥 Import ${dataType} from Excel requested`);
    
    // For now, return a placeholder response
    res.json({
        success: true,
        message: `Import ${dataType} feature will be implemented`,
        imported: 0,
        skipped: 0,
        errors: []
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '3.0.0'
    });
});

// Catch-all for undefined API routes
app.use('/api/*', (req, res) => {
    console.log(`❌ API endpoint not found: ${req.method} ${req.url}`);
    res.status(404).json({
        success: false,
        error: 'API endpoint not found',
        method: req.method,
        url: req.url
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        success: false,
        error: 'Internal server error',
        message: err.message,
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
🚀 IKM JUARA Server Started Successfully!
📍 Server running on: http://localhost:${PORT}
📊 Dashboard: http://localhost:${PORT}/admin/index-fixed.html
🔐 Login: http://localhost:${PORT}/admin/login.html
📚 API Health: http://localhost:${PORT}/api/health
⏰ Started at: ${new Date().toISOString()}
    `);
    
    // Test data files on startup
    console.log('\n📋 Checking data files...');
    dataEndpoints.forEach(endpoint => {
        const filename = endpoint + '.json';
        const data = readData(filename);
        console.log(`   ${filename}: ${data.length} records`);
    });
    console.log('✅ Data files check completed\n');
});

module.exports = app;