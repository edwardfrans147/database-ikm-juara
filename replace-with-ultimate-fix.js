// Script untuk mengganti semua script dengan ultimate-admin-fix.js
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

function replaceWithUltimateFix() {
    console.log('🔄 Replacing all scripts with ultimate-admin-fix.js...');
    
    adminFiles.forEach(filePath => {
        try {
            if (fs.existsSync(filePath)) {
                let content = fs.readFileSync(filePath, 'utf8');
                
                // Remove all existing script references
                content = content.replace(/<script src="\.\.\/shared\/script\.js"><\/script>/g, '');
                content = content.replace(/<script src="\.\.\/shared\/admin-fix\.js"><\/script>/g, '');
                content = content.replace(/src="\/shared\/script\.js"/g, 'src="../shared/ultimate-admin-fix.js"');
                content = content.replace(/src="\/shared\/admin-fix\.js"/g, 'src="../shared/ultimate-admin-fix.js"');
                
                // Remove duplicate ultimate-admin-fix.js references
                const ultimateScriptCount = (content.match(/ultimate-admin-fix\.js/g) || []).length;
                if (ultimateScriptCount > 1) {
                    // Remove all references first
                    content = content.replace(/<script src="\.\.\/shared\/ultimate-admin-fix\.js"><\/script>/g, '');
                    
                    // Add single reference before </body>
                    content = content.replace('</body>', '    <script src="../shared/ultimate-admin-fix.js"></script>\n</body>');
                } else if (ultimateScriptCount === 0) {
                    // Add ultimate-admin-fix.js if not present
                    content = content.replace('</body>', '    <script src="../shared/ultimate-admin-fix.js"></script>\n</body>');
                }
                
                // Remove any inline API override scripts
                content = content.replace(/<script>\s*\/\/ API Override[\s\S]*?<\/script>/g, '');
                
                fs.writeFileSync(filePath, content);
                console.log(`✅ Updated: ${filePath}`);
            } else {
                console.log(`⚠️ File not found: ${filePath}`);
            }
        } catch (error) {
            console.error(`❌ Error updating ${filePath}:`, error.message);
        }
    });
    
    console.log('\n🎯 Ultimate fix replacement completed!');
    console.log('📋 All admin pages now use ultimate-admin-fix.js');
    console.log('🚀 This should resolve all API issues definitively');
}

replaceWithUltimateFix();