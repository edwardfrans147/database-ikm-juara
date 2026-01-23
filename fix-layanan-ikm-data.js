// Script untuk memperbaiki data layanan IKM yang tidak memiliki relasi dengan ikm_binaan
const { createClient } = require('@supabase/supabase-js');

// Hardcode untuk testing
const supabaseUrl = 'https://krylvwwguczwwoyqghlc.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeWx2d3dndWN6d3dveXFnaGxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA1ODg0MSwiZXhwIjoyMDg0NjM0ODQxfQ.ysubAuDeIPshMww709q092yI37j1wZUIwK5vQttUsmE';

console.log('🔧 Supabase URL:', supabaseUrl);
console.log('🔧 Service Key exists:', !!supabaseServiceKey);

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase configuration');
    console.log('URL:', supabaseUrl);
    console.log('Key exists:', !!supabaseServiceKey);
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
    console.log('🔍 Testing Supabase connection...');
    try {
        const { data, error } = await supabase
            .from('ikm_binaan')
            .select('count', { count: 'exact', head: true });
        
        if (error) {
            console.error('❌ Connection test failed:', error);
            return false;
        }
        
        console.log('✅ Connection successful, found', data?.count || 0, 'IKM records');
        return true;
    } catch (error) {
        console.error('❌ Connection exception:', error.message);
        return false;
    }
}

async function fixLayananIkmData() {
    console.log('🔧 Starting to fix layanan IKM data...\n');
    
    // Test connection first
    const connected = await testConnection();
    if (!connected) {
        console.error('❌ Cannot connect to Supabase. Exiting.');
        return;
    }
    
    try {
        // Get all IKM Binaan data for reference
        const { data: ikmBinaanData, error: ikmError } = await supabase
            .from('ikm_binaan')
            .select('*');
        
        if (ikmError) {
            console.error('❌ Error fetching IKM Binaan data:', ikmError);
            return;
        }
        
        console.log(`📋 Found ${ikmBinaanData.length} IKM Binaan records`);
        
        if (ikmBinaanData.length === 0) {
            console.log('⚠️  No IKM Binaan data found. Please add some IKM data first.');
            return;
        }
        
        // Create lookup maps
        const nibToIkm = {};
        const nikToIkm = {};
        const namaToIkm = {};
        
        ikmBinaanData.forEach(ikm => {
            if (ikm.nib) nibToIkm[ikm.nib] = ikm;
            if (ikm.nik) nikToIkm[ikm.nik] = ikm;
            if (ikm.nama_lengkap) namaToIkm[ikm.nama_lengkap.toLowerCase()] = ikm;
        });
        
        console.log('📊 Created lookup maps:');
        console.log(`   - NIB map: ${Object.keys(nibToIkm).length} entries`);
        console.log(`   - NIK map: ${Object.keys(nikToIkm).length} entries`);
        console.log(`   - Name map: ${Object.keys(namaToIkm).length} entries`);
        
        // Tables to fix
        const tables = [
            'hki_merek',
            'sertifikat_halal',
            'tkdn_ik',
            'siinas',
            'uji_nilai_gizi',
            'kurasi_produk'
        ];
        
        for (const tableName of tables) {
            console.log(`\n🔍 Processing ${tableName}...`);
            
            const { data: tableData, error: tableError } = await supabase
                .from(tableName)
                .select('*');
            
            if (tableError) {
                console.error(`❌ Error fetching ${tableName} data:`, tableError);
                continue;
            }
            
            console.log(`   Found ${tableData.length} records`);
            
            if (tableData.length === 0) {
                console.log(`   ⚠️  No data in ${tableName}`);
                continue;
            }
            
            let fixedCount = 0;
            let errorCount = 0;
            let alreadyLinkedCount = 0;
            
            for (const record of tableData) {
                try {
                    // Skip if already has ikm_binaan_id
                    if (record.ikm_binaan_id) {
                        alreadyLinkedCount++;
                        continue;
                    }
                    
                    let matchedIkm = null;
                    
                    // Try to match by NIB first
                    if (record.nib && nibToIkm[record.nib]) {
                        matchedIkm = nibToIkm[record.nib];
                        console.log(`   🔗 Matched by NIB: ${record.nib} -> ${matchedIkm.nama_lengkap}`);
                    }
                    // Try to match by NIK
                    else if (record.nik && nikToIkm[record.nik]) {
                        matchedIkm = nikToIkm[record.nik];
                        console.log(`   🔗 Matched by NIK: ${record.nik} -> ${matchedIkm.nama_lengkap}`);
                    }
                    // Try to match by name
                    else if (record.nama_lengkap && namaToIkm[record.nama_lengkap.toLowerCase()]) {
                        matchedIkm = namaToIkm[record.nama_lengkap.toLowerCase()];
                        console.log(`   🔗 Matched by Name: ${record.nama_lengkap} -> ${matchedIkm.nama_lengkap}`);
                    }
                    
                    if (matchedIkm) {
                        // Update record with ikm_binaan_id and correct data
                        const updateData = {
                            ikm_binaan_id: matchedIkm.id,
                            nama_lengkap: matchedIkm.nama_lengkap,
                            nama_usaha: matchedIkm.nama_usaha
                        };
                        
                        const { error: updateError } = await supabase
                            .from(tableName)
                            .update(updateData)
                            .eq('id', record.id);
                        
                        if (updateError) {
                            console.error(`   ❌ Error updating record ${record.id}:`, updateError.message);
                            errorCount++;
                        } else {
                            console.log(`   ✅ Fixed record ${record.id} - linked to IKM ${matchedIkm.nama_lengkap}`);
                            fixedCount++;
                        }
                    } else {
                        console.log(`   ⚠️  No match found for record ${record.id}:`);
                        console.log(`      - NIB: ${record.nib || 'N/A'}`);
                        console.log(`      - NIK: ${record.nik || 'N/A'}`);
                        console.log(`      - Name: ${record.nama_lengkap || 'N/A'}`);
                    }
                } catch (error) {
                    console.error(`   ❌ Exception processing record ${record.id}:`, error.message);
                    errorCount++;
                }
            }
            
            console.log(`   📊 ${tableName} Summary:`);
            console.log(`      - Already linked: ${alreadyLinkedCount}`);
            console.log(`      - Fixed: ${fixedCount}`);
            console.log(`      - Errors: ${errorCount}`);
        }
        
        console.log('\n✅ Data fixing completed!');
        
    } catch (error) {
        console.error('❌ Fatal error:', error);
    }
}

// Run the fix
fixLayananIkmData();