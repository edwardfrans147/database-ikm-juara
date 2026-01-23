// Script untuk memperbaiki path di semua file admin secara urgent
const fs = require('fs');
const path = require('path');

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

function fixAdminPaths() {
    console.log('🔧 Memperbaiki path di file admin...');
    
    adminFiles.forEach(filePath => {
        try {
            if (fs.existsSync(filePath)) {
                let content = fs.readFileSync(filePath, 'utf8');
                
                // Fix CSS path
                content = content.replace(/href="\/shared\/style\.css"/g, 'href="../shared/style.css"');
                
                // Fix JS path
                content = content.replace(/src="\/shared\/script\.js"/g, 'src="../shared/script.js"');
                
                // Remove duplicate script tags
                content = content.replace(/(<script src="\.\.\/shared\/script\.js"><\/script>\s*){2,}/g, '<script src="../shared/script.js"></script>\n    ');
                
                fs.writeFileSync(filePath, content);
                console.log(`✅ Fixed: ${filePath}`);
            } else {
                console.log(`⚠️ File not found: ${filePath}`);
            }
        } catch (error) {
            console.error(`❌ Error fixing ${filePath}:`, error.message);
        }
    });
    
    console.log('\n🎯 Path fixing completed!');
}

fixAdminPaths();