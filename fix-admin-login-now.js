// Script untuk memperbaiki login admin dengan memasukkan data admin yang benar
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://krylvwwguczwwoyqghlc.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeWx2d3dndWN6d3dveXFnaGxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA1ODg0MSwiZXhwIjoyMDg0NjM0ODQxfQ.ysubAuDeIPshMww709q092yI37j1wZUIwK5vQttUsmE';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const adminUsers = [
    {
        username: 'BidIndustri08#',
        password_hash: 'BidIndustri08#', // Plain text for now, should be hashed in production
        nama: 'Admin DisnakerKUKM',
        role: 'super_admin'
    },
    {
        username: 'admin_ikm',
        password_hash: 'IKM2024@Madiun',
        nama: 'Administrator IKM',
        role: 'admin'
    },
    {
        username: 'supervisor_data',
        password_hash: 'DataSupervisor#123',
        nama: 'Supervisor Data',
        role: 'admin'
    },
    {
        username: 'operator_sistem',
        password_hash: 'SistemOp@2024',
        nama: 'Operator Sistem',
        role: 'admin'
    },
    {
        username: 'koordinator_ikm',
        password_hash: 'KoordIKM!2024',
        nama: 'Koordinator IKM',
        role: 'admin'
    },
    {
        username: 'manager_data',
        password_hash: 'DataManager$456',
        nama: 'Manager Data',
        role: 'admin'
    }
];

async function fixAdminLogin() {
    try {
        console.log('🔧 Memperbaiki login admin...');
        
        // Delete existing admin users first
        console.log('🗑️ Menghapus admin users yang ada...');
        const { error: deleteError } = await supabase
            .from('admin_users')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
        
        if (deleteError) {
            console.log('⚠️ Error deleting existing users (might not exist):', deleteError.message);
        }
        
        // Insert new admin users
        console.log('➕ Memasukkan admin users baru...');
        for (const user of adminUsers) {
            const { data, error } = await supabase
                .from('admin_users')
                .insert(user)
                .select()
                .single();
            
            if (error) {
                console.error(`❌ Error inserting user ${user.username}:`, error);
            } else {
                console.log(`✅ User ${user.username} berhasil ditambahkan`);
            }
        }
        
        // Test login with main admin
        console.log('\n🧪 Testing login...');
        const { data: testUser, error: testError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('username', 'BidIndustri08#')
            .eq('password_hash', 'BidIndustri08#')
            .single();
        
        if (testError) {
            console.error('❌ Test login failed:', testError);
        } else {
            console.log('✅ Test login berhasil:', testUser.nama);
        }
        
        console.log('\n🎯 SELESAI! Admin users berhasil diperbaiki');
        console.log('\n📋 Akun yang tersedia:');
        adminUsers.forEach(user => {
            console.log(`   Username: ${user.username}`);
            console.log(`   Password: ${user.password_hash}`);
            console.log(`   Nama: ${user.nama}`);
            console.log(`   Role: ${user.role}`);
            console.log('   ---');
        });
        
        console.log('\n🌐 Test login di: https://apkfixikmjuara.vercel.app/admin/login.html');
        
    } catch (error) {
        console.error('💥 Error:', error);
    }
}

fixAdminLogin();