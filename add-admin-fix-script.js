// Script untuk menambahkan admin-fix.js ke semua halaman admin
const fs = require('fs');

const adminFiles = [
    'admin/index.html',
    'admin/ikm-binaan.html',
    'admin/inputan-layanan.html',
    'admin/layanan-ikm.html',
    'admin/pelatihan.html',
    'admin/penelusuran.html',
    'admin/recycle-bin.html',
    'admin/activity-logs.html',
    'admin/edit-redaksi.html'
];

function addAdminFixScript() {
    console.log('🔧 Menambahkan admin-fix.js ke semua halaman admin...');
    
    adminFiles.forEach(filePath => {
        try {
            if (fs.existsSync(filePath)) {
                let content = fs.readFileSync(filePath, 'utf8');
                
                // Check if admin-fix.js already included
                if (!content.includes('admin-fix.js')) {
                    // Add admin-fix.js before the closing </body> tag
                    const adminFixScript = '    <script src="../shared/admin-fix.js"></script>\n';
                    content = content.replace('</body>', adminFixScript + '</body>');
                    
                    fs.writeFileSync(filePath, content);
                    console.log(`✅ Added admin-fix.js to: ${filePath}`);
                } else {
                    console.log(`⚠️ admin-fix.js already exists in: ${filePath}`);
                }
            } else {
                console.log(`⚠️ File not found: ${filePath}`);
            }
        } catch (error) {
            console.error(`❌ Error adding script to ${filePath}:`, error.message);
        }
    });
    
    console.log('\n🎯 Admin fix script addition completed!');
}

addAdminFixScript();