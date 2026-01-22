-- INSERT ADMIN USER DATA
-- Copy dan paste ke SQL Editor Supabase

-- Insert default admin user
INSERT INTO admin_users (username, password_hash, nama, role, is_active) VALUES 
('BidIndustri08#', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator IKM JUARA', 'super_admin', true)
ON CONFLICT (username) DO NOTHING;

-- Catatan: Password hash di atas adalah untuk password "password123"
-- Untuk keamanan, ganti dengan password hash yang sebenarnya

-- Verifikasi data
SELECT username, nama, role, is_active, created_at FROM admin_users;