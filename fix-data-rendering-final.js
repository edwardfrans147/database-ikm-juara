#!/usr/bin/env node

/**
 * 🔧 FIX DATA RENDERING FINAL
 * 
 * Masalah: API berhasil return data tapi tidak ter-render di tabel
 * Solusi: Fix response handling dan table rendering
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing data rendering issues...\n');

// 1. Fix loadIKMBinaan function in ikm-binaan.html
const ikmBinaanPath = path.join(__dirname, 'admin', 'ikm-binaan.html');

if (fs.existsSync(ikmBinaanPath)) {
    console.log('📝 Fixing loadIKMBinaan function...');
    
    let content = fs.readFileSync(ikmBinaanPath, 'utf8');
    
    // Replace the problematic loadIKMBinaan function
    const oldLoadFunction = `        // Load IKM Binaan data
        const loadIKMBinaan = async () => {
            try {
                const response = await getData('ikm-binaan');
                const data = response.data || response; // Handle both response formats
                
                console.log('IKM Binaan data:', data); // Debug log
                
                const columns = [
                    { field: 'nib', title: 'No. NIB' },
                    { field: 'nik', title: 'No. NIK' },
                    { field: 'nama_lengkap', title: 'Nama Lengkap' },
                    { field: 'alamat_lengkap', title: 'Alamat Lengkap' },
                    { field: 'nama_usaha', title: 'Nama Usaha' },
                    { field: 'nomor_hp', title: 'No. HP' }
                ];
                
                const actions = [
                    { text: 'Edit', class: 'warning', onclick: 'editIKM' },
                    { text: 'Hapus', class: 'danger', onclick: 'deleteIKM' }
                ];
                
                document.getElementById('ikm-table').innerHTML = createTable(data, columns, actions);
                
                // Update data count indicator
                updateDataCount('ikm-binaan', data.length);
            } catch (error) {
                console.error('Failed to load IKM Binaan data:', error);
                showAlert('Gagal memuat data IKM Binaan', 'error');
            }
        };`;

    const newLoadFunction = `        // Load IKM Binaan data - FIXED VERSION
        const loadIKMBinaan = async () => {
            try {
                console.log('🔄 Loading IKM Binaan data...');
                
                // Show loading state
                document.getElementById('ikm-table').innerHTML = '<div style="text-align: center; padding: 20px;"><i class="fas fa-spinner fa-spin"></i> Memuat data...</div>';
                
                const response = await getData('ikm-binaan');
                console.log('📡 Raw API Response:', response);
                
                // Handle different response formats
                let data = [];
                if (response && response.success && Array.isArray(response.data)) {
                    data = response.data;
                } else if (Array.isArray(response)) {
                    data = response;
                } else if (response && Array.isArray(response.data)) {
                    data = response.data;
                } else {
                    console.warn('⚠️ Unexpected response format:', response);
                    data = [];
                }
                
                console.log('📊 Processed data:', data);
                console.log('📈 Data count:', data.length);
                
                if (!Array.isArray(data)) {
                    console.error('❌ Data is not an array:', typeof data, data);
                    throw new Error('Data format tidak valid');
                }
                
                if (data.length === 0) {
                    document.getElementById('ikm-table').innerHTML = \`
                        <div style="text-align: center; padding: 40px; color: #666;">
                            <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 15px; opacity: 0.5;"></i>
                            <h4>Belum Ada Data IKM Binaan</h4>
                            <p>Klik tombol "Tambah IKM Binaan" untuk menambah data pertama</p>
                        </div>
                    \`;
                    return;
                }
                
                const columns = [
                    { field: 'nib', title: 'No. NIB' },
                    { field: 'nik', title: 'No. NIK' },
                    { field: 'nama_lengkap', title: 'Nama Lengkap' },
                    { field: 'alamat_lengkap', title: 'Alamat Lengkap' },
                    { field: 'nama_usaha', title: 'Nama Usaha' },
                    { field: 'nomor_hp', title: 'No. HP' }
                ];
                
                const actions = [
                    { text: 'Edit', class: 'warning', onclick: 'editIKM' },
                    { text: 'Hapus', class: 'danger', onclick: 'deleteIKM' }
                ];
                
                console.log('🏗️ Creating table with', data.length, 'rows');
                const tableHtml = createTable(data, columns, actions);
                console.log('📋 Table HTML length:', tableHtml.length);
                
                document.getElementById('ikm-table').innerHTML = tableHtml;
                
                // Update data count indicator if function exists
                if (typeof updateDataCount === 'function') {
                    updateDataCount('ikm-binaan', data.length);
                }
                
                console.log('✅ IKM Binaan data loaded successfully');
                
            } catch (error) {
                console.error('❌ Failed to load IKM Binaan data:', error);
                document.getElementById('ikm-table').innerHTML = \`
                    <div style="text-align: center; padding: 40px; color: #e74c3c;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 15px;"></i>
                        <h4>Gagal Memuat Data</h4>
                        <p>\${error.message}</p>
                        <button class="btn btn-primary" onclick="loadIKMBinaan()">
                            <i class="fas fa-refresh"></i> Coba Lagi
                        </button>
                    </div>
                \`;
                showAlert('Gagal memuat data IKM Binaan: ' + error.message, 'error');
            }
        };`;

    if (content.includes(oldLoadFunction)) {
        content = content.replace(oldLoadFunction, newLoadFunction);
        console.log('✅ loadIKMBinaan function updated');
    } else {
        // Try to find and replace a more generic pattern
        const genericPattern = /const loadIKMBinaan = async \(\) => \{[\s\S]*?\};/;
        if (genericPattern.test(content)) {
            content = content.replace(genericPattern, newLoadFunction.trim());
            console.log('✅ loadIKMBinaan function updated (generic pattern)');
        } else {
            console.log('⚠️ Could not find loadIKMBinaan function to replace');
        }
    }
    
    fs.writeFileSync(ikmBinaanPath, content);
    console.log('✅ ikm-binaan.html updated');
}

// 2. Fix createTable function in shared/script.js
const scriptPath = path.join(__dirname, 'shared', 'script.js');

if (fs.existsSync(scriptPath)) {
    console.log('📝 Fixing createTable function...');
    
    let content = fs.readFileSync(scriptPath, 'utf8');
    
    // Enhanced createTable function
    const enhancedCreateTable = `
// Enhanced Table functions with better error handling
const createTable = (data, columns, actions = []) => {
    console.log('🏗️ createTable called with:', { dataLength: data?.length, columnsLength: columns?.length, actionsLength: actions?.length });
    
    if (!Array.isArray(data)) {
        console.error('❌ createTable: data is not an array:', typeof data, data);
        return '<div style="text-align: center; padding: 20px; color: #e74c3c;">Error: Data tidak valid</div>';
    }
    
    if (!Array.isArray(columns) || columns.length === 0) {
        console.error('❌ createTable: columns is not valid:', columns);
        return '<div style="text-align: center; padding: 20px; color: #e74c3c;">Error: Kolom tidak valid</div>';
    }
    
    let html = '<div class="table-responsive"><table class="table table-striped table-hover"><thead class="table-dark"><tr>';
    
    // Add No. column
    html += '<th style="width: 60px; text-align: center;">No.</th>';
    
    columns.forEach(col => {
        html += \`<th>\${col.title}</th>\`;
    });
    
    if (actions.length > 0) {
        html += '<th style="width: 150px; text-align: center;">Aksi</th>';
    }
    
    html += '</tr></thead><tbody>';
    
    if (data.length === 0) {
        const colspan = columns.length + (actions.length > 0 ? 2 : 1);
        html += \`<tr><td colspan="\${colspan}" style="text-align: center; padding: 40px; color: #666;">Tidak ada data</td></tr>\`;
    } else {
        data.forEach((item, index) => {
            html += '<tr>';
            
            // Add row number
            html += \`<td style="text-align: center; font-weight: bold; color: #7f8c8d;">\${index + 1}</td>\`;
            
            columns.forEach(col => {
                let value = item[col.field];
                
                // Handle different field name formats
                if (value === undefined || value === null) {
                    // Try alternative field names
                    const altField = col.field.replace(/_/g, '');
                    value = item[altField];
                }
                
                if (col.format && typeof col.format === 'function') {
                    try {
                        value = col.format(value, item);
                    } catch (formatError) {
                        console.warn('Format error for field', col.field, ':', formatError);
                        value = value || '-';
                    }
                }
                
                // Ensure value is not undefined/null
                if (value === undefined || value === null || value === '') {
                    value = '-';
                }
                
                // Truncate long text
                if (typeof value === 'string' && value.length > 50) {
                    value = \`<span title="\${value}">\${value.substring(0, 47)}...</span>\`;
                }
                
                html += \`<td>\${value}</td>\`;
            });
            
            if (actions.length > 0) {
                html += '<td style="text-align: center;">';
                actions.forEach((action, actionIndex) => {
                    const itemId = item.id || item.uuid || index;
                    html += \`<button class="btn btn-sm btn-\${action.class}" onclick="\${action.onclick}('\${itemId}')" style="margin: 2px;">\${action.text}</button>\`;
                });
                html += '</td>';
            }
            
            html += '</tr>';
        });
    }
    
    html += '</tbody></table></div>';
    
    console.log('✅ createTable generated HTML length:', html.length);
    return html;
};`;

    // Find and replace the createTable function
    const createTablePattern = /const createTable = \(data, columns, actions = \[\]\) => \{[\s\S]*?\};/;
    
    if (createTablePattern.test(content)) {
        content = content.replace(createTablePattern, enhancedCreateTable.trim());
        console.log('✅ createTable function updated');
    } else {
        console.log('⚠️ Could not find createTable function, appending...');
        content += '\n' + enhancedCreateTable;
    }
    
    fs.writeFileSync(scriptPath, content);
    console.log('✅ shared/script.js updated');
}

// 3. Create test script to verify data loading
const testScript = `
/**
 * Test Data Loading
 */

