// ===== SCRIPT UTAMA WEBSITE IKM JUARA - FIXED VERSION =====
// Versi: 3.0 - Complete Data Display Fix
// Tanggal: 23 Januari 2026

// ===== KONFIGURASI GLOBAL =====
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3000/api' 
    : '/api';

// Cache untuk optimisasi performa
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

// ===== UTILITY FUNCTIONS =====
const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
};

const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(amount);
};

const showAlert = (message, type = 'info') => {
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) existingAlert.remove();
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 4px;
        color: white;
        z-index: 1000;
        max-width: 300px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.3s ease-out;
    `;
    
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    
    alertDiv.style.backgroundColor = colors[type] || colors.info;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
};

// ===== API FUNCTIONS - FIXED VERSION =====
const apiRequest = async (url, options = {}) => {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    
    // Add cache busting for GET requests
    if (!options.method || options.method === 'GET') {
        const separator = fullUrl.includes('?') ? '&' : '?';
        const finalUrl = `${fullUrl}${separator}_t=${Date.now()}`;
        
        console.log(`🌐 API Request: GET ${finalUrl}`);
        
        try {
            const response = await fetch(finalUrl, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log(`✅ API Response:`, data);
            return data;
        } catch (error) {
            console.error(`❌ API Error:`, error);
            throw error;
        }
    }
    
    // POST/PUT/DELETE requests
    console.log(`🌐 API Request: ${options.method || 'POST'} ${fullUrl}`);
    
    try {
        const response = await fetch(fullUrl, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`✅ API Response:`, data);
        return data;
    } catch (error) {
        console.error(`❌ API Error:`, error);
        throw error;
    }
};

// Enhanced getData function with proper response handling
const getData = async (endpoint) => {
    try {
        const response = await apiRequest(`/${endpoint}`);
        
        // Handle different response formats
        let data = [];
        
        if (response && response.success && Array.isArray(response.data)) {
            // Supabase format: { success: true, data: [...] }
            data = response.data;
        } else if (Array.isArray(response)) {
            // Direct array format: [...]
            data = response;
        } else if (response && Array.isArray(response.data)) {
            // Generic format: { data: [...] }
            data = response.data;
        } else if (response && typeof response === 'object') {
            // Dashboard format: { ikmBinaan: 7, hkiMerek: 1, ... }
            return response;
        } else {
            console.warn('⚠️ Unexpected response format:', response);
            data = [];
        }
        
        console.log(`📊 Processed ${endpoint} data:`, {
            count: data.length,
            sample: data[0] || 'No data'
        });
        
        return data;
    } catch (error) {
        console.error(`❌ Failed to get ${endpoint} data:`, error);
        showAlert(`Gagal memuat data ${endpoint}: ${error.message}`, 'error');
        return [];
    }
};

// ===== TABLE CREATION - FIXED VERSION =====
const createTable = (data, columns, actions = []) => {
    if (!Array.isArray(data) || data.length === 0) {
        return `
            <div style="text-align: center; padding: 40px; color: #7f8c8d;">
                <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 15px;"></i>
                <h4>Tidak Ada Data</h4>
                <p>Belum ada data yang tersedia untuk ditampilkan.</p>
            </div>
        `;
    }
    
    let html = `
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="thead-dark">
                    <tr>
                        <th style="width: 50px;">#</th>
    `;
    
    // Add column headers
    columns.forEach(col => {
        html += `<th>${col.title}</th>`;
    });
    
    if (actions.length > 0) {
        html += `<th style="width: 200px;">Aksi</th>`;
    }
    
    html += `</tr></thead><tbody>`;
    
    // Add data rows
    data.forEach((item, index) => {
        html += `<tr>`;
        html += `<td>${index + 1}</td>`;
        
        columns.forEach(col => {
            let value = item[col.field];
            
            // Handle field name variations (camelCase vs snake_case)
            if (value === undefined || value === null) {
                // Try snake_case version
                const snakeCase = col.field.replace(/([A-Z])/g, '_$1').toLowerCase();
                value = item[snakeCase];
                
                // Try camelCase version
                if (value === undefined || value === null) {
                    const camelCase = col.field.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
                    value = item[camelCase];
                }
            }
            
            // Apply formatting if specified
            if (col.format && typeof col.format === 'function') {
                value = col.format(value);
            } else if (value === undefined || value === null || value === '') {
                value = '-';
            }
            
            html += `<td>${value}</td>`;
        });
        
        // Add action buttons
        if (actions.length > 0) {
            html += `<td>`;
            actions.forEach(action => {
                html += `
                    <button class="btn btn-${action.class} btn-sm me-1" 
                            onclick="${action.onclick}(${item.id})">
                        ${action.text}
                    </button>
                `;
            });
            html += `</td>`;
        }
        
        html += `</tr>`;
    });
    
    html += `</tbody></table></div>`;
    
    return html;
};

// ===== DASHBOARD FUNCTIONS =====
const loadDashboardData = async () => {
    try {
        console.log('🔄 Loading dashboard data...');
        
        const data = await getData('dashboard');
        
        // Update dashboard cards
        const updateCard = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value || 0;
            }
        };
        
        updateCard('ikm-binaan', data.ikmBinaan);
        updateCard('hki-merek', data.hkiMerek);
        updateCard('sertifikat-halal', data.sertifikatHalal);
        updateCard('tkdn-ik', data.tkdnIk);
        updateCard('siinas', data.siinas);
        updateCard('uji-nilai-gizi', data.ujiNilaiGizi);
        updateCard('kurasi-produk', data.kurasiProduk);
        updateCard('pelatihan-pemberdayaan', data.pelatihanPemberdayaan);
        updateCard('total-peserta-pelatihan', data.totalPesertaPelatihan);
        
        console.log('✅ Dashboard data loaded successfully');
        
    } catch (error) {
        console.error('❌ Failed to load dashboard data:', error);
        showAlert('Gagal memuat data dashboard', 'error');
    }
};

// ===== IKM BINAAN FUNCTIONS =====
const loadIKMBinaan = async () => {
    try {
        console.log('🔄 Loading IKM Binaan data...');
        
        const data = await getData('ikm-binaan');
        
        console.log('📊 IKM Binaan data received:', {
            isArray: Array.isArray(data),
            length: data.length,
            firstItem: data[0]
        });
        
        // Define columns with CORRECT field names (camelCase to match JSON)
        const columns = [
            { field: 'nib', title: 'No. NIB' },
            { field: 'nik', title: 'No. NIK' },
            { field: 'namaLengkap', title: 'Nama Lengkap' },  // ✅ Fixed: camelCase
            { field: 'alamatLengkap', title: 'Alamat Lengkap' }, // ✅ Fixed: camelCase
            { field: 'namaUsaha', title: 'Nama Usaha' },  // ✅ Fixed: camelCase
            { field: 'nomorHP', title: 'No. HP' },  // ✅ Fixed: camelCase
            { 
                field: 'createdAt', 
                title: 'Tanggal Daftar',
                format: (date) => formatDate(date)
            }
        ];
        
        const actions = [
            { text: 'Edit', class: 'warning', onclick: 'editIKMBinaan' },
            { text: 'Hapus', class: 'danger', onclick: 'deleteIKMBinaan' }
        ];
        
        const tableHtml = createTable(data, columns, actions);
        document.getElementById('ikm-binaan-table').innerHTML = tableHtml;
        
        console.log('✅ IKM Binaan table rendered successfully');
        
    } catch (error) {
        console.error('❌ Failed to load IKM Binaan data:', error);
        document.getElementById('ikm-binaan-table').innerHTML = `
            <div style="text-align: center; padding: 40px; color: #e74c3c;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 15px;"></i>
                <h4>Gagal Memuat Data</h4>
                <p>${error.message}</p>
                <button class="btn btn-primary" onclick="loadIKMBinaan()">
                    <i class="fas fa-refresh"></i> Coba Lagi
                </button>
            </div>
        `;
        showAlert('Gagal memuat data IKM Binaan: ' + error.message, 'error');
    }
};

// ===== LAYANAN IKM FUNCTIONS =====
const loadLayananData = async (layananType) => {
    try {
        console.log(`🔍 Loading ${layananType} data...`);
        
        const data = await getData(layananType);
        
        console.log(`📊 ${layananType} data received:`, {
            isArray: Array.isArray(data),
            length: data.length,
            firstItem: data[0]
        });
        
        // Define columns based on service type with CORRECT field names
        let columns = [];
        
        switch(layananType) {
            case 'hki-merek':
                columns = [
                    { field: 'nib', title: 'No. NIB' },
                    { field: 'namaLengkap', title: 'Nama Lengkap' },  // ✅ Fixed
                    { field: 'namaUsaha', title: 'Nama Usaha' },  // ✅ Fixed
                    { field: 'namaMerek', title: 'Nama Merek' },  // ✅ Fixed
                    { field: 'nomorSertifikat', title: 'No. Sertifikat' },  // ✅ Fixed
                    { 
                        field: 'tanggalTerbit', 
                        title: 'Tanggal Terbit',
                        format: (date) => formatDate(date)
                    }
                ];
                break;
                
            case 'sertifikat-halal':
                columns = [
                    { field: 'nib', title: 'No. NIB' },
                    { field: 'namaLengkap', title: 'Nama Lengkap' },  // ✅ Fixed
                    { field: 'namaUsaha', title: 'Nama Usaha' },  // ✅ Fixed
                    { field: 'namaProduk', title: 'Nama Produk' },  // ✅ Fixed
                    { field: 'nomorSertifikat', title: 'No. Sertifikat' },  // ✅ Fixed
                    { 
                        field: 'tanggalTerbit', 
                        title: 'Tanggal Terbit',
                        format: (date) => formatDate(date)
                    }
                ];
                break;
                
            case 'tkdn-ik':
                columns = [
                    { field: 'nib', title: 'No. NIB' },
                    { field: 'namaLengkap', title: 'Nama Lengkap' },  // ✅ Fixed
                    { field: 'namaUsaha', title: 'Nama Usaha' },  // ✅ Fixed
                    { field: 'namaProduk', title: 'Nama Produk' },  // ✅ Fixed
                    { field: 'nomorSertifikat', title: 'No. Sertifikat' },  // ✅ Fixed
                    { field: 'nilaiTKDN', title: 'Nilai TKDN (%)' }  // ✅ Fixed
                ];
                break;
                
            case 'siinas':
                columns = [
                    { field: 'nib', title: 'No. NIB' },
                    { field: 'namaLengkap', title: 'Nama Lengkap' },  // ✅ Fixed
                    { field: 'namaUsaha', title: 'Nama Usaha' },  // ✅ Fixed
                    { field: 'namaProduk', title: 'Nama Produk' },  // ✅ Fixed
                    { field: 'nomorSertifikat', title: 'No. Sertifikat' },  // ✅ Fixed
                    { 
                        field: 'tanggalTerbit', 
                        title: 'Tanggal Terbit',
                        format: (date) => formatDate(date)
                    }
                ];
                break;
                
            case 'uji-nilai-gizi':
                columns = [
                    { field: 'nib', title: 'No. NIB' },
                    { field: 'namaLengkap', title: 'Nama Lengkap' },  // ✅ Fixed
                    { field: 'namaUsaha', title: 'Nama Usaha' },  // ✅ Fixed
                    { field: 'namaProduk', title: 'Nama Produk' },  // ✅ Fixed
                    { field: 'nomorSertifikat', title: 'No. Sertifikat' },  // ✅ Fixed
                    { 
                        field: 'tanggalUji', 
                        title: 'Tanggal Uji',
                        format: (date) => formatDate(date)
                    }
                ];
                break;
                
            case 'kurasi-produk':
                columns = [
                    { field: 'nib', title: 'No. NIB' },
                    { field: 'namaLengkap', title: 'Nama Lengkap' },  // ✅ Fixed
                    { field: 'namaUsaha', title: 'Nama Usaha' },  // ✅ Fixed
                    { field: 'namaProduk', title: 'Nama Produk' },  // ✅ Fixed
                    { field: 'kategoriProduk', title: 'Kategori' },  // ✅ Fixed
                    { field: 'statusKurasi', title: 'Status' }  // ✅ Fixed
                ];
                break;
                
            default:
                columns = [
                    { field: 'nib', title: 'No. NIB' },
                    { field: 'namaLengkap', title: 'Nama Lengkap' },  // ✅ Fixed
                    { field: 'namaUsaha', title: 'Nama Usaha' }  // ✅ Fixed
                ];
        }
        
        const actions = [
            { text: 'Edit', class: 'warning', onclick: 'editLayanan' },
            { text: 'Hapus', class: 'danger', onclick: 'deleteLayanan' }
        ];
        
        const tableHtml = createTable(data, columns, actions);
        document.getElementById(`${layananType}-table`).innerHTML = tableHtml;
        
        console.log(`✅ ${layananType} table rendered successfully`);
        
    } catch (error) {
        console.error(`❌ Failed to load ${layananType} data:`, error);
        document.getElementById(`${layananType}-table`).innerHTML = `
            <div style="text-align: center; padding: 40px; color: #e74c3c;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 15px;"></i>
                <h4>Gagal Memuat Data</h4>
                <p>${error.message}</p>
                <button class="btn btn-primary" onclick="loadLayananData('${layananType}')">
                    <i class="fas fa-refresh"></i> Coba Lagi
                </button>
            </div>
        `;
        showAlert(`Gagal memuat data ${layananType}: ${error.message}`, 'error');
    }
};

// ===== PELATIHAN FUNCTIONS =====
const loadPelatihanData = async () => {
    try {
        console.log('🔄 Loading Pelatihan data...');
        
        const data = await getData('pelatihan-pemberdayaan');
        
        console.log('📊 Pelatihan data received:', {
            isArray: Array.isArray(data),
            length: data.length,
            firstItem: data[0]
        });
        
        // Define columns with CORRECT field names
        const columns = [
            { field: 'judulPelatihan', title: 'Judul Pelatihan' },  // ✅ Fixed
            { 
                field: 'tanggalMulai', 
                title: 'Tanggal Mulai',
                format: (date) => formatDate(date)
            },
            { 
                field: 'tanggalSelesai', 
                title: 'Tanggal Selesai',
                format: (date) => formatDate(date)
            },
            { field: 'instruktur', title: 'Instruktur' },
            { field: 'kuota', title: 'Kuota' },
            { 
                field: 'peserta', 
                title: 'Peserta',
                format: (peserta) => peserta ? peserta.length : 0
            },
            { 
                field: 'status', 
                title: 'Status',
                format: (status) => {
                    const colors = {
                        'Aktif': 'success',
                        'Selesai': 'primary',
                        'Dibatalkan': 'danger'
                    };
                    const color = colors[status] || 'secondary';
                    return `<span class="badge badge-${color}">${status}</span>`;
                }
            }
        ];
        
        const actions = [
            { text: 'Kelola Peserta', class: 'info', onclick: 'manageParticipants' },
            { text: 'Edit', class: 'warning', onclick: 'editPelatihan' },
            { text: 'Hapus', class: 'danger', onclick: 'deletePelatihan' }
        ];
        
        const tableHtml = createTable(data, columns, actions);
        document.getElementById('pelatihan-table').innerHTML = tableHtml;
        
        console.log('✅ Pelatihan table rendered successfully');
        
    } catch (error) {
        console.error('❌ Failed to load Pelatihan data:', error);
        document.getElementById('pelatihan-table').innerHTML = `
            <div style="text-align: center; padding: 40px; color: #e74c3c;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 15px;"></i>
                <h4>Gagal Memuat Data</h4>
                <p>${error.message}</p>
                <button class="btn btn-primary" onclick="loadPelatihanData()">
                    <i class="fas fa-refresh"></i> Coba Lagi
                </button>
            </div>
        `;
        showAlert('Gagal memuat data Pelatihan: ' + error.message, 'error');
    }
};

// ===== NAVIGATION FUNCTIONS =====
const setActiveMenu = (menuId) => {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    document.getElementById(menuId)?.classList.add('active');
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const adminUser = localStorage.getItem('admin_user');
    if (!adminUser && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
        return;
    }
    
    // Set user name if logged in
    if (adminUser) {
        const user = JSON.parse(adminUser);
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = user.nama || user.username || 'Admin';
        }
    }
    
    // Load data based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'index.html':
            if (document.getElementById('ikm-binaan')) {
                loadDashboardData();
            }
            break;
        case 'ikm-binaan.html':
            loadIKMBinaan();
            break;
        case 'layanan-ikm.html':
            // Load first tab by default
            loadLayananData('hki-merek');
            break;
        case 'pelatihan.html':
            loadPelatihanData();
            break;
    }
    
    // Set active menu
    const menuMap = {
        'index.html': 'menu-dashboard',
        'ikm-binaan.html': 'menu-ikm-binaan',
        'inputan-layanan.html': 'menu-inputan-layanan',
        'layanan-ikm.html': 'menu-layanan-ikm',
        'pelatihan.html': 'menu-pelatihan',
        'penelusuran.html': 'menu-penelusuran',
        'edit-redaksi.html': 'menu-edit-redaksi',
        'activity-logs.html': 'menu-activity-logs',
        'recycle-bin.html': 'menu-recycle'
    };
    
    const activeMenuId = menuMap[currentPage];
    if (activeMenuId) {
        setActiveMenu(activeMenuId);
    }
});

// ===== LOGOUT FUNCTION =====
const logout = () => {
    localStorage.removeItem('admin_user');
    window.location.href = 'login.html';
};

// ===== PLACEHOLDER FUNCTIONS FOR ACTIONS =====
const editIKMBinaan = (id) => {
    showAlert(`Edit IKM Binaan ID: ${id}`, 'info');
};

const deleteIKMBinaan = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        showAlert(`Hapus IKM Binaan ID: ${id}`, 'warning');
    }
};

const editLayanan = (id) => {
    showAlert(`Edit Layanan ID: ${id}`, 'info');
};

const deleteLayanan = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        showAlert(`Hapus Layanan ID: ${id}`, 'warning');
    }
};

const editPelatihan = (id) => {
    showAlert(`Edit Pelatihan ID: ${id}`, 'info');
};

const deletePelatihan = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        showAlert(`Hapus Pelatihan ID: ${id}`, 'warning');
    }
};

const manageParticipants = (id) => {
    showAlert(`Kelola Peserta Pelatihan ID: ${id}`, 'info');
};

// ===== TAB FUNCTIONALITY =====
const showTab = (tabName) => {
    // Hide all tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab pane
    const tabPane = document.getElementById(tabName + '-tab');
    if (tabPane) {
        tabPane.classList.add('active');
    }
    
    // Add active class to clicked button
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Load data for the selected tab
    loadLayananData(tabName);
};

console.log('✅ Script loaded successfully - Version 3.0');