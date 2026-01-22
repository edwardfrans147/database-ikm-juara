const ExcelJS = require('exceljs');
const path = require('path');

async function generateTestExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Test Import IKM Binaan');
    
    // Define columns for template
    const columns = [
        { header: 'No. NIB', key: 'nib', width: 15 },
        { header: 'No. NIK', key: 'nik', width: 20 },
        { header: 'Nama Lengkap', key: 'namaLengkap', width: 25 },
        { header: 'Alamat Lengkap', key: 'alamatLengkap', width: 40 },
        { header: 'Nama Usaha', key: 'namaUsaha', width: 25 },
        { header: 'Nomor HP', key: 'nomorHP', width: 15 }
    ];
    
    worksheet.columns = columns;
    
    // Add title
    worksheet.insertRow(1, ['Test Import Data IKM Binaan - Dengan Data Duplikat']);
    worksheet.mergeCells('A1:F1');
    worksheet.getCell('A1').font = { bold: true, size: 16 };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };
    
    // Add instructions
    worksheet.insertRow(2, []);
    worksheet.insertRow(3, ['Data Test untuk Import:']);
    worksheet.getCell('A3').font = { bold: true };
    worksheet.insertRow(4, ['- Baris 10-11: Data baru (akan berhasil diimpor)']);
    worksheet.insertRow(5, ['- Baris 12-13: Data duplikat NIB/NIK (akan ditolak)']);
    worksheet.insertRow(6, ['- Baris 14: Data baru lagi (akan berhasil diimpor)']);
    worksheet.insertRow(7, []);
    worksheet.insertRow(8, []);
    
    // Style header row (row 9)
    const headerRow = worksheet.getRow(9);
    headerRow.font = { bold: true };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
    };
    
    // Add test data - mix of new and duplicate data
    const testData = [
        // Data baru (akan berhasil diimpor)
        {
            nib: '9876543210987',
            nik: '3518019876543210',
            namaLengkap: 'Test User Baru 1',
            alamatLengkap: 'Jl. Test Baru No. 1, Kelurahan Test, Kecamatan Test, Kota Madiun',
            namaUsaha: 'Usaha Test Baru 1',
            nomorHP: '081999888777'
        },
        {
            nib: '8765432109876',
            nik: '3518018765432109',
            namaLengkap: 'Test User Baru 2',
            alamatLengkap: 'Jl. Test Baru No. 2, Kelurahan Test, Kecamatan Test, Kota Madiun',
            namaUsaha: 'Usaha Test Baru 2',
            nomorHP: '081999888666'
        },
        // Data duplikat NIB (akan ditolak)
        {
            nib: '1234567890123', // NIB yang sudah ada di database
            nik: '3518019999999999',
            namaLengkap: 'Test User Duplikat NIB',
            alamatLengkap: 'Jl. Test Duplikat No. 1, Kelurahan Test, Kecamatan Test, Kota Madiun',
            namaUsaha: 'Usaha Test Duplikat NIB',
            nomorHP: '081999888555'
        },
        // Data duplikat NIK (akan ditolak)
        {
            nib: '9999999999999',
            nik: '3518012345678901', // NIK yang sudah ada di database
            namaLengkap: 'Test User Duplikat NIK',
            alamatLengkap: 'Jl. Test Duplikat No. 2, Kelurahan Test, Kecamatan Test, Kota Madiun',
            namaUsaha: 'Usaha Test Duplikat NIK',
            nomorHP: '081999888444'
        },
        // Data baru lagi (akan berhasil diimpor)
        {
            nib: '7654321098765',
            nik: '3518017654321098',
            namaLengkap: 'Test User Baru 3',
            alamatLengkap: 'Jl. Test Baru No. 3, Kelurahan Test, Kecamatan Test, Kota Madiun',
            namaUsaha: 'Usaha Test Baru 3',
            nomorHP: '081999888333'
        }
    ];
    
    // Add test data to worksheet
    testData.forEach(data => {
        worksheet.addRow(data);
    });
    
    // Save the file
    const filename = 'test-import-dengan-duplikat.xlsx';
    await workbook.xlsx.writeFile(filename);
    console.log(`File test berhasil dibuat: ${filename}`);
    console.log('File ini berisi:');
    console.log('- 3 data baru yang akan berhasil diimpor');
    console.log('- 2 data duplikat yang akan ditolak');
    console.log('- Total 5 baris data untuk testing');
}

// Run the function
generateTestExcel().catch(console.error);