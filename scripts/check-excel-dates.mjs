import XLSX from 'xlsx';

const workbook = XLSX.readFile('Orders-from - Start -04July 2024 - till - 07Aug2026 - To New Website.xlsx');
const worksheet = workbook.Sheets['Orders'];
const rows = XLSX.utils.sheet_to_json(worksheet);

for (let i = 0; i < 5; i++) {
  const r = rows[i];
  console.log('Row', i, {
    orderNumber: r['Order Number'],
    status: r['Order Status'],
    dateRaw: r['Order Date'],
    phone: r['Phone (Billing)'],
    email: r['Email (Billing)'],
    name: `${r['First Name (Billing)']} ${r['Last Name (Billing)']}`,
    sku: r['SKU'],
    itemName: r['Item Name'],
  });
}

// Convert Excel serial date to JS Date
function excelDateToJSDate(serial) {
  if (typeof serial === 'number') {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    const fractional_day = serial - Math.floor(serial) + 0.0000001;
    let total_seconds = Math.floor(86400 * fractional_day);
    const seconds = total_seconds % 60;
    total_seconds -= seconds;
    const hours = Math.floor(total_seconds / (60 * 60));
    const minutes = Math.floor(total_seconds / 60) % 60;
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
  }
  return new Date(serial);
}

console.log('Sample parsed dates:');
for (let i = 0; i < 3; i++) {
  console.log(rows[i]['Order Date'], '->', excelDateToJSDate(rows[i]['Order Date']).toISOString());
}

