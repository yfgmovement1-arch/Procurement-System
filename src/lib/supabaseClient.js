import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

function formatRequestRow(row) {
  return {
    id: row.id,
    item: row.item,
    desc: row.description ?? row.item,
    dept: row.department,
    requestedBy: row.requested_by,
    date: row.request_date
      ? new Date(row.request_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : '',
    amount: row.amount,
    priority: row.priority,
    status: row.status,
    costCenter: row.cost_center,
    justification: row.justification,
    approvalStage: row.approval_stage
  };
}

// -------------------------------------------------------------
// PURCHASE REQUESTS
// -------------------------------------------------------------
export async function getPurchaseRequests() {
  const { data, error } = await supabase
    .from('purchase_requests')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(formatRequestRow);
}

export async function createPurchaseRequest(request) {
  const { error } = await supabase.from('purchase_requests').insert([request]);
  if (error) throw error;
}

export async function updatePurchaseRequestStatus(id, status, approval_stage = null) {
  const payload = { status };
  if (approval_stage) payload.approval_stage = approval_stage;
  const { error } = await supabase.from('purchase_requests').update(payload).eq('id', id);
  if (error) throw error;
}

export async function deletePurchaseRequest(id) {
  const { error } = await supabase.from('purchase_requests').update({ deleted_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}

// -------------------------------------------------------------
// PURCHASE ORDERS
// -------------------------------------------------------------
export async function getPurchaseOrders() {
  const { data, error } = await supabase
    .from('purchase_orders')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(row => ({
    id: row.id,
    supplier: row.supplier,
    items: row.items,
    issueDate: row.issue_date
      ? new Date(row.issue_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : '',
    expectedDelivery: row.expected_delivery
      ? new Date(row.expected_delivery).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : '',
    value: row.value,
    status: row.status,
    contractId: row.contract_id,
    dispatchMethod: row.dispatch_method,
    dispatchStatus: row.dispatch_status,
    amendmentCount: row.amendment_count
  }));
}

export async function createPurchaseOrder(record) {
  const { error } = await supabase.from('purchase_orders').insert([record]);
  if (error) throw error;
}
export async function updatePurchaseOrder(id, payload) {
  const { error } = await supabase.from('purchase_orders').update(payload).eq('id', id);
  if (error) throw error;
}
export async function deletePurchaseOrder(id) {
  const { error } = await supabase.from('purchase_orders').update({ deleted_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}

// -------------------------------------------------------------
// SUPPLIERS
// -------------------------------------------------------------
export async function getSuppliers() {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(row => ({
    id: row.id,
    name: row.name,
    avatar: row.avatar,
    color: row.color,
    category: row.category,
    rating: row.rating,
    phone: row.phone,
    location: row.location,
    bankDetails: row.bank_details,
    certifications: row.certifications,
    performanceRating: row.performance_rating
  }));
}

export async function createSupplier(record) {
  const { error } = await supabase.from('suppliers').insert([record]);
  if (error) throw error;
}
export async function updateSupplier(id, payload) {
  const { error } = await supabase.from('suppliers').update(payload).eq('id', id);
  if (error) throw error;
}
export async function deleteSupplier(id) {
  const { error } = await supabase.from('suppliers').update({ deleted_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}

// -------------------------------------------------------------
// INVENTORY
// -------------------------------------------------------------
export async function getInventoryItems() {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(row => ({
    code: row.code,
    desc: row.description,
    category: row.category,
    inStock: row.in_stock,
    reorder: row.reorder_level,
    unitCost: row.unit_cost,
    status: row.status
  }));
}

export async function createInventoryItem(record) {
  const { error } = await supabase.from('inventory_items').insert([record]);
  if (error) throw error;
}
export async function updateInventoryItem(code, payload) {
  const { error } = await supabase.from('inventory_items').update(payload).eq('code', code);
  if (error) throw error;
}
export async function deleteInventoryItem(code) {
  const { error } = await supabase.from('inventory_items').update({ deleted_at: new Date().toISOString() }).eq('code', code);
  if (error) throw error;
}

// -------------------------------------------------------------
// BUDGET LINES
// -------------------------------------------------------------
export async function getBudgetLines() {
  const { data, error } = await supabase
    .from('budget_lines')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(row => ({
    code: row.code,
    dept: row.department,
    allocated: row.allocated,
    committed: row.committed,
    spent: row.spent,
    progress: row.progress,
    color: row.color
  }));
}

export async function createBudgetLine(record) {
  const { error } = await supabase.from('budget_lines').insert([record]);
  if (error) throw error;
}
export async function updateBudgetLine(code, payload) {
  const { error } = await supabase.from('budget_lines').update(payload).eq('code', code);
  if (error) throw error;
}
export async function deleteBudgetLine(code) {
  const { error } = await supabase.from('budget_lines').update({ deleted_at: new Date().toISOString() }).eq('code', code);
  if (error) throw error;
}

// -------------------------------------------------------------
// CONTRACTS
// -------------------------------------------------------------
export async function getContracts() {
  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(row => ({
    id: row.id,
    supplierId: row.supplier_id,
    title: row.title,
    startDate: row.start_date ? new Date(row.start_date).toLocaleDateString('en-GB') : '',
    endDate: row.end_date ? new Date(row.end_date).toLocaleDateString('en-GB') : '',
    value: row.value,
    status: row.status,
    terms: row.terms
  }));
}

export async function createContract(record) {
  const { error } = await supabase.from('contracts').insert([record]);
  if (error) throw error;
}
export async function updateContract(id, payload) {
  const { error } = await supabase.from('contracts').update(payload).eq('id', id);
  if (error) throw error;
}
export async function deleteContract(id) {
  const { error } = await supabase.from('contracts').update({ deleted_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}

// -------------------------------------------------------------
// CATALOGUE
// -------------------------------------------------------------
export async function getCatalogue() {
  const { data, error } = await supabase
    .from('catalogue')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(row => ({
    id: row.id,
    name: row.name,
    category: row.category,
    supplierId: row.supplier_id,
    unitPrice: row.unit_price,
    pricingTier: row.pricing_tier,
    status: row.status
  }));
}

export async function createCatalogueItem(record) {
  const { error } = await supabase.from('catalogue').insert([record]);
  if (error) throw error;
}
export async function updateCatalogueItem(id, payload) {
  const { error } = await supabase.from('catalogue').update(payload).eq('id', id);
  if (error) throw error;
}
export async function deleteCatalogueItem(id) {
  const { error } = await supabase.from('catalogue').update({ deleted_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}

// -------------------------------------------------------------
// GOODS RECEIPTS
// -------------------------------------------------------------
export async function getGoodsReceipts() {
  const { data, error } = await supabase
    .from('goods_receipts')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(row => ({
    id: row.id,
    poId: row.po_id,
    receivedDate: row.received_date ? new Date(row.received_date).toLocaleDateString('en-GB') : '',
    receivedBy: row.received_by,
    itemsReceived: row.items_received,
    condition: row.condition,
    status: row.status
  }));
}

export async function createGoodsReceipt(record) {
  const { error } = await supabase.from('goods_receipts').insert([record]);
  if (error) throw error;
}
export async function updateGoodsReceipt(id, payload) {
  const { error } = await supabase.from('goods_receipts').update(payload).eq('id', id);
  if (error) throw error;
}
export async function deleteGoodsReceipt(id) {
  const { error } = await supabase.from('goods_receipts').update({ deleted_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}

// -------------------------------------------------------------
// INVOICES
// -------------------------------------------------------------
export async function getInvoices() {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(row => ({
    id: row.id,
    supplierId: row.supplier_id,
    poId: row.po_id,
    grnId: row.grn_id,
    amount: row.amount,
    issueDate: row.issue_date ? new Date(row.issue_date).toLocaleDateString('en-GB') : '',
    dueDate: row.due_date ? new Date(row.due_date).toLocaleDateString('en-GB') : '',
    documentUrl: row.document_url,
    status: row.status,
    matchStatus: row.match_status
  }));
}

export async function createInvoice(record) {
  const { error } = await supabase.from('invoices').insert([record]);
  if (error) throw error;
}
export async function updateInvoice(id, payload) {
  const { error } = await supabase.from('invoices').update(payload).eq('id', id);
  if (error) throw error;
}
export async function deleteInvoice(id) {
  const { error } = await supabase.from('invoices').update({ deleted_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}
