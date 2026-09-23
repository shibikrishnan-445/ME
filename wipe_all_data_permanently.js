const { getDb, persistDb } = require('./backend/src/database/db');

async function wipeEverything() {
  const db = await getDb();
  console.log("Wiping all records from database permanently...");
  
  db.run("DELETE FROM sales;");
  db.run("DELETE FROM expenses;");
  db.run("DELETE FROM inventory;");
  db.run("DELETE FROM customers;");
  db.run("DELETE FROM insights;");
  db.run("DELETE FROM alerts;");
  db.run("DELETE FROM decisions;");
  db.run("DELETE FROM uploads;");
  db.run("DELETE FROM businesses;");

  persistDb();
  console.log("SUCCESS: All tables are completely empty (0 records).");
}

wipeEverything().catch(err => console.error("Error wiping database:", err));
