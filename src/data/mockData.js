export const initialRequests = [
  { id: 'PR-2025-041', item: 'Office Furniture Set', desc: 'Executive Office Furniture Set', dept: 'Administration', requestedBy: 'T. Banda', date: '14 May 2025', amount: 'MK 1,240,000', priority: 'High', status: 'Pending' },
  { id: 'PR-2025-040', item: 'Generator Diesel Fuel (500L)', desc: 'Generator Diesel Fuel (500L)', dept: 'Operations', requestedBy: 'C. Nkhata', date: '12 May 2025', amount: 'MK 420,000', priority: 'Normal', status: 'Approved' },
  { id: 'PR-2025-039', item: 'Laptops x10 (HP ProBook)', desc: 'Laptops x10 (HP ProBook)', dept: 'ICT', requestedBy: 'K. Phiri', date: '10 May 2025', amount: 'MK 9,500,000', priority: 'High', status: 'Ordered' },
  { id: 'PR-2025-038', item: 'A4 Paper & Stationery', desc: 'A4 Paper & Stationery', dept: 'Finance', requestedBy: 'M. Zimba', date: '8 May 2025', amount: 'MK 185,000', priority: 'Normal', status: 'Received' },
  { id: 'PR-2025-037', item: 'Network Switch & Cat6 Cabling', desc: 'Network Switch & Cabling', dept: 'ICT', requestedBy: 'K. Phiri', date: '5 May 2025', amount: 'MK 3,800,000', priority: 'Urgent', status: 'Pending' },
  { id: 'PR-2025-035', item: 'Medical Consumables Q3', desc: 'Medical Consumables (Q3)', dept: 'Health', requestedBy: 'G. Mwale', date: '1 May 2025', amount: 'MK 8,500,000', priority: 'High', status: 'Pending' },
  { id: 'PR-2025-032', item: 'Vehicle Servicing (Fleet x4)', desc: 'Vehicle Servicing (Fleet x4)', dept: 'Transport', requestedBy: 'J. Mbewe', date: '28 Apr 2025', amount: 'MK 2,100,000', priority: 'Normal', status: 'Approved' }
];

export const orders = [
  { id: 'PO-2025-018', supplier: 'Blantyre Business Supplies', items: 'Office Furniture (15 items)', issueDate: '13 May 2025', expectedDelivery: '28 May 2025', value: 'MK 3,750,000', status: 'In Transit' },
  { id: 'PO-2025-017', supplier: 'TechMalawi Ltd', items: 'HP Laptops x10', issueDate: '11 May 2025', expectedDelivery: '25 May 2025', value: 'MK 9,500,000', status: 'Confirmed' },
  { id: 'PO-2025-016', supplier: 'Lilongwe Petroleum Co.', items: 'Diesel Fuel 500L', issueDate: '12 May 2025', expectedDelivery: '14 May 2025', value: 'MK 420,000', status: 'Delivered' },
  { id: 'PO-2025-015', supplier: 'Mzuzu Medical Supplies', items: 'Consumables (42 lines)', issueDate: '3 May 2025', expectedDelivery: '20 May 2025', value: 'MK 8,500,000', status: 'In Transit' },
  { id: 'PO-2025-014', supplier: 'Nationwide Stationery', items: 'A4 Paper, Pens, Files', issueDate: '9 May 2025', expectedDelivery: '11 May 2025', value: 'MK 185,000', status: 'Delivered' }
];

export const suppliers = [
  { id: 'SUP-01', name: 'Blantyre Business Supplies', avatar: 'BB', color: 'background:#E6F1FB;color:#0C447C', category: 'Office Supplies · Furniture', rating: '4.7/5', phone: '+265 1 820 441', location: 'Blantyre' },
  { id: 'SUP-02', name: 'TechMalawi Ltd', avatar: 'TM', color: 'background:#E1F5EE;color:#085041', category: 'ICT Equipment · Software', rating: '4.5/5', phone: '+265 1 773 200', location: 'Lilongwe' },
  { id: 'SUP-03', name: 'Lilongwe Petroleum Co.', avatar: 'LP', color: 'background:#FAEEDA;color:#633806', category: 'Fuel & Lubricants', rating: '4.2/5', phone: '+265 1 751 018', location: 'Lilongwe' },
  { id: 'SUP-04', name: 'Mzuzu Medical Supplies', avatar: 'MM', color: 'background:#FBEAF0;color:#72243E', category: 'Medical Consumables · Equipment', rating: '4.9/5', phone: '+265 1 332 651', location: 'Mzuzu' },
  { id: 'SUP-05', name: 'Nationwide Stationery', avatar: 'NS', color: 'background:#EEEDFE;color:#3C3489', category: 'Stationery · Printing', rating: '4.1/5', phone: '+265 1 840 229', location: 'Zomba' }
];

export const inventory = [
  { code: 'INV-0041', desc: 'HP ProBook Laptop', category: 'ICT Equipment', inStock: 4, reorder: 5, unitCost: 'MK 950,000', status: 'Low Stock' },
  { code: 'INV-0040', desc: 'A4 Printing Paper (Ream)', category: 'Stationery', inStock: 230, reorder: 50, unitCost: 'MK 3,500', status: 'In Stock' },
  { code: 'INV-0038', desc: 'Office Chair (Executive)', category: 'Furniture', inStock: 12, reorder: 10, unitCost: 'MK 85,000', status: 'In Stock' },
  { code: 'INV-0037', desc: 'Diesel Fuel (Litres)', category: 'Fuel', inStock: 80, reorder: 200, unitCost: 'MK 900', status: 'Critical' },
  { code: 'INV-0035', desc: 'Surgical Gloves (Box)', category: 'Medical', inStock: 340, reorder: 100, unitCost: 'MK 12,000', status: 'In Stock' },
  { code: 'INV-0030', desc: 'Network Cable Cat6 (m)', category: 'ICT', inStock: 0, reorder: 50, unitCost: 'MK 250', status: 'Out of Stock' }
];

export const budgetLines = [
  { dept: 'Ministry of Finance', code: 'MF-2025-001', allocated: 'MK 680,000,000', committed: 'MK 420,000,000', spent: 'MK 340,000,000', progress: 50, color: '#185FA5' },
  { dept: 'Ministry of Health', code: 'MH-2025-002', allocated: 'MK 550,000,000', committed: 'MK 310,000,000', spent: 'MK 200,000,000', progress: 36, color: '#1D9E75' },
  { dept: 'Ministry of Education', code: 'ME-2025-003', allocated: 'MK 420,000,000', committed: 'MK 180,000,000', spent: 'MK 150,000,000', progress: 36, color: '#BA7517' },
  { dept: 'Ministry of Infrastructure', code: 'MI-2025-004', allocated: 'MK 480,000,000', committed: 'MK 90,000,000', spent: 'MK 90,000,000', progress: 19, color: '#D85A30' },
  { dept: 'ICT Division', code: 'ICT-2025-005', allocated: 'MK 180,000,000', committed: 'MK 98,000,000', spent: 'MK 88,000,000', progress: 49, color: '#7F77DD' },
  { dept: 'Administration', code: 'AD-2025-006', allocated: 'MK 90,000,000', committed: 'MK 22,000,000', spent: 'MK 22,000,000', progress: 24, color: '#888780' }
];
