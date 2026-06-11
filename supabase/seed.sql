-- Seed Procurement System sample data

INSERT INTO purchase_requests (id, item, description, department, requested_by, request_date, amount, priority, status)
VALUES
  ('PR-2025-041', 'Office Furniture Set', 'Executive Office Furniture Set', 'Administration', 'T. Banda', '2025-05-14', 'MK 1,240,000', 'High', 'Pending'),
  ('PR-2025-040', 'Generator Diesel Fuel (500L)', 'Generator Diesel Fuel (500L)', 'Operations', 'C. Nkhata', '2025-05-12', 'MK 420,000', 'Normal', 'Approved'),
  ('PR-2025-039', 'Laptops x10 (HP ProBook)', 'Laptops x10 (HP ProBook)', 'ICT', 'K. Phiri', '2025-05-10', 'MK 9,500,000', 'High', 'Ordered'),
  ('PR-2025-038', 'A4 Paper & Stationery', 'A4 Paper & Stationery', 'Finance', 'M. Zimba', '2025-05-08', 'MK 185,000', 'Normal', 'Received'),
  ('PR-2025-037', 'Network Switch & Cat6 Cabling', 'Network Switch & Cabling', 'ICT', 'K. Phiri', '2025-05-05', 'MK 3,800,000', 'Urgent', 'Pending'),
  ('PR-2025-035', 'Medical Consumables Q3', 'Medical Consumables (Q3)', 'Health', 'G. Mwale', '2025-05-01', 'MK 8,500,000', 'High', 'Pending'),
  ('PR-2025-032', 'Vehicle Servicing (Fleet x4)', 'Vehicle Servicing (Fleet x4)', 'Transport', 'J. Mbewe', '2025-04-28', 'MK 2,100,000', 'Normal', 'Approved');

INSERT INTO purchase_orders (id, supplier, items, issue_date, expected_delivery, value, status)
VALUES
  ('PO-2025-018', 'Blantyre Business Supplies', 'Office Furniture (15 items)', '2025-05-13', '2025-05-28', 'MK 3,750,000', 'In Transit'),
  ('PO-2025-017', 'TechMalawi Ltd', 'HP Laptops x10', '2025-05-11', '2025-05-25', 'MK 9,500,000', 'Confirmed'),
  ('PO-2025-016', 'Lilongwe Petroleum Co.', 'Diesel Fuel 500L', '2025-05-12', '2025-05-14', 'MK 420,000', 'Delivered'),
  ('PO-2025-015', 'Mzuzu Medical Supplies', 'Consumables (42 lines)', '2025-05-03', '2025-05-20', 'MK 8,500,000', 'In Transit'),
  ('PO-2025-014', 'Nationwide Stationery', 'A4 Paper, Pens, Files', '2025-05-09', '2025-05-11', 'MK 185,000', 'Delivered');

INSERT INTO suppliers (id, name, avatar, color, category, rating, phone, location)
VALUES
  ('SUP-01', 'Blantyre Business Supplies', 'BB', 'background:#E6F1FB;color:#0C447C', 'Office Supplies · Furniture', 4.7, '+265 1 820 441', 'Blantyre'),
  ('SUP-02', 'TechMalawi Ltd', 'TM', 'background:#E1F5EE;color:#085041', 'ICT Equipment · Software', 4.5, '+265 1 773 200', 'Lilongwe'),
  ('SUP-03', 'Lilongwe Petroleum Co.', 'LP', 'background:#FAEEDA;color:#633806', 'Fuel & Lubricants', 4.2, '+265 1 751 018', 'Lilongwe'),
  ('SUP-04', 'Mzuzu Medical Supplies', 'MM', 'background:#FBEAF0;color:#72243E', 'Medical Consumables · Equipment', 4.9, '+265 1 332 651', 'Mzuzu'),
  ('SUP-05', 'Nationwide Stationery', 'NS', 'background:#EEEDFE;color:#3C3489', 'Stationery · Printing', 4.1, '+265 1 840 229', 'Zomba');

INSERT INTO inventory_items (code, description, category, in_stock, reorder_level, unit_cost, status)
VALUES
  ('INV-0041', 'HP ProBook Laptop', 'ICT Equipment', 4, 5, 'MK 950,000', 'Low Stock'),
  ('INV-0040', 'A4 Printing Paper (Ream)', 'Stationery', 230, 50, 'MK 3,500', 'In Stock'),
  ('INV-0038', 'Office Chair (Executive)', 'Furniture', 12, 10, 'MK 85,000', 'In Stock'),
  ('INV-0037', 'Diesel Fuel (Litres)', 'Fuel', 80, 200, 'MK 900', 'Critical'),
  ('INV-0035', 'Surgical Gloves (Box)', 'Medical', 340, 100, 'MK 12,000', 'In Stock'),
  ('INV-0030', 'Network Cable Cat6 (m)', 'ICT', 0, 50, 'MK 250', 'Out of Stock');

INSERT INTO budget_lines (code, department, allocated, committed, spent, progress, color)
VALUES
  ('MF-2025-001', 'Ministry of Finance', 'MK 680,000,000', 'MK 420,000,000', 'MK 340,000,000', 50, '#185FA5'),
  ('MH-2025-002', 'Ministry of Health', 'MK 550,000,000', 'MK 310,000,000', 'MK 200,000,000', 36, '#1D9E75'),
  ('ME-2025-003', 'Ministry of Education', 'MK 420,000,000', 'MK 180,000,000', 'MK 150,000,000', 36, '#BA7517'),
  ('MI-2025-004', 'Ministry of Infrastructure', 'MK 480,000,000', 'MK 90,000,000', 'MK 90,000,000', 19, '#D85A30'),
  ('ICT-2025-005', 'ICT Division', 'MK 180,000,000', 'MK 98,000,000', 'MK 88,000,000', 49, '#7F77DD'),
  ('AD-2025-006', 'Administration', 'MK 90,000,000', 'MK 22,000,000', 'MK 22,000,000', 24, '#888780');
