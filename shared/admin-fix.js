// Admin Fix Script - Mengatasi semua masalah API di halaman admin
console.log('🔧 Admin Fix Script loaded');

// Override API calls untuk memastikan endpoint bekerja
const API_BASE_URL = 'https://apkfixikmjuara.vercel.app/api';

// Function untuk membuat API request yang reliable
async function makeAPIRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}/${endpoint}`;
    console.log(`🌐 API Request: ${url}`);
    
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`📊 API Response for ${endpoint}:`, data);
        return data;
    } catch (error) {
        console.error(`❌ API Error for ${endpoint}:`, error);
        throw error;
    }
}

// Override global functions
window.getData = async function(endpoint) {
    return await makeAPIRequest(endpoint);
};

window.createData = async function(endpoint, data) {
    return await makeAPIRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
    });
};

window.updateData = async function(endpoint, id, data) {
    return await makeAPIRequest(`${endpoint}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
};

window.deleteData = async function(endpoint, id) {
    return await makeAPIRequest(`${endpoint}/${id}`, {
        method: 'DELETE'
    });
};

// Dashboard loading function
window.loadDashboardData = async function(forceRefresh = false) {
    try {
        console.log('📊 Loading dashboard data...');
        
        const data = await makeAPIRequest('dashboard');
        
        // Update dashboard cards dengan data yang benar
        const updateElement = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value || 0;
                console.log(`Updated ${id}: ${value}`);
            }
        };
        
        updateElement('ikm-binaan', data.ikmBinaan);
        updateElement('hki-merek', data.hkiMerek);
        updateElement('sertifikat-halal', data.sertifikatHalal);
        updateElement('tkdn-ik', data.tkdnIk);
        updateElement('siinas', data.siinas);
        updateElement('uji-nilai-gizi', data.ujiNilaiGizi);
        updateElement('kurasi-produk', data.kurasiProduk);
        updateElement('pelatihan-pemberdayaan', data.pelatihanPemberdayaan);
        updateElement('total-peserta-pelatihan', data.totalPesertaPelatihan);
        
        // Update last updated time
        const lastUpdatedElement = document.getElementById('last-updated');
        if (lastUpdatedElement) {
            const updateTime = new Date().toLocaleTimeString('id-ID');
            lastUpdatedElement.textContent = `Terakhir diperbarui: ${updateTime}`;
        }
        
        console.log('✅ Dashboard loaded successfully');
        
        // Remove error messages
        const errorElements = document.querySelectorAll('.alert-error');
        errorElements.forEach(el => el.remove());
        
    } catch (error) {
        console.error('❌ Dashboard loading failed:', error);
        showAlert('Gagal memuat data dashboard: ' + error.message, 'error');
    }
};

// IKM Binaan loading function
window.loadIkmBinaanData = async function() {
    try {
        console.log('🏢 Loading IKM Binaan data...');
        
        const response = await makeAPIRequest('ikm-binaan');
        const data = response.data || response;
        
        console.log('✅ IKM Binaan loaded:', data.length, 'records');
        
        // Update table or display data
        if (typeof displayIkmBinaanData === 'function') {
            displayIkmBinaanData(data);
        }
        
        return data;
    } catch (error) {
        console.error('❌ IKM Binaan loading failed:', error);
        showAlert('Gagal memuat data IKM Binaan: ' + error.message, 'error');
        return [];
    }
};

// Pelatihan loading function
window.loadPelatihanData = async function() {
    try {
        console.log('🎓 Loading Pelatihan data...');
        
        const response = await makeAPIRequest('pelatihan-pemberdayaan');
        const data = response.data || response;
        
        console.log('✅ Pelatihan loaded:', data.length, 'records');
        
        // Update table or display data
        if (typeof displayPelatihanData === 'function') {
            displayPelatihanData(data);
        }
        
        return data;
    } catch (error) {
        console.error('❌ Pelatihan loading failed:', error);
        showAlert('Gagal memuat data pelatihan: ' + error.message, 'error');
        return [];
    }
};

// Service data loading function
window.loadServiceData = async function(serviceName) {
    try {
        console.log(`🔧 Loading ${serviceName} data...`);
        
        const response = await makeAPIRequest(serviceName);
        const data = response.data || response;
        
        console.log(`✅ ${serviceName} loaded:`, data.length, 'records');
        
        return data;
    } catch (error) {
        console.error(`❌ ${serviceName} loading failed:`, error);
        showAlert(`Gagal memuat data ${serviceName}: ${error.message}`, 'error');
        return [];
    }
};

// Alert function
window.showAlert = function(message, type = 'info') {
    console.log(`📢 Alert (${type}): ${message}`);
    
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new alert
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
    `;
    
    switch(type) {
        case 'success':
            alertDiv.style.backgroundColor = '#27ae60';
            break;
        case 'error':
            alertDiv.style.backgroundColor = '#e74c3c';
            break;
        case 'warning':
            alertDiv.style.backgroundColor = '#f39c12';
            break;
        default:
            alertDiv.style.backgroundColor = '#3498db';
    }
    
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    
    // Auto remove
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
};

// Auto-load data when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Admin Fix Script: DOM loaded');
    
    // Load dashboard data if on dashboard page
    if (document.getElementById('ikm-binaan')) {
        setTimeout(() => {
            loadDashboardData(true);
        }, 1000);
    }
    
    // Load IKM Binaan data if on IKM page
    if (window.location.pathname.includes('ikm-binaan.html')) {
        setTimeout(() => {
            loadIkmBinaanData();
        }, 1000);
    }
    
    // Load Pelatihan data if on pelatihan page
    if (window.location.pathname.includes('pelatihan.html')) {
        setTimeout(() => {
            loadPelatihanData();
        }, 1000);
    }
    
    console.log('✅ Admin Fix Script: Ready');
});

console.log('✅ Admin Fix Script initialized');