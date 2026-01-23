
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
