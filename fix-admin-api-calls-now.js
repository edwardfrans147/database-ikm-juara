// Script untuk memperbaiki API calls di semua halaman admin
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

function fixAdminAPICalls() {
    console.log('🔧 Memperbaiki API calls di halaman admin...');
    
    adminFiles.forEach(filePath => {
        try {
            if (fs.existsSync(filePath)) {
                let content = fs.readFileSync(filePath, 'utf8');
                
                // Replace API calls yang bermasalah dengan yang bekerja
                content = content.replace(/getData\('([^']+)'\)/g, (match, endpoint) => {
                    console.log(`   Fixing API call: ${endpoint}`);
                    return `getData('${endpoint}')`;
                });
                
                // Tambahkan script inline untuk override API calls
                if (content.includes('</body>') && !content.includes('// API Override')) {
                    const apiOverride = `
    <script>
        // API Override untuk memastikan endpoint bekerja
        const originalGetData = window.getData;
        window.getData = async function(endpoint) {
            try {
                console.log('🌐 API Call:', endpoint);
                const response = await fetch('/api/' + endpoint, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache'
                    }
                });
                
                if (!response.ok) {
                    throw new Error('HTTP ' + response.status);
                }
                
                const data = await response.json();
                console.log('📊 API Response:', data);
                return data;
            } catch (error) {
                console.error('❌ API Error:', error);
                throw error;
            }
        };
        
        // Override untuk dashboard data loading
        if (typeof loadDashboardData !== 'undefined') {
            const originalLoadDashboard = loadDashboardData;
            window.loadDashboardData = async function(forceRefresh = false) {
                try {
                    console.log('📊 Loading dashboard data...');
                    const data = await fetch('/api/dashboard', {
                        headers: { 'Cache-Control': 'no-cache' }
                    });
                    const result = await data.json();
                    
                    // Update dashboard cards
                    if (document.getElementById('ikm-binaan')) {
                        document.getElementById('ikm-binaan').textContent = result.ikmBinaan || 0;
                    }
                    if (document.getElementById('hki-merek')) {
                        document.getElementById('hki-merek').textContent = result.hkiMerek || 0;
                    }
                    if (document.getElementById('sertifikat-halal')) {
                        document.getElementById('sertifikat-halal').textContent = result.sertifikatHalal || 0;
                    }
                    if (document.getElementById('tkdn-ik')) {
                        document.getElementById('tkdn-ik').textContent = result.tkdnIk || 0;
                    }
                    if (document.getElementById('siinas')) {
                        document.getElementById('siinas').textContent = result.siinas || 0;
                    }
                    if (document.getElementById('uji-nilai-gizi')) {
                        document.getElementById('uji-nilai-gizi').textContent = result.ujiNilaiGizi || 0;
                    }
                    if (document.getElementById('kurasi-produk')) {
                        document.getElementById('kurasi-produk').textContent = result.kurasiProduk || 0;
                    }
                    if (document.getElementById('pelatihan-pemberdayaan')) {
                        document.getElementById('pelatihan-pemberdayaan').textContent = result.pelatihanPemberdayaan || 0;
                    }
                    if (document.getElementById('total-peserta-pelatihan')) {
                        document.getElementById('total-peserta-pelatihan').textContent = result.totalPesertaPelatihan || 0;
                    }
                    
                    console.log('✅ Dashboard loaded successfully');
                } catch (error) {
                    console.error('❌ Dashboard loading failed:', error);
                }
            };
        }
    </script>`;
                    
                    content = content.replace('</body>', apiOverride + '\n</body>');
                }
                
                fs.writeFileSync(filePath, content);
                console.log(`✅ Fixed API calls: ${filePath}`);
            } else {
                console.log(`⚠️ File not found: ${filePath}`);
            }
        } catch (error) {
            console.error(`❌ Error fixing ${filePath}:`, error.message);
        }
    });
    
    console.log('\n🎯 API calls fixing completed!');
}

fixAdminAPICalls();