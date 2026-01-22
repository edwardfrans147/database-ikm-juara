const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');
const multer = require('multer');

const app = express();
const PORT = 3000;

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Middleware dengan optimisasi performa
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 
        ['https://database-ikm-juara.vercel.app', 'https://*.vercel.app'] : 
        ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Optimisasi body parser dengan compression
app.use(bodyParser.json({ 
    limit: '10mb',
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));
app.use(bodyParser.urlencoded({ 
    extended: true, 
    limit: '10mb',
    parameterLimit: 1000
}));

// Compression middleware untuk response
const compression = require('compression');
app.use(compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) return false;
        return compression.filter(req, res);
    }
}));

// Debug middleware - log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.method === 'POST' && req.url.includes('/api/')) {
        console.log('Request body:', req.body);
    }
    next();
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

app.use(express.static('shared'));

// Activity Logging Functions
const logActivity = (activityData) => {
    try {
        const logs = readData('activity-logs.json');
        const newLog = {
            id: logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1,
            timestamp: new Date().toISOString(),
            ...activityData
        };
        logs.push(newLog);
        writeData('activity-logs.json', logs);
        console.log('Activity logged:', newLog);
    } catch (error) {
        console.error('Failed to log activity:', error);
    }
};

// Middleware to log admin activities
const logAdminActivity = (action, details = {}) => {
    return (req, res, next) => {
        const originalSend = res.send;
        res.send = function(data) {
            // Log successful operations (status 200-299)
            if (res.statusCode >= 200 && res.statusCode < 300) {
                const adminUser = req.headers.authorization || req.body.username || 'Unknown';
                logActivity({
                    type: 'admin_activity',
                    action: action,
                    user: adminUser,
                    details: {
                        ...details,
                        method: req.method,
                        url: req.originalUrl,
                        ip: req.ip || req.connection.remoteAddress,
                        userAgent: req.headers['user-agent']
                    },
                    success: true
                });
            }
            originalSend.call(this, data);
        };
        next();
    };
};

// Serve admin website
app.use('/admin', express.static('admin'));

// Serve public website with login redirect
app.use('/public', (req, res, next) => {
    // Only redirect to login if no guest session and accessing index
    if ((req.path === '/' || req.path === '/index.html') && !req.headers.cookie?.includes('guest_session')) {
        // Check if there's a guest session in localStorage (we can't check this server-side)
        // So we'll serve the index and let client-side JavaScript handle the redirect
        express.static('public')(req, res, next);
    } else {
        express.static('public')(req, res, next);
    }
});

// Root redirect to admin login
app.get('/', (req, res) => {
    res.redirect('/admin/login.html');
});

// Admin root redirect to login
app.get('/admin', (req, res) => {
    res.redirect('/admin/login.html');
});

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
    
    // Cleanup old cache entries
    if (cache.size > 100) {
        const oldestKey = cache.keys().next().value;
        cache.delete(oldestKey);
    }
};

