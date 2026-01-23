// Vercel Serverless Function - Buku Tamu
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    try {
        if (req.method === 'POST') {
            // Simpan buku tamu
            const { nama_lengkap, no_hp_aktif, alamat } = req.body;
            
            if (!nama_lengkap || !no_hp_aktif || !alamat) {
                return res.status(400).json({
                    success: false,
                    error: 'Semua field harus diisi'
                });
            }
            
            const { data, error } = await supabaseAdmin
                .from('buku_tamu')
                .insert([{
                    nama_lengkap,
                    no_hp_aktif,
                    alamat,
                    tanggal_kunjungan: new Date().toISOString()
                }])
                .select();
            
            if (error) {
                console.error('Supabase error:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Gagal menyimpan data ke database',
                    details: error.message
                });
            }
            
            res.status(200).json({
                success: true,
                message: 'Buku tamu berhasil disimpan',
                data: data[0]
            });
            
        } else if (req.method === 'GET') {
            // Ambil data buku tamu
            const { data, error } = await supabase
                .from('buku_tamu')
                .select('*')
                .order('tanggal_kunjungan', { ascending: false });
            
            if (error) {
                console.error('Supabase error:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Gagal mengambil data',
                    details: error.message
                });
            }
            
            res.status(200).json({
                success: true,
                data: data || []
            });
            
        } else {
            res.status(405).json({
                success: false,
                error: 'Method not allowed'
            });
        }
        
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: error.message
        });
    }
}