// Test Supabase Connection Script
const { testConnection, publicDB, adminDB } = require('./lib/supabase.js');

async function runTests() {
    console.log('🧪 TESTING SUPABASE CONNECTION...');
    console.log('=====================================');
    
    try {
        // Test 1: Basic Connection
        console.log('\n1️⃣ Testing basic connection...');
        const connectionResult = await testConnection();
        
        if (connectionResult) {
            console.log('✅ Basic connection: SUCCESS');
        } else {
            console.log('❌ Basic connection: FAILED');
            return false;
        }
        
        // Test 2: Public Database Access
        console.log('\n2️⃣ Testing public database access...');
        try {
            const publicData = await publicDB.getAll('ikm_binaan', { limit: 1 });
            console.log('✅ Public DB access: SUCCESS');
            console.log(`   Found ${publicData.length} records`);
        } catch (error) {
            console.log('❌ Public DB access: FAILED');
            console.log(`   Error: ${error.message}`);
        }
        
        // Test 3: Admin Database Access
        console.log('\n3️⃣ Testing admin database access...');
        try {
            const adminData = await adminDB.getAll('admin_users', { limit: 1 });
            console.log('✅ Admin DB access: SUCCESS');
            console.log(`   Found ${adminData.length} admin users`);
        } catch (error) {
            console.log('❌ Admin DB access: FAILED');
            console.log(`   Error: ${error.message}`);
        }
        
        // Test 4: Website Content Access
        console.log('\n4️⃣ Testing website content access...');
        try {
            const contentData = await publicDB.getAll('website_content', { limit: 5 });
            console.log('✅ Website content access: SUCCESS');
            console.log(`   Found ${contentData.length} content items`);
        } catch (error) {
            console.log('❌ Website content access: FAILED');
            console.log(`   Error: ${error.message}`);
        }
        
        // Test 5: Dashboard Stats
        console.log('\n5️⃣ Testing dashboard statistics...');
        try {
            const stats = await adminDB.getDashboardStats();
            console.log('✅ Dashboard stats: SUCCESS');
            console.log(`   IKM Binaan: ${stats.ikmBinaan}`);
            console.log(`   HKI Merek: ${stats.hkiMerek}`);
            console.log(`   Sertifikat Halal: ${stats.sertifikatHalal}`);
        } catch (error) {
            console.log('❌ Dashboard stats: FAILED');
            console.log(`   Error: ${error.message}`);
        }
        
        console.log('\n🎉 CONNECTION TEST COMPLETED!');
        console.log('=====================================');
        
        return true;
        
    } catch (error) {
        console.log('\n💥 CRITICAL ERROR:');
        console.log(`   ${error.message}`);
        console.log('\n📋 TROUBLESHOOTING STEPS:');
        console.log('1. Check your .env.local file');
        console.log('2. Verify Supabase project is running');
        console.log('3. Confirm API keys are correct');
        console.log('4. Ensure database schema is created');
        
        return false;
    }
}

// Run the tests
if (require.main === module) {
    runTests().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = { runTests };