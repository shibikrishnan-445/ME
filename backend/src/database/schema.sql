-- SME SAGE SQLite Database Schema

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'owner',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS businesses (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  employees INTEGER DEFAULT 5,
  monthly_revenue_range TEXT,
  primary_products TEXT, -- JSON array
  location TEXT,
  currency TEXT DEFAULT '₹',
  is_demo BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS sales (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL,
  date TEXT NOT NULL,
  product TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  revenue REAL NOT NULL,
  unit_cost REAL NOT NULL,
  profit REAL NOT NULL,
  customer_id TEXT,
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  amount REAL NOT NULL,
  description TEXT,
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL,
  product TEXT NOT NULL,
  category TEXT NOT NULL,
  stock INTEGER NOT NULL,
  reorder_level INTEGER NOT NULL,
  unit_cost REAL NOT NULL,
  selling_price REAL NOT NULL,
  supplier TEXT,
  avg_monthly_sales REAL DEFAULT 0,
  stock_coverage_months REAL DEFAULT 0,
  status TEXT DEFAULT 'HEALTHY',
  ai_explanation TEXT,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  name TEXT NOT NULL,
  location TEXT,
  purchase_count INTEGER DEFAULT 1,
  total_spend REAL DEFAULT 0,
  last_purchase_date TEXT,
  segment TEXT DEFAULT 'REGULAR',
  days_since_last_purchase INTEGER DEFAULT 0,
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

CREATE TABLE IF NOT EXISTS insights (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL,
  category TEXT NOT NULL,
  severity TEXT DEFAULT 'warning',
  title TEXT NOT NULL,
  problem TEXT NOT NULL,
  evidence TEXT NOT NULL,
  possible_reason TEXT NOT NULL,
  recommended_action TEXT NOT NULL,
  simulation_preset TEXT, -- JSON string
  source TEXT DEFAULT 'Demo Intelligence Engine',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL,
  type TEXT NOT NULL,
  priority TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  target_module TEXT DEFAULT 'dashboard',
  is_read BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

CREATE TABLE IF NOT EXISTS decisions (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  scenario_type TEXT NOT NULL,
  reason TEXT NOT NULL,
  target_product TEXT,
  parameters TEXT, -- JSON
  simulated_effect TEXT, -- JSON
  actual_effect TEXT, -- JSON
  status TEXT DEFAULT 'SIMULATED',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

CREATE TABLE IF NOT EXISTS uploads (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  upload_type TEXT NOT NULL,
  record_count INTEGER NOT NULL,
  quality_score INTEGER DEFAULT 100,
  issues_fixed INTEGER DEFAULT 0,
  status TEXT DEFAULT 'completed',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);