// Optimisasi fungsi readData dengan caching
const readData = (filename) => {
    const cacheKey = `file_${filename}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;
    
    try {
        const filePath = path.join(__dirname, '..', 'data', filename);
        if (!fs.existsSync(filePath)) {
            const emptyData = [];
            writeData(filename, emptyData);
            return emptyData;
        }
        
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        setCachedData(cacheKey, data);
        return data;
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return [];
    }
};

// Optimisasi fungsi writeData dengan cache invalidation
const writeData = (filename, data) => {
    try {
        const filePath = path.join(__dirname, '..', 'data', filename);
        const dir = path.dirname(filePath);
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // Write dengan atomic operation
        const tempPath = filePath + '.tmp';
        fs.writeFileSync(tempPath, JSON.stringify(data, null, 2));
        fs.renameSync(tempPath, filePath);
        
        // Invalidate cache
        const cacheKey = `file_${filename}`;
        cache.delete(cacheKey);
        
        console.log(`Data written to ${filename} successfully`);
        return true;
    } catch (error) {
        console.error(`Error writing ${filename}:`, error);
        return false;
    }
};

// Optimisasi dashboard dengan caching
app.get('/api/dashboard', (req, res) => {
    const cacheKey = 'dashboard_stats';
    const cached = getCachedData(cacheKey);
    
    if (cached) {
        return res.json(cached);
    }
    
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
    
    // Cache untuk 2 menit
    setCachedData(cacheKey, dashboardData);
    res.json(dashboardData);
});

// Login API
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const adminUsers = readData('admin-users.json');
    
    const user = adminUsers.find(u => u.username === username && u.password === password);
    if (user) {
        // Update last login
        user.lastLogin = new Date().toISOString();
        writeData('admin-users.json', adminUsers);
        
        // Log successful login
        logActivity({
            type: 'admin_activity',
            action: 'login',
            user: username,
            details: {
                userId: user.id,
                userName: user.nama,
                role: user.role,
                ip: req.ip || req.connection.remoteAddress,
                userAgent: req.headers['user-agent']
            },
            success: true
        });
        
        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                nama: user.nama,
                role: user.role
            }
        });
    } else {
        // Log failed login attempt
        logActivity({
            type: 'admin_activity',
            action: 'login_failed',
            user: username,
            details: {
                ip: req.ip || req.connection.remoteAddress,
                userAgent: req.headers['user-agent'],
                reason: 'Invalid credentials'
            },
            success: false
        });
        
        res.status(401).json({ success: false, message: 'Username atau password salah' });
    }
});

// Buku Tamu API
app.post('/api/buku-tamu', (req, res) => {
    const bukuTamu = readData('buku-tamu.json');
    const newEntry = {
        id: bukuTamu.length > 0 ? Math.max(...bukuTamu.map(d => d.id)) + 1 : 1,
        ...req.body,
        waktuAkses: new Date().toISOString(),
        ipAddress: req.ip || req.connection.remoteAddress
    };
    bukuTamu.push(newEntry);
    writeData('buku-tamu.json', bukuTamu);
    res.status(201).json({ success: true, message: 'Buku tamu berhasil disimpan' });
});

// Validasi NIB/NIK
app.post('/api/validate-nib-nik', (req, res) => {
    const { nib, nik, excludeId } = req.body;
    const ikmBinaan = readData('ikm-binaan.json');
    
    const existingNIB = ikmBinaan.find(ikm => ikm.nib === nib && ikm.id !== excludeId);
    const existingNIK = ikmBinaan.find(ikm => ikm.nik === nik && ikm.id !== excludeId);
    
    res.json({
        nibExists: !!existingNIB,
        nikExists: !!existingNIK,
        nibData: existingNIB || null,
        nikData: existingNIK || null
    });
});

// Pencarian IKM Binaan
app.post('/api/search-ikm', (req, res) => {
    const { query } = req.body;
    const ikmBinaan = readData('ikm-binaan.json');
    
    const result = ikmBinaan.find(ikm => 
        ikm.nib === query || 
        ikm.nik === query || 
        ikm.namaLengkap.toLowerCase().includes(query.toLowerCase())
    );
    
    // Log search activity
    logActivity({
        type: 'public_search',
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
        // Get all related data
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
});

// Export Excel API (Using ExcelJS for real .xlsx files)
app.get('/api/export/:dataType/excel', async (req, res) => {
    try {
        const { dataType } = req.params;
        const data = readData(`${dataType}.json`);
        
        if (data.length === 0) {
            return res.status(404).json({ error: 'No data found' });
        }
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(dataType.toUpperCase());
        
        // Define columns based on data type
        let columns = [];
        let title = '';
        
        switch (dataType) {
            case 'ikm-binaan':
                title = 'Data IKM Binaan';
                columns = [
                    { header: 'No. NIB', key: 'nib', width: 15 },
                    { header: 'No. NIK', key: 'nik', width: 20 },
                    { header: 'Nama Lengkap', key: 'namaLengkap', width: 25 },
                    { header: 'Alamat Lengkap', key: 'alamatLengkap', width: 40 },
                    { header: 'Nama Usaha', key: 'namaUsaha', width: 25 },
                    { header: 'Nomor HP', key: 'nomorHP', width: 15 }
                ];
                break;
            case 'hki-merek':
                title = 'Data HKI Merek';
                columns = [
                    { header: 'Nama Lengkap', key: 'namaLengkap', width: 25 },
                    { header: 'Nama Usaha', key: 'namaUsaha', width: 25 },
                    { header: 'No. Pendaftaran HKI', key: 'nomorPendaftaranHKI', width: 20 },
                    { header: 'Status Sertifikat', key: 'statusSertifikat', width: 15 },
                    { header: 'Tahun Fasilitasi', key: 'tahunFasilitasi', width: 15 },
                    { header: 'Link Bukti Daftar', key: 'linkBuktiDaftar', width: 30 },
                    { header: 'Link Sertifikat HKI', key: 'linkSertifikatHKI', width: 30 }
                ];
                break;
            case 'sertifikat-halal':
                title = 'Data Sertifikat Halal';
                columns = [
                    { header: 'Nama Lengkap', key: 'namaLengkap', width: 25 },
                    { header: 'Nama Usaha', key: 'namaUsaha', width: 25 },
                    { header: 'No. Sertifikat Halal', key: 'nomorSertifikatHalal', width: 20 },
                    { header: 'Tahun Fasilitasi', key: 'tahunFasilitasi', width: 15 },
                    { header: 'Link Sertifikat Halal', key: 'linkSertifikatHalal', width: 30 }
                ];
                break;
            case 'tkdn-ik':
                title = 'Data TKDN IK';
                columns = [
                    { header: 'Nama Lengkap', key: 'namaLengkap', width: 25 },
                    { header: 'Nama Usaha', key: 'namaUsaha', width: 25 },
                    { header: 'No. Sertifikat TKDN', key: 'nomorSertifikatTKDN', width: 20 },
                    { header: 'Tahun Terbit Sertifikat', key: 'tahunTerbitSertifikat', width: 15 },
                    { header: 'Link Sertifikat TKDN', key: 'linkSertifikatTKDN', width: 30 }
                ];
                break;
            case 'siinas':
                title = 'Data SIINas';
                columns = [
                    { header: 'Nama Lengkap', key: 'namaLengkap', width: 25 },
                    { header: 'Nama Usaha', key: 'namaUsaha', width: 25 },
                    { header: 'No. Bukti Kepemilikan', key: 'nomorBuktiKepemilikan', width: 20 },
                    { header: 'Tahun Registrasi', key: 'tahunRegistrasi', width: 15 },
                    { header: 'Link Bukti Kepemilikan', key: 'linkBuktiKepemilikan', width: 30 }
                ];
                break;
            case 'uji-nilai-gizi':
                title = 'Data Uji Nilai Gizi';
                columns = [
                    { header: 'Nama Lengkap', key: 'namaLengkap', width: 25 },
                    { header: 'Nama Usaha', key: 'namaUsaha', width: 25 },
                    { header: 'No. LHU', key: 'nomorLHU', width: 20 },
                    { header: 'Tanggal Hasil Uji', key: 'tanggalHasilUji', width: 15 },
                    { header: 'Tahun Fasilitasi', key: 'tahunFasilitasi', width: 15 },
                    { header: 'Link LHU', key: 'linkLHU', width: 30 }
                ];
                break;
            case 'kurasi-produk':
                title = 'Data Kurasi Produk';
                columns = [
                    { header: 'Nama Lengkap', key: 'namaLengkap', width: 25 },
                    { header: 'Nama Usaha', key: 'namaUsaha', width: 25 },
                    { header: 'No. Sertifikat Kurasi', key: 'nomorSertifikatKurasi', width: 20 },
                    { header: 'Tahun Kurasi', key: 'tahunKurasi', width: 15 },
                    { header: 'Link Sertifikat Kurasi', key: 'linkSertifikatKurasi', width: 30 }
                ];
                break;
            case 'pelatihan-pemberdayaan':
                title = 'Data Pelatihan Pemberdayaan';
                columns = [
                    { header: 'Judul Pelatihan', key: 'judulPelatihan', width: 30 },
                    { header: 'Tanggal Mulai', key: 'tanggalMulai', width: 15 },
                    { header: 'Tanggal Selesai', key: 'tanggalSelesai', width: 15 },
                    { header: 'Lokasi', key: 'lokasi', width: 25 },
                    { header: 'Instruktur', key: 'instruktur', width: 20 },
                    { header: 'Kuota', key: 'kuota', width: 10 },
                    { header: 'Jumlah Peserta', key: 'jumlahPeserta', width: 15 },
                    { header: 'Status', key: 'status', width: 15 }
                ];
                break;
        }
        
        worksheet.columns = columns;
        
        // Add title row
        worksheet.insertRow(1, [title]);
        worksheet.mergeCells('A1:' + String.fromCharCode(64 + columns.length) + '1');
        worksheet.getCell('A1').font = { bold: true, size: 16 };
        worksheet.getCell('A1').alignment = { horizontal: 'center' };
        
        // Add empty row
        worksheet.insertRow(2, []);
        
        // Style header row (row 3)
        const headerRow = worksheet.getRow(3);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };
        
        // Add data
        data.forEach(item => {
            const rowData = {};
            columns.forEach(col => {
                if (col.key === 'jumlahPeserta' && item.peserta) {
                    rowData[col.key] = item.peserta.length;
                } else if (col.key.includes('tanggal') && item[col.key]) {
                    rowData[col.key] = new Date(item[col.key]).toLocaleDateString('id-ID');
                } else {
                    rowData[col.key] = item[col.key] || '';
                }
            });
            worksheet.addRow(rowData);
        });
        
        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx"`);
        
        // Write to response
        await workbook.xlsx.write(res);
        res.end();
        
        // Log export activity
        logActivity({
            type: 'admin_activity',
            action: 'export_data',
            user: req.headers['x-user'] || 'Unknown Admin',
            details: {
                dataType: dataType,
                format: 'excel',
                recordCount: data.length,
                filename: `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`,
                ip: req.ip || req.connection.remoteAddress
            },
            success: true
        });
        
    } catch (error) {
        console.error('Export Excel error:', error);
        res.status(500).json({ error: 'Failed to export Excel' });
    }
});

