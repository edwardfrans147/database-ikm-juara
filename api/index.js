// Vercel API endpoint
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Helper function to read JSON data
const readData = (filename) => {
    try {
        const dataPath = path.join(process.cwd(), 'data', filename);
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data:', error);
        return [];
    }
};

// Dashboard API
app.get('/api/dashboard', (req, res) => {
    try {
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

        res.json({
            ikmBinaan: ikmBinaan.length,
            hkiMerek: hkiMerek.length,
            sertifikatHalal: sertifikatHalal.length,
            tkdnIk: tkdnIk.length,
            siinas: siinas.length,
            ujiNilaiGizi: ujiNilaiGizi.length,
            kurasiProduk: kurasiProduk.length,
            pelatihanPemberdayaan: pelatihanPemberdayaan.length,
            totalPesertaPelatihan: totalPesertaPelatihan
        });
    } catch (error) {
        console.error('Dashboard API error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        message: 'Database IKM JUARA API is running'
    });
});

// Root redirect
app.get('/', (req, res) => {
    res.redirect('/admin/login.html');
});

// Export for Vercel
module.exports = app;