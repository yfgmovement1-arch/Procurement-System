-- ERP Expansion Schema Migration

-- 1. Suppliers Updates
ALTER TABLE suppliers ADD COLUMN bank_details text;
ALTER TABLE suppliers ADD COLUMN certifications text;
ALTER TABLE suppliers ADD COLUMN performance_rating numeric(3,2) DEFAULT 0.00;

-- 2. Purchase Requests Updates
ALTER TABLE purchase_requests ADD COLUMN cost_center text;
ALTER TABLE purchase_requests ADD COLUMN justification text;
ALTER TABLE purchase_requests ADD COLUMN approval_stage text DEFAULT 'Pending Manager';

-- 3. Contracts (New)
CREATE TABLE contracts (
  id text PRIMARY KEY,
  supplier_id text NOT NULL REFERENCES suppliers(id),
  title text NOT NULL,
  start_date date,
  end_date date,
  value text,
  status text NOT NULL,
  terms text,
  created_at timestamptz DEFAULT now()
);

-- 4. Purchase Orders Updates
ALTER TABLE purchase_orders ADD COLUMN contract_id text REFERENCES contracts(id);
ALTER TABLE purchase_orders ADD COLUMN dispatch_method text;
ALTER TABLE purchase_orders ADD COLUMN dispatch_status text DEFAULT 'Not Dispatched';
ALTER TABLE purchase_orders ADD COLUMN amendment_count integer DEFAULT 0;

-- 5. Goods Receipts (New)
CREATE TABLE goods_receipts (
  id text PRIMARY KEY,
  po_id text NOT NULL REFERENCES purchase_orders(id),
  received_date date NOT NULL,
  received_by text NOT NULL,
  items_received text NOT NULL,
  condition text,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 6. Invoices (New)
CREATE TABLE invoices (
  id text PRIMARY KEY,
  supplier_id text NOT NULL REFERENCES suppliers(id),
  po_id text REFERENCES purchase_orders(id),
  grn_id text REFERENCES goods_receipts(id),
  amount text NOT NULL,
  issue_date date,
  due_date date,
  document_url text,
  status text NOT NULL,
  match_status text DEFAULT 'Pending',
  created_at timestamptz DEFAULT now()
);

-- 7. Catalogue (New)
CREATE TABLE catalogue (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  supplier_id text REFERENCES suppliers(id),
  unit_price text NOT NULL,
  pricing_tier text,
  status text NOT NULL DEFAULT 'Active',
  created_at timestamptz DEFAULT now()
);
