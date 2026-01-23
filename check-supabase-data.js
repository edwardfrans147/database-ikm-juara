// Check data directly in Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://krylvwwguczwwoyqghlc.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeWx2d3dndWN6d3dveXFnaGxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA1ODg0MSwiZXhwIjoyMDg0NjM0ODQxfQ.ysubAuDeIPshMww709q092yI37j1wZUIwK5vQttUsmE';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkData() {
    console.log('🔍 Checking data in Supabase tables...\n');
    
    const tables = [
        'ikm_binaan', 'hki_merek', 'sertifikat_halal', 'tkdn_ik', 
        'siinas', 'uji_nilai_gizi', 'kurasi_produk', 'pelatihan_pemberdayaan', 'peserta_pelatihan'
    ];
    
    for (const table of tables) {
        try {
            console.log(`📋 Checking ${table}:`);
            
            // Get count
            const { count, error: countError } = await supabase
                .from(table)
                .select('*', { count: 'exact', head: true });
            
            if (countError) {
                console.log(`   ❌ Count error: ${countError.message}`);
                continue;
            }
            
            console.log(`   📊 Count: ${count} records`);
            
            // Get sample data
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .limit(3);
            
            if (error) {
                console.log(`   ❌ Data error: ${error.message}`);
            } else if (data && data.length > 0) {
                console.log(`   ✅ Sample data:`);
                data.forEach((item, index) => {
                    const displayData = {};
                    Object.keys(item).slice(0, 3).forEach(key => {
                        displayData[key] = item[key];
                    });
                    console.log(`     ${index + 1}. ${JSON.stringify(displayData)}`);
                });
            } else {
                console.log(`   ⚠️  No data found`);
            }
            
        } catch (e) {
            console.log(`   ❌ Error checking ${table}: ${e.message}`);
        }
        
        console.log('');
    }
    
    // Test API endpoints
    console.log('🧪 Testing API endpoints...\n');
    
    try {
        // Test IKM Binaan API
        console.log('📋 Testing IKM Binaan API:');
        const { data: ikmData, error: ikmError } = await supabase
            .from('ikm_binaan')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (ikmError) {
            console.log(`   ❌ API Error: ${ikmError.message}`);
        } else {
            console.log(`   ✅ API Success: ${ikmData.length} records`);
        }
        
        // Test HKI Merek API
        console.log('\n📋 Testing HKI Merek API:');
        const { data: hkiData, error: hkiError } = await supabase
            .from('hki_merek')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (hkiError) {
            console.log(`   ❌ API Error: ${hkiError.message}`);
        } else {
            console.log(`   ✅ API Success: ${hkiData.length} records`);
        }
        
    } catch (e) {
        console.log(`❌ API Test Error: ${e.message}`);
    }
}

checkData().catch(console.error);