import * as XLSX from 'xlsx';

export interface DataCleanResult {
  category: 'SALES' | 'EXPENSE' | 'INVENTORY' | 'CUSTOMER';
  totalRows: number;
  validRows: number;
  issuesCount: number;
  duplicateCount: number;
  qualityScore: number;
  detectedColumns: string[];
  issues: { row: number; column: string; issue: string; fixedValue?: any }[];
  cleanedData: any[];
}

export function parseAndCleanFile(
  fileBuffer: Buffer,
  filename: string,
  category: 'SALES' | 'EXPENSE' | 'INVENTORY' | 'CUSTOMER'
): DataCleanResult {
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });

  const detectedColumns = rawRows.length > 0 ? Object.keys(rawRows[0]) : [];
  const issues: { row: number; column: string; issue: string; fixedValue?: any }[] = [];
  const cleanedData: any[] = [];
  const seenKeys = new Set<string>();
  let duplicateCount = 0;

  rawRows.forEach((row, idx) => {
    const rowNum = idx + 2; // Excel row numbering
    const cleanRow: Record<string, any> = {};
    let isRowDuplicate = false;

    // Check duplicates based on composite key
    const rowKey = Object.values(row).join('|').trim();
    if (seenKeys.has(rowKey) && rowKey.length > 5) {
      duplicateCount++;
      isRowDuplicate = true;
      issues.push({ row: rowNum, column: 'ALL', issue: 'Duplicate row detected. Deduplicated automatically.' });
      return;
    }
    seenKeys.add(rowKey);

    // Clean based on category
    if (category === 'SALES') {
      const product = String(row.Product || row.product || row.Item || 'Standard Item').trim();
      let qty = Number(row.Quantity || row.quantity || row.Qty || 1);
      let price = Number(row.UnitPrice || row.unit_price || row.Price || 999);
      let date = String(row.Date || row.date || '2026-09-01').trim();

      if (isNaN(qty) || qty <= 0) {
        issues.push({ row: rowNum, column: 'Quantity', issue: `Invalid quantity '${row.Quantity}', defaulted to 1`, fixedValue: 1 });
        qty = 1;
      }
      if (isNaN(price) || price < 0) {
        issues.push({ row: rowNum, column: 'UnitPrice', issue: `Invalid price '${row.UnitPrice}', defaulted to ₹999`, fixedValue: 999 });
        price = 999;
      }
      if (!date || date.length < 4) {
        date = new Date().toISOString().split('T')[0];
        issues.push({ row: rowNum, column: 'Date', issue: 'Missing date, assigned current period', fixedValue: date });
      }

      cleanRow.product = product;
      cleanRow.category = row.Category || 'General';
      cleanRow.quantity = qty;
      cleanRow.unit_price = price;
      cleanRow.revenue = qty * price;
      cleanRow.unit_cost = row.UnitCost ? Number(row.UnitCost) : Math.round(price * 0.6);
      cleanRow.profit = cleanRow.revenue - (qty * cleanRow.unit_cost);
      cleanRow.date = date;
      cleanRow.customer_id = row.CustomerId || `CUST-${Math.floor(100 + Math.random() * 50)}`;
    } else if (category === 'EXPENSE') {
      const expCat = String(row.Category || row.category || 'Operations').trim();
      let amount = Number(row.Amount || row.amount || row.Cost || 0);
      let date = String(row.Date || row.date || '2026-09-01').trim();

      if (isNaN(amount) || amount <= 0) {
        issues.push({ row: rowNum, column: 'Amount', issue: `Non-positive amount corrected to ₹1,000`, fixedValue: 1000 });
        amount = 1000;
      }

      cleanRow.category = expCat;
      cleanRow.amount = amount;
      cleanRow.date = date;
      cleanRow.description = row.Description || row.description || `${expCat} expense entry`;
    } else if (category === 'INVENTORY') {
      const product = String(row.Product || row.product || 'New Item').trim();
      let stock = Number(row.Stock || row.stock || 0);
      let reorder = Number(row.ReorderLevel || row.reorder_level || 20);
      let unitCost = Number(row.UnitCost || row.unit_cost || 500);
      let sellingPrice = Number(row.SellingPrice || row.selling_price || 999);

      if (isNaN(stock) || stock < 0) {
        issues.push({ row: rowNum, column: 'Stock', issue: 'Negative or non-numeric stock adjusted to 0', fixedValue: 0 });
        stock = 0;
      }

      cleanRow.product = product;
      cleanRow.category = row.Category || 'General';
      cleanRow.stock = stock;
      cleanRow.reorder_level = reorder;
      cleanRow.unit_cost = unitCost;
      cleanRow.selling_price = sellingPrice;
      cleanRow.supplier = row.Supplier || 'Primary Vendor';
    } else {
      // CUSTOMER
      cleanRow.customer_id = String(row.CustomerId || row.customer_id || `CUST-${idx + 100}`).trim();
      cleanRow.name = String(row.Name || row.name || 'Customer').trim();
      cleanRow.location = String(row.Location || row.location || 'Bangalore').trim();
      cleanRow.purchase_count = Number(row.PurchaseCount || 1);
      cleanRow.total_spend = Number(row.TotalSpend || 1500);
      cleanRow.last_purchase_date = String(row.LastPurchase || '2026-08-15');
      cleanRow.segment = cleanRow.total_spend > 30000 ? 'HIGH VALUE' : 'REGULAR';
      cleanRow.days_since_last_purchase = 20;
    }

    cleanedData.push(cleanRow);
  });

  const totalRows = rawRows.length;
  const issuesCount = issues.length;
  // Calculate Data Quality Score (100 - penalties)
  const penalty = Math.min(60, Math.round((issuesCount / Math.max(1, totalRows)) * 100));
  const qualityScore = Math.max(40, 100 - penalty);

  return {
    category,
    totalRows,
    validRows: cleanedData.length,
    issuesCount,
    duplicateCount,
    qualityScore,
    detectedColumns,
    issues,
    cleanedData
  };
}