// Export PDF API (Simplified version without Puppeteer)
app.get('/api/export/:dataType/pdf', async (req, res) => {
    try {
        const { dataType } = req.params;
        const data = readData(`${dataType}.json`);
        
        if (data.length === 0) {
            return res.status(404).json({ error: 'No data found' });
        }
        
        // For now, return HTML that can be printed as PDF
        let title = '';
        let headers = [];
        
        switch (dataType) {
            case 'ikm-binaan':
                title = 'Data IKM Binaan';
                headers = ['No. NIB', 'No. NIK', 'Nama Lengkap', 'Nama Usaha', 'Nomor HP'];
                break;
            case 'hki-merek':
                title = 'Data HKI Merek';
                headers = ['Nama Lengkap', 'Nama Usaha', 'Nama Merek', 'Kelas Merek', 'Status'];
                break;
            // Add other data types as needed
            default:
                title = dataType.toUpperCase();
                if (data.length > 0) {
                    headers = Object.keys(data[0]).filter(key => !['id', 'createdAt', 'updatedAt'].includes(key));
                }
        }
        
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { text-align: center; color: #333; margin-bottom: 30px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 10px; }
                th { background-color: #f2f2f2; font-weight: bold; }
                tr:nth-child(even) { background-color: #f9f9f9; }
                .export-date { text-align: right; font-size: 12px; color: #666; margin-bottom: 20px; }
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="export-date">Diekspor pada: ${new Date().toLocaleDateString('id-ID', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}</div>
            <h1>${title}</h1>
            <div class="no-print" style="margin-bottom: 20px;">
                <button onclick="window.print()" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
                    Print / Save as PDF
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        ${headers.map(header => `<th>${header}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${data.map((item, index) => {
                        let rowData = [];
                        switch (dataType) {
                            case 'ikm-binaan':
                                rowData = [item.nib, item.nik, item.namaLengkap, item.namaUsaha, item.nomorHP];
                                break;
                            case 'hki-merek':
                                rowData = [item.namaLengkap, item.namaUsaha, item.namaMerek, item.kelasMerek, item.status];
                                break;
                            default:
                                rowData = headers.map(header => item[header] || '');
                        }
                        return `<tr>
                            <td>${index + 1}</td>
                            ${rowData.map(cell => `<td>${cell || ''}</td>`).join('')}
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </body>
        </html>`;
        
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(htmlContent);
        
    } catch (error) {
        console.error('Export PDF error:', error);
        res.status(500).json({ error: 'Failed to export PDF' });
    }
});

// Import Excel API (Full implementation with ExcelJS)
app.post('/api/import/ikm-binaan', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(req.file.path);
        
        const worksheet = workbook.getWorksheet(1);
        const data = [];
        const errors = [];
        
        // Skip header rows (data starts from row 10 based on template)
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber >= 10) { // Skip title, instructions, and header
                const rowData = {
                    nib: row.getCell(1).value?.toString().trim() || '',
                    nik: row.getCell(2).value?.toString().trim() || '',
                    namaLengkap: row.getCell(3).value?.toString().trim() || '',
                    alamatLengkap: row.getCell(4).value?.toString().trim() || '',
                    namaUsaha: row.getCell(5).value?.toString().trim() || '',
                    nomorHP: row.getCell(6).value?.toString().trim() || ''
                };
                
                // Skip empty rows
                if (!rowData.nib && !rowData.nik && !rowData.namaLengkap) {
                    return;
                }
                
                // Validate required fields
                if (!rowData.nib || !rowData.nik || !rowData.namaLengkap || !rowData.namaUsaha) {
                    errors.push(`Baris ${rowNumber}: Data tidak lengkap (NIB, NIK, Nama Lengkap, dan Nama Usaha wajib diisi)`);
                    return;
                }
                
                // Validate NIB format
                if (rowData.nib.length !== 13 || !/^\d{13}$/.test(rowData.nib)) {
                    errors.push(`Baris ${rowNumber}: NIB harus 13 digit angka (${rowData.nib})`);
                    return;
                }
                
                // Validate NIK format
                if (rowData.nik.length !== 16 || !/^\d{16}$/.test(rowData.nik)) {
                    errors.push(`Baris ${rowNumber}: NIK harus 16 digit angka (${rowData.nik})`);
                    return;
                }
                
                data.push(rowData);
            }
        });
        
        if (errors.length > 0) {
            // Clean up uploaded file
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ errors });
        }
        
        if (data.length === 0) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ errors: ['Tidak ada data valid yang ditemukan dalam file'] });
        }
        
        // Check for duplicates within the uploaded data
        const nibSet = new Set();
        const nikSet = new Set();
        const internalDuplicates = [];
        const validDataAfterInternal = [];
        
        data.forEach((item, index) => {
            let isDuplicate = false;
            
            if (nibSet.has(item.nib)) {
                internalDuplicates.push({
                    row: index + 10,
                    data: item,
                    reason: `NIB ${item.nib} duplikat dalam file`,
                    existingData: null
                });
                isDuplicate = true;
            } else {
                nibSet.add(item.nib);
            }
            
            if (nikSet.has(item.nik)) {
                internalDuplicates.push({
                    row: index + 10,
                    data: item,
                    reason: `NIK ${item.nik} duplikat dalam file`,
                    existingData: null
                });
                isDuplicate = true;
            } else {
                nikSet.add(item.nik);
            }
            
            if (!isDuplicate) {
                validDataAfterInternal.push(item);
            }
        });
        
        // Check for duplicates with existing data
        const existingData = readData('ikm-binaan.json');
        const duplicateData = [...internalDuplicates]; // Start with internal duplicates
        const validData = [];
        
        validDataAfterInternal.forEach((item, index) => {
            const existingNIB = existingData.find(existing => existing.nib === item.nib);
            const existingNIK = existingData.find(existing => existing.nik === item.nik);
            
            if (existingNIB || existingNIK) {
                // Find original row number from data array
                const originalIndex = data.findIndex(d => d.nib === item.nib && d.nik === item.nik);
                duplicateData.push({
                    row: originalIndex + 10,
                    data: item,
                    reason: existingNIB ? `NIB ${item.nib} sudah terdaftar` : `NIK ${item.nik} sudah terdaftar`,
                    existingData: existingNIB || existingNIK
                });
            } else {
                validData.push(item);
            }
        });
        
        // Import valid data
        let nextId = existingData.length > 0 ? Math.max(...existingData.map(d => d.id)) + 1 : 1;
        const importedData = validData.map(item => ({
            id: nextId++,
            ...item,
            createdAt: new Date().toISOString()
        }));
        
        if (importedData.length > 0) {
            const updatedData = [...existingData, ...importedData];
            writeData('ikm-binaan.json', updatedData);
        }
        
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        
        // Log import activity
        logActivity({
            type: 'admin_activity',
            action: 'import_data',
            user: req.headers['x-user'] || 'Unknown Admin',
            details: {
                dataType: 'ikm-binaan',
                totalRows: data.length,
                importedCount: importedData.length,
                duplicateCount: duplicateData.length,
                filename: req.file.originalname,
                ip: req.ip || req.connection.remoteAddress
            },
            success: true
        });
        
        // Return detailed result
        res.json({ 
            success: true, 
            message: `Import selesai: ${importedData.length} data berhasil, ${duplicateData.length} data duplikat`,
            imported: importedData.length,
            duplicates: duplicateData.length,
            duplicateData: duplicateData,
            importedData: importedData
        });
        
    } catch (error) {
        console.error('Import error:', error);
        // Clean up uploaded file if exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'Failed to import data: ' + error.message });
    }
});
app.get('/api/template/ikm-binaan', async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Template IKM Binaan');
        
        // Define columns for template
        const columns = [
            { header: 'No. NIB', key: 'nib', width: 15 },
            { header: 'No. NIK', key: 'nik', width: 20 },
            { header: 'Nama Lengkap', key: 'namaLengkap', width: 25 },
            { header: 'Alamat Lengkap', key: 'alamatLengkap', width: 40 },
            { header: 'Nama Usaha', key: 'namaUsaha', width: 25 },
            { header: 'Nomor HP', key: 'nomorHP', width: 15 }
        ];
        
        worksheet.columns = columns;
        
        // Add title
        worksheet.insertRow(1, ['Template Import Data IKM Binaan']);
        worksheet.mergeCells('A1:F1');
        worksheet.getCell('A1').font = { bold: true, size: 16 };
        worksheet.getCell('A1').alignment = { horizontal: 'center' };
        
        // Add instructions
        worksheet.insertRow(2, []);
        worksheet.insertRow(3, ['Petunjuk Pengisian:']);
        worksheet.getCell('A3').font = { bold: true };
        worksheet.insertRow(4, ['1. NIB harus 13 digit angka']);
        worksheet.insertRow(5, ['2. NIK harus 16 digit angka']);
        worksheet.insertRow(6, ['3. Semua kolom wajib diisi']);
        worksheet.insertRow(7, ['4. Data dimulai dari baris ke-9']);
        worksheet.insertRow(8, []);
        
        // Style header row (row 9)
        const headerRow = worksheet.getRow(9);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };
        
        // Add sample data
        worksheet.addRow({
            nib: '1234567890123',
            nik: '3518012345678901',
            namaLengkap: 'Contoh Nama Lengkap',
            alamatLengkap: 'Jl. Contoh No. 123, Kelurahan Contoh, Kecamatan Contoh, Kota Madiun',
            namaUsaha: 'Contoh Nama Usaha',
            nomorHP: '081234567890'
        });
        
        // Add validation for NIB and NIK columns
        worksheet.getColumn('A').eachCell((cell, rowNumber) => {
            if (rowNumber > 9) {
                cell.dataValidation = {
                    type: 'textLength',
                    operator: 'equal',
                    formula1: 13,
                    showErrorMessage: true,
                    errorTitle: 'NIB Error',
                    error: 'NIB harus 13 digit angka'
                };
            }
        });
        
        worksheet.getColumn('B').eachCell((cell, rowNumber) => {
            if (rowNumber > 9) {
                cell.dataValidation = {
                    type: 'textLength',
                    operator: 'equal',
                    formula1: 16,
                    showErrorMessage: true,
                    errorTitle: 'NIK Error',
                    error: 'NIK harus 16 digit angka'
                };
            }
        });
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="Template_Import_IKM_Binaan.xlsx"');
        
        await workbook.xlsx.write(res);
        res.end();
        
    } catch (error) {
        console.error('Template download error:', error);
        res.status(500).json({ error: 'Failed to generate template' });
    }
});

// Add participant to training
app.post('/api/pelatihan-pemberdayaan/:id/peserta', async (req, res) => {
    try {
        const { id } = req.params;
        const { query } = req.body; // NIB, NIK, or name
        
        const pelatihanData = readData('pelatihan-pemberdayaan.json');
        const ikmData = readData('ikm-binaan.json');
        
        const pelatihan = pelatihanData.find(p => p.id === parseInt(id));
        if (!pelatihan) {
            return res.status(404).json({ error: 'Pelatihan tidak ditemukan' });
        }
        
        // Find IKM by query
        const ikm = ikmData.find(i => 
            i.nib === query || 
            i.nik === query || 
            i.namaLengkap.toLowerCase().includes(query.toLowerCase())
        );
        
        if (!ikm) {
            return res.status(404).json({ error: 'Data IKM tidak ditemukan' });
        }
        
        // Initialize peserta array if not exists
        if (!pelatihan.peserta) {
            pelatihan.peserta = [];
        }
        
        // Check if already registered
        const alreadyRegistered = pelatihan.peserta.find(p => p.ikmBinaanId === ikm.id);
        if (alreadyRegistered) {
            return res.status(400).json({ error: 'Peserta sudah terdaftar dalam pelatihan ini' });
        }
        
        // Check quota
        if (pelatihan.peserta.length >= pelatihan.kuota) {
            return res.status(400).json({ error: 'Kuota pelatihan sudah penuh' });
        }
        
        // Add participant
        const peserta = {
            ikmBinaanId: ikm.id,
            nib: ikm.nib,
            nik: ikm.nik,
            namaLengkap: ikm.namaLengkap,
            namaUsaha: ikm.namaUsaha,
            nomorHP: ikm.nomorHP,
            tanggalDaftar: new Date().toISOString()
        };
        
        pelatihan.peserta.push(peserta);
        pelatihan.updatedAt = new Date().toISOString();
        
        writeData('pelatihan-pemberdayaan.json', pelatihanData);
        
        res.json({ success: true, peserta });
        
    } catch (error) {
        console.error('Add participant error:', error);
        res.status(500).json({ error: 'Failed to add participant' });
    }
});

// Remove participant from training
app.delete('/api/pelatihan-pemberdayaan/:id/peserta/:pesertaId', async (req, res) => {
    try {
        const { id, pesertaId } = req.params;
        
        const pelatihanData = readData('pelatihan-pemberdayaan.json');
        const pelatihan = pelatihanData.find(p => p.id === parseInt(id));
        
        if (!pelatihan) {
            return res.status(404).json({ error: 'Pelatihan tidak ditemukan' });
        }
        
        if (!pelatihan.peserta) {
            return res.status(404).json({ error: 'Peserta tidak ditemukan' });
        }
        
        const pesertaIndex = pelatihan.peserta.findIndex(p => p.ikmBinaanId === parseInt(pesertaId));
        if (pesertaIndex === -1) {
            return res.status(404).json({ error: 'Peserta tidak ditemukan' });
        }
        
        pelatihan.peserta.splice(pesertaIndex, 1);
        pelatihan.updatedAt = new Date().toISOString();
        
        writeData('pelatihan-pemberdayaan.json', pelatihanData);
        
        res.json({ success: true });
        
    } catch (error) {
        console.error('Remove participant error:', error);
        res.status(500).json({ error: 'Failed to remove participant' });
    }
});

// Export participants list (Using ExcelJS for real .xlsx files)
app.get('/api/pelatihan-pemberdayaan/:id/peserta/export/:format', async (req, res) => {
    try {
        const { id, format } = req.params;
        
        const pelatihanData = readData('pelatihan-pemberdayaan.json');
        const pelatihan = pelatihanData.find(p => p.id === parseInt(id));
        
        if (!pelatihan) {
            return res.status(404).json({ error: 'Pelatihan tidak ditemukan' });
        }
        
        if (!pelatihan.peserta || pelatihan.peserta.length === 0) {
            return res.status(404).json({ error: 'Tidak ada peserta' });
        }
        
        if (format === 'excel') {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Peserta Pelatihan');
            
            const title = `Daftar Peserta - ${pelatihan.judulPelatihan}`;
            
            // Add title
            worksheet.insertRow(1, [title]);
            worksheet.mergeCells('A1:F1');
            worksheet.getCell('A1').font = { bold: true, size: 16 };
            worksheet.getCell('A1').alignment = { horizontal: 'center' };
            
            // Add training info
            worksheet.insertRow(2, []);
            worksheet.insertRow(3, ['Tanggal:', `${new Date(pelatihan.tanggalMulai).toLocaleDateString('id-ID')} - ${new Date(pelatihan.tanggalSelesai).toLocaleDateString('id-ID')}`]);
            worksheet.insertRow(4, ['Lokasi:', pelatihan.lokasi]);
            worksheet.insertRow(5, ['Kuota:', pelatihan.kuota]);
            worksheet.insertRow(6, []);
            
            // Add headers
            worksheet.columns = [
                { header: 'No', key: 'no', width: 5 },
                { header: 'NIB', key: 'nib', width: 15 },
                { header: 'NIK', key: 'nik', width: 20 },
                { header: 'Nama Lengkap', key: 'namaLengkap', width: 25 },
                { header: 'Nama Usaha', key: 'namaUsaha', width: 25 },
                { header: 'Nomor HP', key: 'nomorHP', width: 15 }
            ];
            
            const headerRow = worksheet.getRow(7);
            headerRow.font = { bold: true };
            headerRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE0E0E0' }
            };
            
            // Add data
            pelatihan.peserta.forEach((peserta, index) => {
                worksheet.addRow({
                    no: index + 1,
                    nib: peserta.nib,
                    nik: peserta.nik,
                    namaLengkap: peserta.namaLengkap,
                    namaUsaha: peserta.namaUsaha,
                    nomorHP: peserta.nomorHP
                });
            });
            
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="Peserta_${pelatihan.judulPelatihan.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx"`);
            
            await workbook.xlsx.write(res);
            res.end();
            
        } else if (format === 'pdf') {
            const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Daftar Peserta Pelatihan</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { text-align: center; color: #333; margin-bottom: 20px; }
                    .info { margin-bottom: 20px; }
                    .info p { margin: 5px 0; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 10px; }
                    th { background-color: #f2f2f2; font-weight: bold; }
                    tr:nth-child(even) { background-color: #f9f9f9; }
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <h1>Daftar Peserta Pelatihan</h1>
                <div class="info">
                    <p><strong>Judul Pelatihan:</strong> ${pelatihan.judulPelatihan}</p>
                    <p><strong>Tanggal:</strong> ${new Date(pelatihan.tanggalMulai).toLocaleDateString('id-ID')} - ${new Date(pelatihan.tanggalSelesai).toLocaleDateString('id-ID')}</p>
                    <p><strong>Lokasi:</strong> ${pelatihan.lokasi}</p>
                    <p><strong>Kuota:</strong> ${pelatihan.kuota}</p>
                    <p><strong>Jumlah Peserta:</strong> ${pelatihan.peserta.length}</p>
                </div>
                <div class="no-print" style="margin-bottom: 20px;">
                    <button onclick="window.print()" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
                        Print / Save as PDF
                    </button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>NIB</th>
                            <th>NIK</th>
                            <th>Nama Lengkap</th>
                            <th>Nama Usaha</th>
                            <th>Nomor HP</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pelatihan.peserta.map((peserta, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${peserta.nib}</td>
                                <td>${peserta.nik}</td>
                                <td>${peserta.namaLengkap}</td>
                                <td>${peserta.namaUsaha}</td>
                                <td>${peserta.nomorHP}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>`;
            
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.send(htmlContent);
        }
        
    } catch (error) {
        console.error('Export participants error:', error);
        res.status(500).json({ error: 'Failed to export participants' });
    }
});

// CRUD operations for each data type
const createCRUDRoutes = (dataType, filename) => {
    // Get all
    app.get(`/api/${dataType}`, (req, res) => {
        const data = readData(filename);
        res.json(data);
    });

    // Get by ID
    app.get(`/api/${dataType}/:id`, (req, res) => {
        const data = readData(filename);
        const item = data.find(d => d.id === parseInt(req.params.id));
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ error: 'Data tidak ditemukan' });
        }
    });

    // Create
    app.post(`/api/${dataType}`, (req, res) => {
        const data = readData(filename);
        const newItem = {
            id: data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1,
            ...req.body,
            createdAt: new Date().toISOString()
        };
        data.push(newItem);
        writeData(filename, data);
        
        // Log create activity
        logActivity({
            type: 'admin_activity',
            action: 'create',
            user: req.headers['x-user'] || 'Unknown Admin',
            details: {
                dataType: dataType,
                itemId: newItem.id,
                itemData: newItem,
                ip: req.ip || req.connection.remoteAddress
            },
            success: true
        });
        
        res.status(201).json(newItem);
    });

    // Update
    app.put(`/api/${dataType}/:id`, (req, res) => {
        const data = readData(filename);
        const index = data.findIndex(d => d.id === parseInt(req.params.id));
        if (index !== -1) {
            const oldData = { ...data[index] };
            data[index] = { ...data[index], ...req.body, updatedAt: new Date().toISOString() };
            writeData(filename, data);
            
            // Log update activity
            logActivity({
                type: 'admin_activity',
                action: 'update',
                user: req.headers['x-user'] || 'Unknown Admin',
                details: {
                    dataType: dataType,
                    itemId: parseInt(req.params.id),
                    oldData: oldData,
                    newData: data[index],
                    ip: req.ip || req.connection.remoteAddress
                },
                success: true
            });
            
            res.json(data[index]);
        } else {
            res.status(404).json({ error: 'Data tidak ditemukan' });
        }
    });

    // Delete
    app.delete(`/api/${dataType}/:id`, (req, res) => {
        const data = readData(filename);
        const index = data.findIndex(d => d.id === parseInt(req.params.id));
        if (index !== -1) {
            const deleted = data.splice(index, 1);
            writeData(filename, data);
            
            // Log delete activity
            logActivity({
                type: 'admin_activity',
                action: 'delete',
                user: req.headers['x-user'] || 'Unknown Admin',
                details: {
                    dataType: dataType,
                    itemId: parseInt(req.params.id),
                    deletedData: deleted[0],
                    ip: req.ip || req.connection.remoteAddress
                },
                success: true
            });
            
            res.json(deleted[0]);
        } else {
            res.status(404).json({ error: 'Data tidak ditemukan' });
        }
    });
};

// Create CRUD routes for all data types
createCRUDRoutes('ikm-binaan', 'ikm-binaan.json');
createCRUDRoutes('hki-merek', 'hki-merek.json');
createCRUDRoutes('sertifikat-halal', 'sertifikat-halal.json');
createCRUDRoutes('tkdn-ik', 'tkdn-ik.json');
createCRUDRoutes('siinas', 'siinas.json');
createCRUDRoutes('uji-nilai-gizi', 'uji-nilai-gizi.json');
createCRUDRoutes('kurasi-produk', 'kurasi-produk.json');
createCRUDRoutes('pelatihan-pemberdayaan', 'pelatihan-pemberdayaan.json');
createCRUDRoutes('buku-tamu', 'buku-tamu.json');
createCRUDRoutes('recycle-bin', 'recycle-bin.json');

// Activity Logs API
app.get('/api/activity-logs', (req, res) => {
    try {
        const logs = readData('activity-logs.json');
        const { type, user, limit = 100, offset = 0 } = req.query;
        
        let filteredLogs = logs;
        
        // Filter by type
        if (type) {
            filteredLogs = filteredLogs.filter(log => log.type === type);
        }
        
        // Filter by user
        if (user) {
            filteredLogs = filteredLogs.filter(log => log.user.includes(user));
        }
        
        // Sort by timestamp (newest first)
        filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Pagination
        const paginatedLogs = filteredLogs.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
        
        res.json({
            logs: paginatedLogs,
            total: filteredLogs.length,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (error) {
        console.error('Failed to get activity logs:', error);
        res.status(500).json({ error: 'Failed to get activity logs' });
    }
});

// Activity Logs Statistics API
app.get('/api/activity-logs/stats', (req, res) => {
    try {
        const logs = readData('activity-logs.json');
        const today = new Date().toISOString().split('T')[0];
        const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const thisMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        
        const stats = {
            total: logs.length,
            today: logs.filter(log => log.timestamp.startsWith(today)).length,
            thisWeek: logs.filter(log => log.timestamp >= thisWeek).length,
            thisMonth: logs.filter(log => log.timestamp >= thisMonth).length,
            byType: {
                admin_activity: logs.filter(log => log.type === 'admin_activity').length,
                public_search: logs.filter(log => log.type === 'public_search').length
            },
            byAction: {}
        };
        
        // Count by action
        logs.forEach(log => {
            const action = log.action;
            stats.byAction[action] = (stats.byAction[action] || 0) + 1;
        });
        
        res.json(stats);
    } catch (error) {
        console.error('Failed to get activity stats:', error);
        res.status(500).json({ error: 'Failed to get activity stats' });
    }
});

// Export Activity Logs API
app.get('/api/activity-logs/export', async (req, res) => {
    try {
        const logs = readData('activity-logs.json');
        const { type, user, format = 'excel', limit = 1000 } = req.query;
        
        let filteredLogs = logs;
        
        // Filter by type
        if (type) {
            filteredLogs = filteredLogs.filter(log => log.type === type);
        }
        
        // Filter by user
        if (user) {
            filteredLogs = filteredLogs.filter(log => log.user.includes(user));
        }
        
        // Sort by timestamp (newest first)
        filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Limit results
        filteredLogs = filteredLogs.slice(0, parseInt(limit));
        
        if (format === 'excel') {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Activity Logs');
            
            // Title
            worksheet.insertRow(1, ['Activity Logs - Database IKM JUARA']);
            worksheet.mergeCells('A1:H1');
            worksheet.getCell('A1').font = { bold: true, size: 16 };
            worksheet.getCell('A1').alignment = { horizontal: 'center' };
            
            worksheet.insertRow(2, []);
            worksheet.insertRow(3, ['Export Date:', new Date().toLocaleDateString('id-ID')]);
            worksheet.insertRow(4, ['Total Records:', filteredLogs.length]);
            worksheet.insertRow(5, []);
            
            // Headers
            worksheet.insertRow(6, [
                'ID', 'Timestamp', 'Type', 'Action', 'User', 'IP Address', 'Details', 'Success'
            ]);
            
            const headerRow = worksheet.getRow(6);
            headerRow.font = { bold: true };
            headerRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE0E0E0' }
            };
            
            // Data
            filteredLogs.forEach(log => {
                const details = log.details || {};
                let detailsText = '';
                
                if (log.type === 'admin_activity') {
                    detailsText = `DataType: ${details.dataType || 'N/A'}, ItemID: ${details.itemId || 'N/A'}`;
                    if (details.recordCount) detailsText += `, Records: ${details.recordCount}`;
                    if (details.importedCount !== undefined) detailsText += `, Imported: ${details.importedCount}`;
                } else if (log.type === 'public_search') {
                    detailsText = `Query: ${details.query}, Found: ${details.found ? 'Yes' : 'No'}`;
                    if (details.resultName) detailsText += `, Result: ${details.resultName}`;
                }
                
                worksheet.addRow([
                    log.id,
                    new Date(log.timestamp).toLocaleString('id-ID'),
                    log.type,
                    log.action,
                    log.user,
                    details.ip || 'Unknown',
                    detailsText,
                    log.success ? 'Yes' : 'No'
                ]);
            });
            
            // Auto-fit columns
            worksheet.columns.forEach(column => {
                let maxLength = 0;
                column.eachCell({ includeEmpty: true }, cell => {
                    const columnLength = cell.value ? cell.value.toString().length : 10;
                    if (columnLength > maxLength) {
                        maxLength = columnLength;
                    }
                });
                column.width = maxLength < 10 ? 10 : maxLength + 2;
            });
            
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="Activity_Logs_${new Date().toISOString().split('T')[0]}.xlsx"`);
            
            await workbook.xlsx.write(res);
            res.end();
        }
        
    } catch (error) {
        console.error('Failed to export activity logs:', error);
        res.status(500).json({ error: 'Failed to export activity logs' });
    }
});

// Export search result API
app.post('/api/export-search-result', async (req, res) => {
    try {
        const { data, format } = req.body;
        
        if (!data || !data.ikmBinaan) {
            return res.status(400).json({ error: 'Data tidak valid' });
        }
        
        const ikm = data.ikmBinaan;
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `Penelusuran_${ikm.namaLengkap.replace(/\s+/g, '_')}_${timestamp}`;
        
        if (format === 'excel') {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Hasil Penelusuran');
            
            // Title
            worksheet.insertRow(1, [`Hasil Penelusuran Data IKM Binaan - ${ikm.namaLengkap}`]);
            worksheet.mergeCells('A1:F1');
            worksheet.getCell('A1').font = { bold: true, size: 16 };
            worksheet.getCell('A1').alignment = { horizontal: 'center' };
            
            worksheet.insertRow(2, []);
            worksheet.insertRow(3, ['Tanggal Export:', new Date().toLocaleDateString('id-ID')]);
            worksheet.insertRow(4, []);
            
            let currentRow = 5;
            
            // Basic IKM Info
            worksheet.insertRow(currentRow++, ['DATA DASAR IKM BINAAN']);
            worksheet.getCell(`A${currentRow-1}`).font = { bold: true, size: 14 };
            worksheet.insertRow(currentRow++, ['No. NIB', ikm.nib]);
            worksheet.insertRow(currentRow++, ['No. NIK', ikm.nik]);
            worksheet.insertRow(currentRow++, ['Nama Lengkap', ikm.namaLengkap]);
            worksheet.insertRow(currentRow++, ['Nama Usaha', ikm.namaUsaha]);
            worksheet.insertRow(currentRow++, ['Alamat Lengkap', ikm.alamatLengkap]);
            worksheet.insertRow(currentRow++, ['No. HP', ikm.nomorHP]);
            worksheet.insertRow(currentRow++, []);
            
            // HKI Merek
            if (data.hkiMerek && data.hkiMerek.length > 0) {
                worksheet.insertRow(currentRow++, ['PENDAFTARAN HKI MEREK']);
                worksheet.getCell(`A${currentRow-1}`).font = { bold: true, size: 14 };
                
                // Headers
                worksheet.insertRow(currentRow++, ['No', 'No. Pendaftaran', 'Status Sertifikat', 'Tahun Fasilitasi', 'Link Bukti Daftar', 'Link Sertifikat']);
                const headerRow = worksheet.getRow(currentRow-1);
                headerRow.font = { bold: true };
                headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
                
                data.hkiMerek.forEach((hki, index) => {
                    worksheet.insertRow(currentRow++, [
                        index + 1,
                        hki.nomorPendaftaranHKI,
                        hki.statusSertifikat,
                        hki.tahunFasilitasi,
                        hki.linkBuktiDaftar || '',
                        hki.linkSertifikatHKI || ''
                    ]);
                });
                worksheet.insertRow(currentRow++, []);
            }
            
            // Sertifikat Halal
            if (data.sertifikatHalal && data.sertifikatHalal.length > 0) {
                worksheet.insertRow(currentRow++, ['PENDAFTARAN SERTIFIKAT HALAL']);
                worksheet.getCell(`A${currentRow-1}`).font = { bold: true, size: 14 };
                
                worksheet.insertRow(currentRow++, ['No', 'No. Sertifikat', 'Tahun Fasilitasi', 'Link Sertifikat']);
                const headerRow = worksheet.getRow(currentRow-1);
                headerRow.font = { bold: true };
                headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
                
                data.sertifikatHalal.forEach((halal, index) => {
                    worksheet.insertRow(currentRow++, [
                        index + 1,
                        halal.nomorSertifikatHalal,
                        halal.tahunFasilitasi,
                        halal.linkSertifikatHalal || ''
                    ]);
                });
                worksheet.insertRow(currentRow++, []);
            }
            
            // TKDN IK
            if (data.tkdnIk && data.tkdnIk.length > 0) {
                worksheet.insertRow(currentRow++, ['PENDAFTARAN TKDN IK']);
                worksheet.getCell(`A${currentRow-1}`).font = { bold: true, size: 14 };
                
                worksheet.insertRow(currentRow++, ['No', 'No. Sertifikat', 'Tahun Terbit', 'Link Sertifikat']);
                const headerRow = worksheet.getRow(currentRow-1);
                headerRow.font = { bold: true };
                headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
                
                data.tkdnIk.forEach((tkdn, index) => {
                    worksheet.insertRow(currentRow++, [
                        index + 1,
                        tkdn.nomorSertifikatTKDN,
                        tkdn.tahunTerbitSertifikat,
                        tkdn.linkSertifikatTKDN || ''
                    ]);
                });
                worksheet.insertRow(currentRow++, []);
            }
            
            // SIINas
            if (data.siinas && data.siinas.length > 0) {
                worksheet.insertRow(currentRow++, ['PENDAFTARAN SIINAS']);
                worksheet.getCell(`A${currentRow-1}`).font = { bold: true, size: 14 };
                
                worksheet.insertRow(currentRow++, ['No', 'No. Bukti Kepemilikan', 'Tahun Registrasi', 'Link Bukti']);
                const headerRow = worksheet.getRow(currentRow-1);
                headerRow.font = { bold: true };
                headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
                
                data.siinas.forEach((siinas, index) => {
                    worksheet.insertRow(currentRow++, [
                        index + 1,
                        siinas.nomorBuktiKepemilikan,
                        siinas.tahunRegistrasi,
                        siinas.linkBuktiKepemilikan || ''
                    ]);
                });
                worksheet.insertRow(currentRow++, []);
            }
            
            // Uji Nilai Gizi
            if (data.ujiNilaiGizi && data.ujiNilaiGizi.length > 0) {
                worksheet.insertRow(currentRow++, ['PENDAFTARAN UJI NILAI GIZI']);
                worksheet.getCell(`A${currentRow-1}`).font = { bold: true, size: 14 };
                
                worksheet.insertRow(currentRow++, ['No', 'No. LHU', 'Tanggal Hasil Uji', 'Tahun Fasilitasi', 'Link LHU']);
                const headerRow = worksheet.getRow(currentRow-1);
                headerRow.font = { bold: true };
                headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
                
                data.ujiNilaiGizi.forEach((uji, index) => {
                    worksheet.insertRow(currentRow++, [
                        index + 1,
                        uji.nomorLHU,
                        new Date(uji.tanggalHasilUji).toLocaleDateString('id-ID'),
                        uji.tahunFasilitasi,
                        uji.linkLHU || ''
                    ]);
                });
                worksheet.insertRow(currentRow++, []);
            }
            
            // Kurasi Produk
            if (data.kurasiProduk && data.kurasiProduk.length > 0) {
                worksheet.insertRow(currentRow++, ['PENDAFTARAN KURASI PRODUK']);
                worksheet.getCell(`A${currentRow-1}`).font = { bold: true, size: 14 };
                
                worksheet.insertRow(currentRow++, ['No', 'No. Sertifikat', 'Tahun Kurasi', 'Link Sertifikat']);
                const headerRow = worksheet.getRow(currentRow-1);
                headerRow.font = { bold: true };
                headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
                
                data.kurasiProduk.forEach((kurasi, index) => {
                    worksheet.insertRow(currentRow++, [
                        index + 1,
                        kurasi.nomorSertifikatKurasi,
                        kurasi.tahunKurasi,
                        kurasi.linkSertifikatKurasi || ''
                    ]);
                });
                worksheet.insertRow(currentRow++, []);
            }
            
            // Pelatihan
            if (data.pelatihan && data.pelatihan.length > 0) {
                worksheet.insertRow(currentRow++, ['PELATIHAN PEMBERDAYAAN']);
                worksheet.getCell(`A${currentRow-1}`).font = { bold: true, size: 14 };
                
                worksheet.insertRow(currentRow++, ['No', 'Judul Pelatihan', 'Deskripsi', 'Tanggal Mulai', 'Tanggal Selesai', 'Lokasi', 'Instruktur', 'Status']);
                const headerRow = worksheet.getRow(currentRow-1);
                headerRow.font = { bold: true };
                headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
                
                data.pelatihan.forEach((pelatihan, index) => {
                    worksheet.insertRow(currentRow++, [
                        index + 1,
                        pelatihan.judulPelatihan,
                        pelatihan.deskripsi || 'Tidak ada deskripsi',
                        new Date(pelatihan.tanggalMulai).toLocaleDateString('id-ID'),
                        new Date(pelatihan.tanggalSelesai).toLocaleDateString('id-ID'),
                        pelatihan.lokasi,
                        pelatihan.instruktur,
                        pelatihan.status
                    ]);
                });
                worksheet.insertRow(currentRow++, []);
            }
            
            // Summary
            const totalLayanan = (data.hkiMerek?.length || 0) + (data.sertifikatHalal?.length || 0) + 
                               (data.tkdnIk?.length || 0) + (data.siinas?.length || 0) + 
                               (data.ujiNilaiGizi?.length || 0) + (data.kurasiProduk?.length || 0);
            const totalPelatihan = data.pelatihan?.length || 0;
            
            worksheet.insertRow(currentRow++, ['RINGKASAN']);
            worksheet.getCell(`A${currentRow-1}`).font = { bold: true, size: 14 };
            worksheet.insertRow(currentRow++, ['Total Layanan Diikuti', totalLayanan]);
            worksheet.insertRow(currentRow++, ['Total Pelatihan Diikuti', totalPelatihan]);
            
            // Auto-fit columns
            worksheet.columns.forEach(column => {
                let maxLength = 0;
                column.eachCell({ includeEmpty: true }, cell => {
                    const columnLength = cell.value ? cell.value.toString().length : 10;
                    if (columnLength > maxLength) {
                        maxLength = columnLength;
                    }
                });
                column.width = maxLength < 10 ? 10 : maxLength + 2;
            });
            
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);
            
            await workbook.xlsx.write(res);
            res.end();
            
        } else if (format === 'pdf') {
            // Generate HTML for PDF
            const totalLayanan = (data.hkiMerek?.length || 0) + (data.sertifikatHalal?.length || 0) + 
                               (data.tkdnIk?.length || 0) + (data.siinas?.length || 0) + 
                               (data.ujiNilaiGizi?.length || 0) + (data.kurasiProduk?.length || 0);
            const totalPelatihan = data.pelatihan?.length || 0;
            
            let htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Hasil Penelusuran Data IKM Binaan</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
                    h1 { text-align: center; color: #333; margin-bottom: 30px; }
                    h2 { color: #27ae60; border-bottom: 2px solid #27ae60; padding-bottom: 5px; margin-top: 30px; }
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
                    .info-item { background: #f8f9fa; padding: 10px; border-radius: 4px; }
                    .info-item strong { color: #2c3e50; }
                    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; font-weight: bold; }
                    tr:nth-child(even) { background-color: #f9f9f9; }
                    .summary { background: #e8f5e8; padding: 15px; border-radius: 8px; margin-top: 20px; }
                    .summary h3 { color: #27ae60; margin-top: 0; }
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="no-print" style="margin-bottom: 20px;">
                    <button onclick="window.print()" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
                        Print / Save as PDF
                    </button>
                </div>
                
                <h1>Hasil Penelusuran Data IKM Binaan</h1>
                <p style="text-align: center; color: #666; margin-bottom: 30px;">
                    Tanggal Export: ${new Date().toLocaleDateString('id-ID', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
                
                <h2>Data Dasar IKM Binaan</h2>
                <div class="info-grid">
                    <div class="info-item"><strong>No. NIB:</strong><br>${ikm.nib}</div>
                    <div class="info-item"><strong>No. NIK:</strong><br>${ikm.nik}</div>
                    <div class="info-item"><strong>Nama Lengkap:</strong><br>${ikm.namaLengkap}</div>
                    <div class="info-item"><strong>Nama Usaha:</strong><br>${ikm.namaUsaha}</div>
                </div>
                <div class="info-item" style="margin-bottom: 20px;">
                    <strong>Alamat Lengkap:</strong><br>${ikm.alamatLengkap}
                </div>
                <div class="info-item">
                    <strong>No. HP:</strong><br>${ikm.nomorHP}
                </div>
            `;
            
            // Add each service section
            if (data.hkiMerek && data.hkiMerek.length > 0) {
                htmlContent += `
                    <h2>Pendaftaran HKI Merek</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>No. Pendaftaran</th>
                                <th>Status Sertifikat</th>
                                <th>Tahun Fasilitasi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.hkiMerek.map((hki, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${hki.nomorPendaftaranHKI}</td>
                                    <td>${hki.statusSertifikat}</td>
                                    <td>${hki.tahunFasilitasi}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
            
            if (data.sertifikatHalal && data.sertifikatHalal.length > 0) {
                htmlContent += `
                    <h2>Pendaftaran Sertifikat Halal</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>No. Sertifikat</th>
                                <th>Tahun Fasilitasi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.sertifikatHalal.map((halal, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${halal.nomorSertifikatHalal}</td>
                                    <td>${halal.tahunFasilitasi}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
            
            if (data.tkdnIk && data.tkdnIk.length > 0) {
                htmlContent += `
                    <h2>Pendaftaran TKDN IK</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>No. Sertifikat</th>
                                <th>Tahun Terbit</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.tkdnIk.map((tkdn, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${tkdn.nomorSertifikatTKDN}</td>
                                    <td>${tkdn.tahunTerbitSertifikat}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
            
            if (data.siinas && data.siinas.length > 0) {
                htmlContent += `
                    <h2>Pendaftaran SIINas</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>No. Bukti Kepemilikan</th>
                                <th>Tahun Registrasi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.siinas.map((siinas, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${siinas.nomorBuktiKepemilikan}</td>
                                    <td>${siinas.tahunRegistrasi}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
            
            if (data.ujiNilaiGizi && data.ujiNilaiGizi.length > 0) {
                htmlContent += `
                    <h2>Pendaftaran Uji Nilai Gizi</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>No. LHU</th>
                                <th>Tanggal Hasil Uji</th>
                                <th>Tahun Fasilitasi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.ujiNilaiGizi.map((uji, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${uji.nomorLHU}</td>
                                    <td>${new Date(uji.tanggalHasilUji).toLocaleDateString('id-ID')}</td>
                                    <td>${uji.tahunFasilitasi}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
            
            if (data.kurasiProduk && data.kurasiProduk.length > 0) {
                htmlContent += `
                    <h2>Pendaftaran Kurasi Produk</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>No. Sertifikat</th>
                                <th>Tahun Kurasi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.kurasiProduk.map((kurasi, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${kurasi.nomorSertifikatKurasi}</td>
                                    <td>${kurasi.tahunKurasi}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
            
            if (data.pelatihan && data.pelatihan.length > 0) {
                htmlContent += `
                    <h2>Pelatihan Pemberdayaan</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Judul Pelatihan</th>
                                <th>Deskripsi</th>
                                <th>Tanggal</th>
                                <th>Lokasi</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.pelatihan.map((pelatihan, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${pelatihan.judulPelatihan}</td>
                                    <td>${pelatihan.deskripsi || 'Tidak ada deskripsi'}</td>
                                    <td>${new Date(pelatihan.tanggalMulai).toLocaleDateString('id-ID')} - ${new Date(pelatihan.tanggalSelesai).toLocaleDateString('id-ID')}</td>
                                    <td>${pelatihan.lokasi}</td>
                                    <td>${pelatihan.status}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
            
            htmlContent += `
                <div class="summary">
                    <h3>Ringkasan Layanan dan Pelatihan</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <strong>Total Layanan Diikuti:</strong><br>
                            <span style="font-size: 18px; color: #27ae60; font-weight: bold;">${totalLayanan}</span>
                        </div>
                        <div class="info-item">
                            <strong>Total Pelatihan Diikuti:</strong><br>
                            <span style="font-size: 18px; color: #3498db; font-weight: bold;">${totalPelatihan}</span>
                        </div>
                    </div>
                </div>
            </body>
            </html>`;
            
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.send(htmlContent);
        }
        
    } catch (error) {
        console.error('Export search result error:', error);
        res.status(500).json({ error: 'Failed to export search result: ' + error.message });
    }
});

// Website Content API
app.get('/api/website-content', (req, res) => {
    try {
        const content = readData('website-content.json');
        res.json(content);
    } catch (error) {
        console.error('Failed to load website content:', error);
        res.status(500).json({ error: 'Failed to load website content' });
    }
});

app.put('/api/website-content', logAdminActivity('update_website_content'), (req, res) => {
    try {
        console.log('PUT /api/website-content called with body:', req.body);
        
        // Validate request body
        if (!req.body || typeof req.body !== 'object') {
            console.error('Invalid request body:', req.body);
            return res.status(400).json({ error: 'Invalid request body' });
        }
        
        const { section, itemId, title, description, contact, link } = req.body;
        
        // Validate required fields
        if (!section || !itemId || !title || !description) {
            console.error('Missing required fields:', { section, itemId, title, description });
            return res.status(400).json({ error: 'Section, itemId, title, and description are required' });
        }
        
        const content = readData('website-content.json');
        
        // Find the section
        const sectionData = content.find(s => s.section === section);
        if (!sectionData) {
            console.error('Section not found:', section);
            console.log('Available sections:', content.map(s => s.section));
            return res.status(404).json({ error: `Section '${section}' not found` });
        }
        
        // Find the item
        const item = sectionData.content.find(i => i.id === itemId);
        if (!item) {
            console.error('Content item not found:', itemId);
            console.log('Available items:', sectionData.content.map(i => i.id));
            return res.status(404).json({ error: `Content item '${itemId}' not found` });
        }
        
        console.log('Updating item:', item);
        
        // Update the item
        item.title = title;
        item.description = description;
        
        // Only update contact and link if they are provided in the request
        if (contact !== undefined) item.contact = contact;
        if (link !== undefined) item.link = link;
        
        console.log('Updated item:', item);
        
        // Save the updated content
        writeData('website-content.json', content);
        
        console.log('Content updated successfully');
        
        res.json({ success: true, message: 'Content updated successfully', item: item });
    } catch (error) {
        console.error('Failed to update website content:', error);
        res.status(500).json({ error: 'Failed to update website content: ' + error.message });
    }
});

app.post('/api/website-content', (req, res) => {
    try {
        console.log('POST /api/website-content called with body:', req.body);
        
        // Validate request body
        if (!req.body || typeof req.body !== 'object') {
            console.error('Invalid request body:', req.body);
            return res.status(400).json({ error: 'Invalid request body' });
        }
        
        const { section, title, description, contact, link } = req.body;
        
        // Validate required fields
        if (!section || !title || !description) {
            console.error('Missing required fields:', { section, title, description });
            return res.status(400).json({ error: 'Section, title, and description are required' });
        }
        
        const content = readData('website-content.json');
        
        console.log('Current content:', content);
        
        // Find the section
        const sectionData = content.find(s => s.section === section);
        if (!sectionData) {
            console.error('Section not found:', section);
            console.log('Available sections:', content.map(s => s.section));
            return res.status(404).json({ error: `Section '${section}' not found` });
        }
        
        console.log('Found section:', sectionData);
        
        // Generate new ID - simplified approach
        const timestamp = Date.now();
        const newId = `${section}-${timestamp}`;
        
        console.log('Generated new ID:', newId);
        
        // Create new item
        const newItem = {
            id: newId,
            title,
            description
        };
        
        if (contact) newItem.contact = contact;
        if (link) newItem.link = link;
        
        console.log('New item to add:', newItem);
        
        // Add to section
        sectionData.content.push(newItem);
        
        console.log('Updated section content:', sectionData.content);
        
        // Save the updated content
        writeData('website-content.json', content);
        
        console.log('Content saved successfully');
        
        res.json({ success: true, message: 'Content added successfully', item: newItem });
    } catch (error) {
        console.error('Failed to add website content:', error);
        res.status(500).json({ error: 'Failed to add website content: ' + error.message });
    }
});

app.delete('/api/website-content', logAdminActivity('delete_website_content'), (req, res) => {
    try {
        console.log('DELETE /api/website-content called with body:', req.body);
        
        // Validate request body
        if (!req.body || typeof req.body !== 'object') {
            console.error('Invalid request body:', req.body);
            return res.status(400).json({ error: 'Invalid request body' });
        }
        
        const { section, itemId } = req.body;
        
        // Validate required fields
        if (!section || !itemId) {
            console.error('Missing required fields:', { section, itemId });
            return res.status(400).json({ error: 'Section and itemId are required' });
        }
        
        const content = readData('website-content.json');
        
        // Find the section
        const sectionData = content.find(s => s.section === section);
        if (!sectionData) {
            console.error('Section not found:', section);
            console.log('Available sections:', content.map(s => s.section));
            return res.status(404).json({ error: `Section '${section}' not found` });
        }
        
        // Find and remove the item
        const itemIndex = sectionData.content.findIndex(i => i.id === itemId);
        if (itemIndex === -1) {
            console.error('Content item not found:', itemId);
            console.log('Available items:', sectionData.content.map(i => i.id));
            return res.status(404).json({ error: `Content item '${itemId}' not found` });
        }
        
        const deletedItem = sectionData.content.splice(itemIndex, 1)[0];
        
        console.log('Deleted item:', deletedItem);
        
        // Save the updated content
        writeData('website-content.json', content);
        
        console.log('Content deleted successfully');
        
        res.json({ success: true, message: 'Content deleted successfully', item: deletedItem });
    } catch (error) {
        console.error('Failed to delete website content:', error);
        res.status(500).json({ error: 'Failed to delete website content: ' + error.message });
    }
});

// For Vercel deployment
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server berjalan di http://localhost:${PORT}`);
        console.log(`Admin: http://localhost:${PORT}/admin`);
        console.log(`Public: http://localhost:${PORT}/public`);
    });
}

// Export for Vercel
module.exports = app;