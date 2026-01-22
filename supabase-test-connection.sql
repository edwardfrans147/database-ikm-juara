-- TEST CONNECTION SQL QUERY
-- Jalankan ini di SQL Editor Supabase untuk test koneksi

-- Test 1: Basic connection test
SELECT 'Connection successful!' as status, now() as timestamp;

-- Test 2: Check if tables exist (akan error jika belum ada schema)
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN (
        'ikm_binaan', 
        'hki_merek', 
        'sertifikat_halal', 
        'admin_users',
        'website_content'
    )
ORDER BY table_name;

-- Test 3: Count records in main tables (jika sudah ada data)
SELECT 
    'ikm_binaan' as table_name,
    count(*) as record_count
FROM ikm_binaan
UNION ALL
SELECT 
    'admin_users' as table_name,
    count(*) as record_count
FROM admin_users
UNION ALL
SELECT 
    'website_content' as table_name,
    count(*) as record_count
FROM website_content;

-- Test 4: Check database version and settings
SELECT 
    version() as postgresql_version,
    current_database() as database_name,
    current_user as current_user;