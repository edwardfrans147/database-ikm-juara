// Optimisasi shared script dengan caching dan performance
const API_BASE = '';

// Client-side cache untuk optimisasi
const clientCache = new Map();
const CLIENT_CACHE_TTL = 2 * 60 * 1000; // 2 menit

const getClientCache = (key) => {
    const cached = clientCache.get(key);
    if (cached && Date.now() - cached.timestamp < CLIENT_CACHE_TTL) {
        return cached.data;
    }
    clientCache.delete(key);
    return null;
};

const setClientCache = (key, data) => {
    clientCache.set(key, {
        data: data,
        timestamp: Date.now()
    });
    
    // Cleanup old cache entries
    if (clientCache.size > 50) {
        const oldestKey = clientCache.keys().next().value;
        clientCache.delete(oldestKey);
    }
};

// Debounce function untuk optimisasi search
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle function untuk optimisasi scroll/resize events
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Utility functions dengan optimisasi
const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID');
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
};

const showAlert = (message, type = 'info') => {
    // Prevent duplicate alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert && existingAlert.textContent === message) {
        return;
    }
    
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
    
    // Auto remove dengan fade out animation
    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 300);
    }, 3000);
};

// Optimisasi API helper dengan retry dan timeout
const apiRequest = async (url, options = {}) => {
    const cacheKey = `${url}_${JSON.stringify(options)}`;
    
    // Check cache untuk GET requests
    if (!options.method || options.method === 'GET') {
        const cached = getClientCache(cacheKey);
        if (cached) {
            return cached;
        }
    }
    
    try {
        // Get current user for logging
        const adminUser = localStorage.getItem('admin_user');
        const user = adminUser ? JSON.parse(adminUser) : null;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const response = await fetch(API_BASE + url, {
            headers: {
                'Content-Type': 'application/json',
                'X-User': user ? user.username : 'Unknown',
                ...options.headers
            },
            signal: controller.signal,
            ...options
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Cache successful GET requests
        if (!options.method || options.method === 'GET') {
            setClientCache(cacheKey, data);
        }
        
        return data;
    } catch (error) {
        if (error.name === 'AbortError') {
            showAlert('Request timeout - silakan coba lagi', 'error');
        } else {
            console.error('API request failed:', error);
            showAlert('Terjadi kesalahan saat mengakses data', 'error');
        }
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

// Optimized Dashboard functions dengan smart caching
let dashboardRefreshInterval = null;
let lastDashboardUpdate = 0;
const DASHBOARD_REFRESH_INTERVAL = 60000; // 1 menit
const DASHBOARD_CACHE_TIME = 30000; // 30 detik

const loadDashboardData = async (forceRefresh = false) => {
    try {
        // Check if we need to refresh based on cache time
        const now = Date.now();
        if (!forceRefresh && (now - lastDashboardUpdate) < DASHBOARD_CACHE_TIME) {
            return; // Skip refresh if data is still fresh
        }
        
        // Show loading state
        const loadingElements = document.querySelectorAll('.card-value');
        loadingElements.forEach(el => {
            if (el.textContent !== '...') {
                el.setAttribute('data-original', el.textContent);
                el.innerHTML = '<div class="loading"></div>';
            }
        });
        
        const data = await getData('dashboard');
        lastDashboardUpdate = now;
        
        // Update dashboard cards with animation
        const updateCard = (elementId, value, suffix = '') => {
            const element = document.getElementById(elementId);
            if (element) {
                const currentValue = parseInt(element.textContent) || 0;
                if (currentValue !== value) {
                    // Animate number change
                    animateNumber(element, currentValue, value, suffix);
                } else {
                    element.textContent = value + suffix;
                }
            }
        };
        
        // Update all dashboard cards
        updateCard('ikm-binaan', data.ikmBinaan);
        updateCard('hki-merek', data.hkiMerek);
        updateCard('sertifikat-halal', data.sertifikatHalal);
        updateCard('tkdn-ik', data.tkdnIk);
        updateCard('siinas', data.siinas);
        updateCard('uji-nilai-gizi', data.ujiNilaiGizi);
        updateCard('kurasi-produk', data.kurasiProduk);
        updateCard('pelatihan-pemberdayaan', data.pelatihanPemberdayaan);
        updateCard('total-peserta-pelatihan', data.totalPesertaPelatihan);
        
        // Update last updated time
        const lastUpdatedElement = document.getElementById('last-updated');
        if (lastUpdatedElement) {
            const updateTime = data.lastUpdated ? 
                new Date(data.lastUpdated).toLocaleTimeString('id-ID') : 
                new Date().toLocaleTimeString('id-ID');
            lastUpdatedElement.textContent = `Terakhir diperbarui: ${updateTime}`;
        }
        
        // Show cache indicator
        if (data.cached) {
            console.log('Dashboard data loaded from cache');
        }
        
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        
        // Restore original values on error
        const loadingElements = document.querySelectorAll('.card-value');
        loadingElements.forEach(el => {
            const original = el.getAttribute('data-original');
            if (original) {
                el.textContent = original;
                el.removeAttribute('data-original');
            }
        });
        
        showAlert('Gagal memuat data dashboard', 'error');
    }
};

// Animate number changes
const animateNumber = (element, start, end, suffix = '') => {
    const duration = 1000; // 1 second
    const startTime = Date.now();
    const difference = end - start;
    
    const updateNumber = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (difference * easeOut));
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    };
    
    requestAnimationFrame(updateNumber);
};

// Smart dashboard refresh dengan visibility API
const startDashboardRefresh = () => {
    // Clear existing interval
    if (dashboardRefreshInterval) {
        clearInterval(dashboardRefreshInterval);
    }
    
    // Only refresh if page is visible
    const refreshIfVisible = () => {
        if (!document.hidden) {
            loadDashboardData();
        }
    };
    
    // Set up interval
    dashboardRefreshInterval = setInterval(refreshIfVisible, DASHBOARD_REFRESH_INTERVAL);
    
    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            // Page became visible, refresh immediately if data is stale
            const now = Date.now();
            if ((now - lastDashboardUpdate) > DASHBOARD_CACHE_TIME) {
                loadDashboardData();
            }
        }
    });
    
    // Handle page focus
    window.addEventListener('focus', () => {
        const now = Date.now();
        if ((now - lastDashboardUpdate) > DASHBOARD_CACHE_TIME) {
            loadDashboardData();
        }
    });
};