console.log('🧪 Testing data loading...');

// Test API endpoint directly
fetch('/api/ikm-binaan')
    .then(response => {
        console.log('📡 Response status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('📊 API Response:', data);
        
        if (data && data.success && Array.isArray(data.data)) {
            console.log('✅ Data format is correct');
            console.log('📈 Data count:', data.data.length);
            
            if (data.data.length > 0) {
                console.log('📋 Sample data:', data.data[0]);
            }
        } else {
            console.log('⚠️ Unexpected data format');
        }
    })
    .catch(error => {
        console.error('❌ API Error:', error);
    });

// Test if page functions exist
setTimeout(() => {
    if (typeof loadIKMBinaan === 'function') {
        console.log('✅ loadIKMBinaan function exists');
    } else {
        console.log('❌ loadIKMBinaan function not found');
    }
    
    if (typeof createTable === 'function') {
        console.log('✅ createTable function exists');
    } else {
        console.log('❌ createTable function not found');
    }
}, 1000);
`;

fs.writeFileSync('test-data-loading.js', testScript);
console.log('✅ Test script created: test-data-loading.js');

// 4. Create deployment script
const deployScript = `
Write-Host "🚀 Deploying data rendering fixes..." -ForegroundColor Green

# Deploy to Vercel
vercel --prod

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Test at: https://apkfixikmjuara.vercel.app/admin/ikm-binaan.html" -ForegroundColor Cyan

Write-Host ""
Write-Host "📋 TESTING STEPS:" -ForegroundColor Yellow
Write-Host "1. Clear browser cache (Ctrl+Shift+R)" -ForegroundColor White
Write-Host "2. Login to admin panel" -ForegroundColor White
Write-Host "3. Go to IKM Binaan page" -ForegroundColor White
Write-Host "4. Check console for debug logs" -ForegroundColor White
Write-Host "5. Verify data is displayed in table" -ForegroundColor White
`;

fs.writeFileSync('deploy-data-fix.ps1', deployScript);
console.log('✅ Deploy script created: deploy-data-fix.ps1');

console.log('\n🎉 DATA RENDERING FIX COMPLETED!\n');

console.log('📋 CHANGES MADE:');
console.log('✅ Enhanced loadIKMBinaan function with better error handling');
console.log('✅ Fixed response data parsing for different formats');
console.log('✅ Enhanced createTable function with debugging');
console.log('✅ Added loading states and error messages');
console.log('✅ Added comprehensive logging for debugging');

console.log('\n🚀 NEXT STEPS:');
console.log('1. Run: .\\deploy-data-fix.ps1');
console.log('2. Clear browser cache and test');
console.log('3. Check browser console for debug logs');
console.log('4. Verify data appears in IKM Binaan table');

console.log('\n🎯 Expected result: Data will be properly displayed in tables!');