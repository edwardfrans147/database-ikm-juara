// Supabase client configuration
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project-id.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key'

// Client untuk public access (read-only)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true
    }
})

// Client untuk admin operations (full access)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

// Database helper functions
export class SupabaseDB {
    constructor(isAdmin = false) {
        this.client = isAdmin ? supabaseAdmin : supabase
    }

    // Generic CRUD operations
    async getAll(table, options = {}) {
        try {
            let query = this.client.from(table).select('*')
            
            if (options.orderBy) {
                query = query.order(options.orderBy.column, { ascending: options.orderBy.ascending })
            }
            
            if (options.limit) {
                query = query.limit(options.limit)
            }
            
            const { data, error } = await query
            
            if (error) throw error
            return data
        } catch (error) {
            console.error(`Error getting ${table}:`, error)
            throw error
        }
    }

    async getById(table, id) {
        try {
            const { data, error } = await this.client
                .from(table)
                .select('*')
                .eq('id', id)
                .single()
            
            if (error) throw error
            return data
        } catch (error) {
            console.error(`Error getting ${table} by id:`, error)
            throw error
        }
    }

    async create(table, data) {
        try {
            const { data: result, error } = await this.client
                .from(table)
                .insert(data)
                .select()
                .single()
            
            if (error) throw error
            return result
        } catch (error) {
            console.error(`Error creating ${table}:`, error)
            throw error
        }
    }

    async update(table, id, data) {
        try {
            const { data: result, error } = await this.client
                .from(table)
                .update(data)
                .eq('id', id)
                .select()
                .single()
            
            if (error) throw error
            return result
        } catch (error) {
            console.error(`Error updating ${table}:`, error)
            throw error
        }
    }

    async delete(table, id) {
        try {
            const { data, error } = await this.client
                .from(table)
                .delete()
                .eq('id', id)
                .select()
                .single()
            
            if (error) throw error
            return data
        } catch (error) {
            console.error(`Error deleting ${table}:`, error)
            throw error
        }
    }

    // Specific methods for IKM JUARA
    async searchIKM(query) {
        try {
            const { data, error } = await this.client
                .from('ikm_binaan')
                .select('*')
                .or(`nib.eq.${query},nik.eq.${query},nama_lengkap.ilike.%${query}%`)
            
            if (error) throw error
            return data
        } catch (error) {
            console.error('Error searching IKM:', error)
            throw error
        }
    }

    async getIKMWithServices(ikmId) {
        try {
            // Get IKM data
            const ikm = await this.getById('ikm_binaan', ikmId)
            
            // Get all related services
            const [hkiMerek, sertifikatHalal, tkdnIk, siinas, ujiNilaiGizi, kurasiProduk] = await Promise.all([
                this.getAll('hki_merek', { where: { ikm_binaan_id: ikmId } }),
                this.getAll('sertifikat_halal', { where: { ikm_binaan_id: ikmId } }),
                this.getAll('tkdn_ik', { where: { ikm_binaan_id: ikmId } }),
                this.getAll('siinas', { where: { ikm_binaan_id: ikmId } }),
                this.getAll('uji_nilai_gizi', { where: { ikm_binaan_id: ikmId } }),
                this.getAll('kurasi_produk', { where: { ikm_binaan_id: ikmId } })
            ])

            return {
                ikm,
                services: {
                    hkiMerek,
                    sertifikatHalal,
                    tkdnIk,
                    siinas,
                    ujiNilaiGizi,
                    kurasiProduk
                }
            }
        } catch (error) {
            console.error('Error getting IKM with services:', error)
            throw error
        }
    }

    async getDashboardStats() {
        try {
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
                this.client.from('ikm_binaan').select('id', { count: 'exact' }),
                this.client.from('hki_merek').select('id', { count: 'exact' }),
                this.client.from('sertifikat_halal').select('id', { count: 'exact' }),
                this.client.from('tkdn_ik').select('id', { count: 'exact' }),
                this.client.from('siinas').select('id', { count: 'exact' }),
                this.client.from('uji_nilai_gizi').select('id', { count: 'exact' }),
                this.client.from('kurasi_produk').select('id', { count: 'exact' }),
                this.client.from('pelatihan_pemberdayaan').select('id', { count: 'exact' }),
                this.client.from('peserta_pelatihan').select('id', { count: 'exact' })
            ])

            return {
                ikmBinaan: ikmBinaan.count,
                hkiMerek: hkiMerek.count,
                sertifikatHalal: sertifikatHalal.count,
                tkdnIk: tkdnIk.count,
                siinas: siinas.count,
                ujiNilaiGizi: ujiNilaiGizi.count,
                kurasiProduk: kurasiProduk.count,
                pelatihanPemberdayaan: pelatihan.count,
                totalPesertaPelatihan: pesertaPelatihan.count,
                lastUpdated: new Date().toISOString()
            }
        } catch (error) {
            console.error('Error getting dashboard stats:', error)
            throw error
        }
    }

    async logActivity(activityData) {
        try {
            const { data, error } = await this.client
                .from('activity_logs')
                .insert({
                    type: activityData.type || 'admin_activity',
                    action: activityData.action,
                    user_name: activityData.user,
                    details: activityData.details,
                    success: activityData.success !== false,
                    ip_address: activityData.ip,
                    user_agent: activityData.userAgent
                })
            
            if (error) throw error
            return data
        } catch (error) {
            console.error('Error logging activity:', error)
            // Don't throw error for logging failures
        }
    }
}

// Export instances
export const publicDB = new SupabaseDB(false)
export const adminDB = new SupabaseDB(true)

// Connection test
export async function testConnection() {
    try {
        const { data, error } = await supabase
            .from('ikm_binaan')
            .select('count', { count: 'exact' })
            .limit(1)
        
        if (error) throw error
        
        console.log('✅ Supabase connection successful')
        return true
    } catch (error) {
        console.error('❌ Supabase connection failed:', error)
        return false
    }
}