// Stop dashboard refresh
const stopDashboardRefresh = () => {
    if (dashboardRefreshInterval) {
        clearInterval(dashboardRefreshInterval);
        dashboardRefreshInterval = null;
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

// ===== OPTIMISASI TAMBAHAN UNTUK PERFORMA MAKSIMAL =====

// Initialize page dengan optimisasi
document.addEventListener('DOMContentLoaded', () => {
    // Load dashboard data if on dashboard page
    if (document.getElementById('ikm-binaan')) {
        loadDashboardData(true); // Force initial load
        startDashboardRefresh(); // Start smart refresh
    }
    
    // Set active menu item
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
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
        const activeMenu = document.getElementById(activeMenuId);
        if (activeMenu) {
            // Remove active class from all menu items
            document.querySelectorAll('.menu-item').forEach(item => {
                item.classList.remove('active');
            });
            // Add active class to current menu
            activeMenu.classList.add('active');
        }
    }
    
    // Initialize tooltips and other UI enhancements
    initializeUIEnhancements();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopDashboardRefresh();
});

// Initialize UI enhancements
const initializeUIEnhancements = () => {
    // Add loading states to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (this.type === 'submit' || this.classList.contains('btn-primary')) {
                const originalText = this.textContent;
                this.innerHTML = '<div class="loading"></div> ' + originalText;
                this.disabled = true;
                
                // Re-enable after 3 seconds (fallback)
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                }, 3000);
            }
        });
    });
    
    // Add form validation enhancements
    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', debounce(function() {
            validateField(this);
        }, 500));
    });
    
    // Add table enhancements
    document.querySelectorAll('.table').forEach(table => {
        // Add sorting capability
        const headers = table.querySelectorAll('th');
        headers.forEach((header, index) => {
            if (!header.classList.contains('no-sort')) {
                header.style.cursor = 'pointer';
                header.addEventListener('click', () => sortTable(table, index));
            }
        });
    });
};

