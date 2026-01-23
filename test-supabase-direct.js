// Test Supabase connection directly with service role
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://krylvwwguczwwoyqghlc.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeWx2d3dndWN6d3dveXFnaGxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA1ODg0MSwiZXhwIjoyMDg0NjM0ODQxfQ.ysubAuDeIPshMww709q092yI37j1wZUIwK5vQttUsmE';

// Test with service role (should bypass RLS)
const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

// Test with anon key (like the API uses)
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeWx2d3dndWN6d3dveXFnaGxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNTg4NDEsImV4cCI6MjA4NDYzNDg0MX0.ikuvFZB4zjChsh-cM2MMMYYmWYTfC-P67gQZPBvCZqA';
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseAccess() {
    console.log('🧪 Testing Supabase access with different keys...\n');
    
    const tables = [
        'ikm_binaan', 'hki_merek', 'sertifikat_halal', 'tkdn_ik', 
        'siinas', 'uji_nilai_gizi', 'kurasi_produk', 'pelatihan_pemberdayaan', 'peserta_pelatihan'
    ];
    
    console.log('📋 Testing with SERVICE ROLE key (should work):');
    for (const table of tables) {
        try {
            const { count, error } = await supabaseService
                .from(table)
                .select('*', { count: 'exact', head: true });
            
            if (error) {
                console.log(`   ❌ ${table}: ${error.message}`);
            } else {
                console.log(`   ✅ ${table}: ${count} records`);
            }
        } catch (e) {
            console.log(`   ❌ ${table}: Exception - ${e.message}`);
        }
    }
    
    console.log('\n📋 Testing with ANON key (like API uses):');
    for (const table of tables) {
        try {
            const { count, error } = await supabaseAnon
                .from(table)
                .select('*', { count: 'exact', head: true });
            
            if (error) {
                console.log(`   ❌ ${table}: ${error.message}`);
            } else {
                console.log(`   ✅ ${table}: ${count} records`);
            }
        } catch (e) {
            console.log(`   ❌ ${table}: Exception - ${e.message}`);
        }
    }
    
    // Test the exact same query as the API
    console.log('\n🔍 Testing exact API query simulation:');
    try {
        const results = await Promise.all([
            supabaseAnon.from('ikm_binaan').select('*', { count: 'exact', head: true }),
            supabaseAnon.from('hki_merek').select('*', { count: 'exact', head: true }),
            supabaseAnon.from('sertifikat_halal').select('*', { count: 'exact', head: true }),
            supabaseAnon.from('tkdn_ik').select('*', { count: 'exact', head: true }),
            supabaseAnon.from('siinas').select('*', { count: 'exact', head: true }),
            supabaseAnon.from('uji_nilai_gizi').select('*', { count: 'exact', head: true }),
            supabaseAnon.from('kurasi_produk').select('*', { count: 'exact', head: true }),
            supabaseAnon.from('pelatihan_pemberdayaan').select('*', { count: 'exact', head: true }),
            supabaseAnon.from('peserta_pelatihan').select('*', { count: 'exact', head: true })
        ]);
        
        console.log('   📊 API Simulation Results:');
        console.log(`      IKM Binaan: ${results[0].count || 0}`);
        console.log(`      HKI Merek: ${results[1].count || 0}`);
        console.log(`      Sertifikat Halal: ${results[2].count || 0}`);
        console.log(`      TKDN IK: ${results[3].count || 0}`);
        console.log(`      SIINas: ${results[4].count || 0}`);
        console.log(`      Uji Nilai Gizi: ${results[5].count || 0}`);
        console.log(`      Kurasi Produk: ${results[6].count || 0}`);
        console.log(`      Pelatihan: ${results[7].count || 0}`);
        console.log(`      Peserta: ${results[8].count || 0}`);
        
        // Check for errors
        results.forEach((result, index) => {
            if (result.error) {
                console.log(`      ❌ Error in table ${index}: ${result.error.message}`);
            }
        });
        
    } catch (e) {
        console.log(`   ❌ API Simulation Error: ${e.message}`);
    }
}

testSupabaseAccess().catch(console.error);