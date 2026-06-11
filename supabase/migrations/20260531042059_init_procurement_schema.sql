-- Drop existing tables and recreate schema for Procurement System

DROP TABLE IF EXISTS budget_lines CASCADE;
DROP TABLE IF EXISTS inventory_items CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS purchase_orders CASCADE;
DROP TABLE IF EXISTS purchase_requests CASCADE;

CREATE TABLE purchase_requests (
  id text PRIMARY KEY,
  item text NOT NULL,
  description text,
  department text NOT NULL,
  requested_by text NOT NULL,
  request_date date,
  amount text NOT NULL,
  priority text NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE purchase_orders (
  id text PRIMARY KEY,
  supplier text NOT NULL,
  items text NOT NULL,
  issue_date date,
  expected_delivery date,
  value text NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE suppliers (
  id text PRIMARY KEY,
  name text NOT NULL,
  avatar text,
  color text,
  category text,
  rating numeric(2,1),
  phone text,
  location text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE inventory_items (
  code text PRIMARY KEY,
  description text NOT NULL,
  category text NOT NULL,
  in_stock integer NOT NULL,
  reorder_level integer NOT NULL,
  unit_cost text NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE budget_lines (
  code text PRIMARY KEY,
  department text NOT NULL,
  allocated text NOT NULL,
  committed text NOT NULL,
  spent text NOT NULL,
  progress integer NOT NULL,
  color text,
  created_at timestamptz DEFAULT now()
);
