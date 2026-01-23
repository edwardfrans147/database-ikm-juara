// Simple Supabase API untuk testing
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

// Supabase configuration
const supabaseUrl = 'https://krylvwwguczwwoyqghlc.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeWx2d3dndWN6d3dveXFnaGxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA1ODg0MSwiZXhwIjoyMDg0NjM0ODQxfQ.ysubAuDeIPshMww709q092yI37j1wZUIwK5vQttUsmE';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🔧 Simple API initialized with Supabase');

// Helper function untuk error handling
const handleError = (res, error, message = 'Internal server error') => {
    console.error(message, error);
    res.status(500).json({
        success: false,
        error: message,
        details: error.message
    });
};

// Test endpoint
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'API is working!',
        timestamp: new Date().toISOString()
    });
});

// Dashboard API
router.get('/dashboard', async (req, res) => {
    try {
        console.log('Dashboard API called');
        
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
});

// Get IKM Binaan data
router.get('/ikm-binaan', async (req, res) => {
    try {
        console.log('IKM Binaan API called');
        
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
});

// Get specific service data with JOIN to ikm_binaan
router.get('/:service', async (req, res) => {
    try {
        const { service } = req.params;
        console.log(`Service API called: ${service}`);
        
        // Map service names to table names
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
        
        let data, error;
        
        // For pelatihan-pemberdayaan, don't need JOIN
        if (service === 'pelatihan-pemberdayaan') {
            const result = await supabase
                .from(tableName)
                .select('*')
                .order('created_at', { ascending: false });
            data = result.data;
            error = result.error;
        } else {
            // For other services, JOIN with ikm_binaan to get NIB and other details
            const result = await supabase
                .from(tableName)
                .select(`
                    *,
                    ikm_binaan!inner(
                        nib,
                        nik,
                        nama_lengkap,
                        nama_usaha,
                        nomor_hp
                    )
                `)
                .order('created_at', { ascending: false });
            
            data = result.data;
            error = result.error;
            
            // Flatten the data structure for easier frontend consumption
            if (data) {
                data = data.map(item => ({
                    ...item,
                    nib: item.ikm_binaan?.nib || '',
                    nik: item.ikm_binaan?.nik || '',
                    nama_lengkap: item.ikm_binaan?.nama_lengkap || item.nama_lengkap,
                    nama_usaha: item.ikm_binaan?.nama_usaha || item.nama_usaha,
                    nomor_hp: item.ikm_binaan?.nomor_hp || ''
                }));
            }
        }
        
        if (error) throw error;
        
        res.json({
            success: true,
            data: data || []
        });
        
    } catch (error) {
        handleError(res, error, `Error fetching ${req.params.service} data`);
    }
});

// Get specific service data by ID
router.get('/:service/:id', async (req, res) => {
    try {
        const { service, id } = req.params;
        console.log(`Service by ID API called: ${service}/${id}`);
        
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
        
        let data, error;
        
        if (service === 'pelatihan-pemberdayaan') {
            // For pelatihan, also get peserta data
            const result = await supabase
                .from(tableName)
                .select(`
                    *,
                    peserta_pelatihan(
                        id,
                        ikm_binaan(
                            id,
                            nib,
                            nik,
                            nama_lengkap,
                            nama_usaha,
                            nomor_hp
                        ),
                        tanggal_daftar
                    )
                `)
                .eq('id', id)
                .single();
            
            data = result.data;
            error = result.error;
            
            // Format peserta data
            if (data && data.peserta_pelatihan) {
                data.peserta = data.peserta_pelatihan.map(p => ({
                    ikmBinaanId: p.ikm_binaan?.id,
                    nib: p.ikm_binaan?.nib,
                    nik: p.ikm_binaan?.nik,
                    nama_lengkap: p.ikm_binaan?.nama_lengkap,
                    nama_usaha: p.ikm_binaan?.nama_usaha,
                    nomor_hp: p.ikm_binaan?.nomor_hp,
                    tanggalDaftar: p.tanggal_daftar
                }));
                delete data.peserta_pelatihan;
            }
        } else {
            const result = await supabase
                .from(tableName)
                .select(`
                    *,
                    ikm_binaan!inner(
                        nib,
                        nik,
                        nama_lengkap,
                        nama_usaha,
                        nomor_hp
                    )
                `)
                .eq('id', id)
                .single();
            
            data = result.data;
            error = result.error;
            
            // Flatten the data structure
            if (data) {
                data = {
                    ...data,
                    nib: data.ikm_binaan?.nib || '',
                    nik: data.ikm_binaan?.nik || '',
                    nama_lengkap: data.ikm_binaan?.nama_lengkap || data.nama_lengkap,
                    nama_usaha: data.ikm_binaan?.nama_usaha || data.nama_usaha,
                    nomor_hp: data.ikm_binaan?.nomor_hp || ''
                };
            }
        }
        
        if (error) throw error;
        
        res.json({
            success: true,
            data: data
        });
        
    } catch (error) {
        handleError(res, error, `Error fetching ${req.params.service} data by ID`);
    }
});

// Update service data
router.put('/:service/:id', async (req, res) => {
    try {
        const { service, id } = req.params;
        console.log(`Update API called: ${service}/${id}`);
        
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
        
        // Remove fields that shouldn't be updated
        const updateData = { ...req.body };
        delete updateData.id;
        delete updateData.ikm_binaan_id;
        delete updateData.created_at;
        delete updateData.ikm_binaan;
        delete updateData.nib;
        delete updateData.nik;
        delete updateData.nama_lengkap;
        delete updateData.nama_usaha;
        delete updateData.nomor_hp;
        
        const { data, error } = await supabase
            .from(tableName)
            .update(updateData)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        
        res.json({
            success: true,
            data: data
        });
        
    } catch (error) {
        handleError(res, error, `Error updating ${req.params.service} data`);
    }
});

// Delete service data
router.delete('/:service/:id', async (req, res) => {
    try {
        const { service, id } = req.params;
        console.log(`Delete API called: ${service}/${id}`);
        
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
        
        // Get data before deletion for recycle bin
        const { data: existingData } = await supabase
            .from(tableName)
            .select('*')
            .eq('id', id)
            .single();
        
        // Move to recycle bin
        if (existingData) {
            await supabase.from('recycle_bin').insert({
                table_name: tableName,
                record_id: id,
                data: existingData,
                deleted_by: req.headers['x-user'] || 'Unknown'
            });
        }
        
        // Delete from main table
        const { error } = await supabase
            .from(tableName)
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        res.json({
            success: true,
            message: `${service} data deleted successfully`
        });
        
    } catch (error) {
        handleError(res, error, `Error deleting ${req.params.service} data`);
    }
});

module.exports = router;