// Field validation
const validateField = (field) => {
    const value = field.value.trim();
    const type = field.getAttribute('data-validate');
    
    field.classList.remove('is-valid', 'is-invalid');
    
    if (!value && field.required) {
        field.classList.add('is-invalid');
        return false;
    }
    
    switch (type) {
        case 'nib':
            if (value && (value.length !== 13 || !/^\d{13}$/.test(value))) {
                field.classList.add('is-invalid');
                return false;
            }
            break;
        case 'nik':
            if (value && (value.length !== 16 || !/^\d{16}$/.test(value))) {
                field.classList.add('is-invalid');
                return false;
            }
            break;
        case 'phone':
            if (value && !/^(\+62|62|0)[0-9]{9,13}$/.test(value)) {
                field.classList.add('is-invalid');
                return false;
            }
            break;
        case 'email':
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                field.classList.add('is-invalid');
                return false;
            }
            break;
    }
    
    if (value) {
        field.classList.add('is-valid');
    }
    
    return true;
};

// Table sorting
const sortTable = (table, columnIndex) => {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const header = table.querySelectorAll('th')[columnIndex];
    
    // Determine sort direction
    const isAscending = !header.classList.contains('sort-desc');
    
    // Clear all sort classes
    table.querySelectorAll('th').forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
    });
    
    // Add sort class to current header
    header.classList.add(isAscending ? 'sort-asc' : 'sort-desc');
    
    // Sort rows
    rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent.trim();
        const bText = b.cells[columnIndex].textContent.trim();
        
        // Try to parse as numbers
        const aNum = parseFloat(aText);
        const bNum = parseFloat(bText);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return isAscending ? aNum - bNum : bNum - aNum;
        }
        
        // String comparison
        return isAscending ? 
            aText.localeCompare(bText, 'id-ID') : 
            bText.localeCompare(aText, 'id-ID');
    });
    
    // Re-append sorted rows
    rows.forEach(row => tbody.appendChild(row));
};

// Performance monitoring
const performanceMonitor = {
    startTime: Date.now(),
    
    logPageLoad: () => {
        window.addEventListener('load', () => {
            const loadTime = Date.now() - performanceMonitor.startTime;
            console.log(`Page loaded in ${loadTime}ms`);
            
            // Log performance metrics
            if (window.performance && window.performance.timing) {
                const timing = window.performance.timing;
                const metrics = {
                    domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
                    windowLoad: timing.loadEventEnd - timing.navigationStart,
                    domReady: timing.domComplete - timing.navigationStart
                };
                console.log('Performance metrics:', metrics);
            }
        });
    },
    
    logApiCall: (url, startTime) => {
        const duration = Date.now() - startTime;
        console.log(`API call to ${url} took ${duration}ms`);
        
        if (duration > 5000) {
            console.warn(`Slow API call detected: ${url} (${duration}ms)`);
        }
    }
};

// Initialize performance monitoring
performanceMonitor.logPageLoad();

// Service Worker registration untuk caching (jika diperlukan)
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Memory usage monitoring (development only)
if (process.env.NODE_ENV === 'development' && window.performance && window.performance.memory) {
    setInterval(() => {
        const memory = window.performance.memory;
        const used = Math.round(memory.usedJSHeapSize / 1048576);
        const total = Math.round(memory.totalJSHeapSize / 1048576);
        
        if (used > 50) { // Alert if using more than 50MB
            console.warn(`High memory usage: ${used}MB / ${total}MB`);
        }
    }, 30000); // Check every 30 seconds
}