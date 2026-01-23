-- Insert admin users data to Supabase
-- This script migrates admin users from JSON to Supabase

-- First, add password column for compatibility (temporary)
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Insert admin users data
INSERT INTO admin_users (username, password, password_hash, nama, role, last_login, created_at) VALUES 
('BidIndustri08#', 'BidIndustri08#', 'BidIndustri08#', 'Admin DisnakerKUKM', 'super_admin', '2026-01-22T05:35:14.028Z', '2024-01-01T00:00:00.000Z'),
('admin_ikm', 'IKM2024@Madiun', 'IKM2024@Madiun', 'Administrator IKM', 'admin', '2026-01-21T16:27:48.189Z', '2024-01-21T00:00:00.000Z'),
('supervisor_data', 'DataSupervisor#123', 'DataSupervisor#123', 'Supervisor Data', 'admin', '2026-01-21T16:28:25.760Z', '2024-01-21T00:00:00.000Z'),
('operator_sistem', 'SistemOp@2024', 'SistemOp@2024', 'Operator Sistem', 'admin', NULL, '2024-01-21T00:00:00.000Z'),
('koordinator_ikm', 'KoordIKM!2024', 'KoordIKM!2024', 'Koordinator IKM', 'admin', '2026-01-21T17:20:14.609Z', '2024-01-21T00:00:00.000Z'),
('manager_data', 'DataManager$456', 'DataManager$456', 'Manager Data', 'admin', NULL, '2024-01-21T00:00:00.000Z')
ON CONFLICT (username) DO UPDATE SET
    password = EXCLUDED.password,
    password_hash = EXCLUDED.password_hash,
    nama = EXCLUDED.nama,
    role = EXCLUDED.role,
    last_login = EXCLUDED.last_login;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- Update RLS policies for admin_users
DROP POLICY IF EXISTS "Admin full access for admin_users" ON admin_users;
CREATE POLICY "Public read access for admin_users" ON admin_users FOR SELECT USING (true);
CREATE POLICY "Admin update access for admin_users" ON admin_users FOR UPDATE USING (auth.role() = 'authenticated');