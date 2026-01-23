// Script to fix CSS and JS paths in all admin HTML files
const fs = require('fs');
const path = require('path');

const adminFiles = [
    'admin/activity-logs.html',
    'admin/edit-redaksi.html', 
    'admin/ikm-binaan.html',
    'admin/inputan-layanan.html',
    'admin/layanan-ikm.html',
    'admin/login.html',
    'admin/pelatihan.html',
    'admin/penelusuran.html',
    'admin/recycle-bin.html'
];

console.log('🔧 Fixing CSS and JS paths in admin files...\n');

adminFiles.forEach(filePath => {
    try {
        console.log(`📝 Processing: ${filePath}`);
        
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Fix CSS path
        if (content.includes('href="/style.css"')) {
            content = content.replace(/href="\/style\.css"/g, 'href="/shared/style.css"');
            modified = true;
            console.log('   ✅ Fixed CSS path');
        }
        
        // Fix JS path
        if (content.includes('src="/script.js"')) {
            content = content.replace(/src="\/script\.js"/g, 'src="/shared/script.js"');
            modified = true;
            console.log('   ✅ Fixed JS path');
        }
        
        if (modified) {
            fs.writeFileSync(filePath, content);
            console.log('   💾 File updated');
        } else {
            console.log('   ⏭️  No changes needed');
        }
        
    } catch (error) {
        console.log(`   ❌ Error processing ${filePath}:`, error.message);
    }
    
    console.log('');
});

console.log('🎯 All admin files processed!');
console.log('📋 Next steps:');
console.log('   1. Push changes to GitHub');
console.log('   2. Wait for Vercel redeploy');
console.log('   3. Test admin dashboard styling');