const XLSX = require('./backend/node_modules/xlsx');
const fs = require('fs');
const path = require('path');

// 1. SALES DATASET
const salesData = [
  { Product: "Wireless Earbuds", Category: "Audio", Quantity: 15, UnitPrice: 1999, UnitCost: 950, Date: "2026-09-01", CustomerId: "CUST-101" },
  { Product: "Mechanical Keyboard", Category: "Accessories", Quantity: 5, UnitPrice: 2499, UnitCost: 1400, Date: "2026-09-02", CustomerId: "CUST-102" },
  { Product: "Smart Watch", Category: "Wearables", Quantity: 12, UnitPrice: 3999, UnitCost: 2200, Date: "2026-09-03", CustomerId: "CUST-103" },
  { Product: "Wireless Mouse", Category: "Accessories", Quantity: 25, UnitPrice: 799, UnitCost: 350, Date: "2026-09-04", CustomerId: "CUST-104" },
  { Product: "Power Bank 10000mAh", Category: "Accessories", Quantity: 8, UnitPrice: 1299, UnitCost: 600, Date: "2026-09-05", CustomerId: "CUST-105" },
  { Product: "Bluetooth Speaker", Category: "Audio", Quantity: 7, UnitPrice: 1799, UnitCost: 900, Date: "2026-09-06", CustomerId: "CUST-106" },
  { Product: "Wireless Earbuds", Category: "Audio", Quantity: 20, UnitPrice: 1999, UnitCost: 950, Date: "2026-09-07", CustomerId: "CUST-107" },
  { Product: "Mechanical Keyboard", Category: "Accessories", Quantity: 3, UnitPrice: 2499, UnitCost: 1400, Date: "2026-09-08", CustomerId: "CUST-108" },
  { Product: "Smart Watch", Category: "Wearables", Quantity: 10, UnitPrice: 3999, UnitCost: 2200, Date: "2026-09-09", CustomerId: "CUST-109" },
  { Product: "Power Bank 10000mAh", Category: "Accessories", Quantity: 14, UnitPrice: 1299, UnitCost: 600, Date: "2026-09-10", CustomerId: "CUST-110" }
];

// 2. INVENTORY DATASET
const inventoryData = [
  { Product: "Wireless Earbuds", Category: "Audio", Stock: 140, ReorderLevel: 40, UnitCost: 950, SellingPrice: 1999, Supplier: "SoundTech Distro" },
  { Product: "Mechanical Keyboard", Category: "Accessories", Stock: 420, ReorderLevel: 50, UnitCost: 1400, SellingPrice: 2499, Supplier: "Keycraft Logistics" },
  { Product: "Smart Watch", Category: "Wearables", Stock: 85, ReorderLevel: 30, UnitCost: 2200, SellingPrice: 3999, Supplier: "OmniGear India" },
  { Product: "Wireless Mouse", Category: "Accessories", Stock: 210, ReorderLevel: 50, UnitCost: 350, SellingPrice: 799, Supplier: "Keycraft Logistics" },
  { Product: "Power Bank 10000mAh", Category: "Accessories", Stock: 18, ReorderLevel: 35, UnitCost: 600, SellingPrice: 1299, Supplier: "PowerCore Tech" },
  { Product: "Bluetooth Speaker", Category: "Audio", Stock: 65, ReorderLevel: 25, UnitCost: 900, SellingPrice: 1799, Supplier: "SoundTech Distro" }
];

// 3. EXPENSE DATASET
const expenseData = [
  { Category: "Salaries", Amount: 145000, Date: "2026-09-01", Description: "Monthly Employee Payroll" },
  { Category: "Rent", Amount: 51000, Date: "2026-09-01", Description: "Main Store Premises Rent" },
  { Category: "Logistics", Amount: 49500, Date: "2026-09-05", Description: "Courier Express Delivery Surcharge" },
  { Category: "Utilities", Amount: 12400, Date: "2026-09-10", Description: "Electricity & High-Speed Internet" },
  { Category: "Marketing", Amount: 18500, Date: "2026-09-12", Description: "Social Media Ads Campaign" }
];

// Create Excel Workbook
const wb = XLSX.utils.book_new();

const salesSheet = XLSX.utils.json_to_sheet(salesData);
const inventorySheet = XLSX.utils.json_to_sheet(inventoryData);
const expenseSheet = XLSX.utils.json_to_sheet(expenseData);

XLSX.utils.book_append_sheet(wb, salesSheet, "Sales Data");
XLSX.utils.book_append_sheet(wb, inventorySheet, "Inventory Data");
XLSX.utils.book_append_sheet(wb, expenseSheet, "Expense Data");

// Save Excel file
const excelPath = path.join(__dirname, 'Sample_SME_Business_Data.xlsx');
XLSX.writeFile(wb, excelPath);
console.log(`Excel file created at: ${excelPath}`);

// Also save standalone CSV files for easy testing
const salesCsv = XLSX.utils.sheet_to_csv(salesSheet);
fs.writeFileSync(path.join(__dirname, 'Sample_Sales_Data.csv'), salesCsv);

const inventoryCsv = XLSX.utils.sheet_to_csv(inventorySheet);
fs.writeFileSync(path.join(__dirname, 'Sample_Inventory_Data.csv'), inventoryCsv);

const expenseCsv = XLSX.utils.sheet_to_csv(expenseSheet);
fs.writeFileSync(path.join(__dirname, 'Sample_Expense_Data.csv'), expenseCsv);

console.log("CSV files created successfully!");
