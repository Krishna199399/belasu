import XLSX from 'xlsx';
import path from 'path';

const filePath = 'Orders-from - Start -04July 2024 - till - 07Aug2026 - To New Website.xlsx';
console.log('Reading:', filePath);

const workbook = XLSX.readFile(filePath);
console.log('Sheet names:', workbook.SheetNames);

const firstSheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[firstSheetName];
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

console.log('Total rows:', data.length);
if (data.length > 0) {
  console.log('Headers (Row 0):', data[0]);
}
if (data.length > 1) {
  console.log('Sample Data (Row 1):', data[1]);
}

