// Global JavaScript functions
const API_BASE = '';

// Utility functions
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID');
};

const showAlert = (message, type = 'info') => {
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
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
};

// API helper functions
const apiRequest = async (url, options = {}) => {
    try {
        // Get current user for logging
        const adminUser = localStorage.getItem('admin_user');
        const user = adminUser ? JSON.parse(adminUser) : null;
        
        const response = await fetch(API_BASE + url, {
            headers: {
                'Content-Type': 'application/json',
                'X-User': user ? user.username : 'Unknown',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        showAlert('Terjadi kesalahan saat mengakses data', 'error');
        throw error;
    }
};

// CRUD operations
const getData = (endpoint) => apiRequest(`/api/${endpoint}`);
const getDataById = (endpoint, id) => apiRequest(`/api/${endpoint}/${id}`);
const createData = (endpoint, data) => apiRequest(`/api/${endpoint}`, {
    method: 'POST',
    body: JSON.stringify(data)
});
const updateData = (endpoint, id, data) => apiRequest(`/api/${endpoint}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
});
const deleteData = (endpoint, id) => apiRequest(`/api/${endpoint}/${id}`, {
    method: 'DELETE'
});

// Dashboard functions
const loadDashboardData = async () => {
    try {
        const data = await getData('dashboard');
        
        // Update dashboard cards with correct field names
        if (document.getElementById('ikm-binaan')) {
            document.getElementById('ikm-binaan').textContent = data.ikmBinaan;
        }
        if (document.getElementById('hki-merek')) {
            document.getElementById('hki-merek').textContent = data.hkiMerek;
        }
        if (document.getElementById('sertifikat-halal')) {
            document.getElementById('sertifikat-halal').textContent = data.sertifikatHalal;
        }
        if (document.getElementById('tkdn-ik')) {
            document.getElementById('tkdn-ik').textContent = data.tkdnIk;
        }
        if (document.getElementById('siinas')) {
            document.getElementById('siinas').textContent = data.siinas;
        }
        if (document.getElementById('uji-nilai-gizi')) {
            document.getElementById('uji-nilai-gizi').textContent = data.ujiNilaiGizi;
        }
        if (document.getElementById('kurasi-produk')) {
            document.getElementById('kurasi-produk').textContent = data.kurasiProduk;
        }
        if (document.getElementById('pelatihan-pemberdayaan')) {
            document.getElementById('pelatihan-pemberdayaan').textContent = data.pelatihanPemberdayaan;
        }
        if (document.getElementById('total-peserta-pelatihan')) {
            document.getElementById('total-peserta-pelatihan').textContent = data.totalPesertaPelatihan;
        }
        
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
    }
};

// Table functions
const createTable = (data, columns, actions = []) => {
    let html = '<table><thead><tr>';
    
    // Add No. column
    html += '<th style="width: 60px;">No.</th>';
    
    columns.forEach(col => {
        html += `<th>${col.title}</th>`;
    });
    
    if (actions.length > 0) {
        html += '<th style="width: 150px;">Aksi</th>';
    }
    
    html += '</tr></thead><tbody>';
    
    data.forEach((item, index) => {
        html += '<tr>';
        
        // Add row number
        html += `<td style="text-align: center; font-weight: bold; color: #7f8c8d;">${index + 1}</td>`;
        
        columns.forEach(col => {
            let value = item[col.field];
            if (col.format) {
                value = col.format(value, item);
            }
            html += `<td>${value || '-'}</td>`;
        });
        
        if (actions.length > 0) {
            html += '<td>';
            actions.forEach(action => {
                html += `<button class="btn btn-${action.class}" onclick="${action.onclick}(${item.id})" style="margin-right: 5px; margin-bottom: 5px;">${action.text}</button>`;
            });
            html += '</td>';
        }
        
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    return html;
};

// Form functions
const createForm = (fields, onSubmit) => {
    let html = '<form>';
    
    fields.forEach(field => {
        html += `<div class="form-group">`;
        html += `<label for="${field.name}">${field.label}</label>`;
        
        if (field.type === 'select') {
            html += `<select class="form-control" name="${field.name}" ${field.required ? 'required' : ''}>`;
            html += `<option value="">Pilih ${field.label}</option>`;
            field.options.forEach(option => {
                html += `<option value="${option.value}">${option.text}</option>`;
            });
            html += '</select>';
        } else if (field.type === 'textarea') {
            html += `<textarea class="form-control" name="${field.name}" ${field.required ? 'required' : ''}></textarea>`;
        } else {
            html += `<input type="${field.type || 'text'}" class="form-control" name="${field.name}" ${field.required ? 'required' : ''}`;
            if (field.placeholder) html += ` placeholder="${field.placeholder}"`;
            html += '>';
        }
        
        html += '</div>';
    });
    
    html += '<button type="submit" class="btn btn-primary">Simpan</button>';
    html += '</form>';
    
    return html;
};

// Navigation functions
const setActiveMenu = (menuId) => {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    document.getElementById(menuId)?.classList.add('active');
};

// Update data count indicator
const updateDataCount = (dataType, count) => {
    // Update sidebar menu with count indicator
    const menuItem = document.querySelector(`[href*="${dataType}"]`);
    if (menuItem) {
        let countBadge = menuItem.querySelector('.count-badge');
        if (!countBadge) {
            countBadge = document.createElement('span');
            countBadge.className = 'count-badge';
            countBadge.style.cssText = `
                background: #e74c3c;
                color: white;
                border-radius: 10px;
                padding: 2px 6px;
                font-size: 11px;
                margin-left: 5px;
                min-width: 18px;
                text-align: center;
                display: inline-block;
            `;
            menuItem.appendChild(countBadge);
        }
        countBadge.textContent = count;
    }
};

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Load dashboard data if on dashboard page
    if (document.getElementById('ikm-binaan')) {
        loadDashboardData();
    }
    
    // Set active menu based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const menuMap = {
        'index.html': 'menu-dashboard',
        'ikm-binaan.html': 'menu-ikm-binaan',
        'inputan-layanan.html': 'menu-inputan-layanan',
        'layanan-ikm.html': 'menu-layanan-ikm',
        'pelatihan.html': 'menu-pelatihan',
        'penelusuran.html': 'menu-penelusuran',
        'recycle-bin.html': 'menu-recycle'
    };
    
    if (menuMap[currentPage]) {
        setActiveMenu(menuMap[currentPage]);
    }
});