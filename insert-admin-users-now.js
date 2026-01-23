// Script to insert admin users directly to Supabase
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://krylvwwguczwwoyqghlc.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeWx2d3dndWN6d3dveXFnaGxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA1ODg0MSwiZXhwIjoyMDg0NjM0ODQxfQ.ysubAuDeIPshMww709q092yI37j1wZUIwK5vQttUsmE';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const adminUsers = [
    {
        username: 'BidIndustri08#',
        password: 'BidIndustri08#',
        password_hash: 'BidIndustri08#',
        nama: 'Admin DisnakerKUKM',
        role: 'super_admin'
    },
    {
        username: 'admin_ikm',
        password: 'IKM2024@Madiun',
        password_hash: 'IKM2024@Madiun',
        nama: 'Administrator IKM',
        role: 'admin'
    },
    {
        username: 'supervisor_data',
        password: 'DataSupervisor#123',
        password_hash: 'DataSupervisor#123',
        nama: 'Supervisor Data',
        role: 'admin'
    },
    {
        username: 'operator_sistem',
        password: 'SistemOp@2024',
        password_hash: 'SistemOp@2024',
        nama: 'Operator Sistem',
        role: 'admin'
    },
    {
        username: 'koordinator_ikm',
        password: 'KoordIKM!2024',
        password_hash: 'KoordIKM!2024',
        nama: 'Koordinator IKM',
        role: 'admin'
    },
    {
        username: 'manager_data',
        password: 'DataManager$456',
        password_hash: 'DataManager$456',
        nama: 'Manager Data',
        role: 'admin'
    }
];

async function insertAdminUsers() {
    console.log('🚀 Inserting admin users to Supabase...\n');

    try {
        // First, try to add password column if it doesn't exist
        console.log('📋 Adding password column...');
        const { error: alterError } = await supabase.rpc('exec_sql', {
            sql: 'ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS password VARCHAR(255);'
        });
        
        if (alterError) {
            console.log('⚠️  Column might already exist:', alterError.message);
        } else {
            console.log('✅ Password column added successfully');
        }

        // Insert admin users
        console.log('\n📝 Inserting admin users...');
        
        for (const user of adminUsers) {
            console.log(`   Adding: ${user.username} (${user.nama})`);
            
            const { data, error } = await supabase
                .from('admin_users')
                .upsert(user, { onConflict: 'username' });
            
            if (error) {
                console.log(`   ❌ Error adding ${user.username}:`, error.message);
            } else {
                console.log(`   ✅ ${user.username} added successfully`);
            }
        }

        // Verify insertion
        console.log('\n🔍 Verifying admin users...');
        const { data: users, error: selectError } = await supabase
            .from('admin_users')
            .select('username, nama, role');

        if (selectError) {
            console.log('❌ Error verifying users:', selectError.message);
        } else {
            console.log('✅ Admin users in database:');
            users.forEach(user => {
                console.log(`   - ${user.username}: ${user.nama} (${user.role})`);
            });
        }

        console.log('\n🎯 DONE! You can now login with:');
        console.log('   Username: BidIndustri08#');
        console.log('   Password: BidIndustri08#');
        console.log('\n🌐 Test at: https://apkfixikmjuara.vercel.app/admin/login.html');

    } catch (error) {
        console.error('❌ Script error:', error);
    }
}

insertAdminUsers();