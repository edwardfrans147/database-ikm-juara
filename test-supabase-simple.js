// Simple Supabase connection test (CommonJS)
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🧪 TESTING SUPABASE CONNECTION...');
console.log('=====================================');

// Debug environment variables
console.log('\n🔧 Environment Variables:');
console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('Anon Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
console.log('Service Key:', supabaseServiceKey ? '✅ Set' : '❌ Missing');

if (!supabaseUrl || !supabaseAnonKey) {
    console.log('\n❌ Missing environment variables!');
    console.log('Please check your .env.local file');
    process.exit(1);
}

// Create clients
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
    try {
        console.log('\n1️⃣ Testing basic connection...');
        
        // Test basic connection
        const { data, error } = await supabase
            .from('ikm_binaan')
            .select('count', { count: 'exact' })
            .limit(1);
        
        if (error) {
            console.log('❌ Connection failed:', error.message);
            return false;
        }
        
        console.log('✅ Basic connection: SUCCESS');
        
        // Test admin connection
        console.log('\n2️⃣ Testing admin connection...');
        const { data: adminData, error: adminError } = await supabaseAdmin
            .from('admin_users')
            .select('count', { count: 'exact' })
            .limit(1);
        
        if (adminError) {
            console.log('❌ Admin connection failed:', adminError.message);
        } else {
            console.log('✅ Admin connection: SUCCESS');
        }
        
        // Test website content
        console.log('\n3️⃣ Testing website content...');
        const { data: contentData, error: contentError } = await supabase
            .from('website_content')
            .select('*')
            .limit(5);
        
        if (contentError) {
            console.log('❌ Website content failed:', contentError.message);
        } else {
            console.log('✅ Website content: SUCCESS');
            console.log(`   Found ${contentData.length} content items`);
        }
        
        console.log('\n🎉 CONNECTION TEST COMPLETED SUCCESSFULLY!');
        return true;
        
    } catch (error) {
        console.log('\n💥 CRITICAL ERROR:', error.message);
        return false;
    }
}

// Run test
testConnection().then(success => {
    process.exit(success ? 0 : 1);
});