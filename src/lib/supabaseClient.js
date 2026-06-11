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
    status: row.status
  };
}

export async function getPurchaseRequests() {
  const { data, error } = await supabase
    .from('purchase_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(formatRequestRow);
}

export async function createPurchaseRequest(request) {
  const { error } = await supabase
    .from('purchase_requests')
    .insert([request]);

  if (error) throw error;
}

export async function updatePurchaseRequestStatus(id, status) {
  const { error } = await supabase
    .from('purchase_requests')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
}

export async function getPurchaseOrders() {
  const { data, error } = await supabase
    .from('purchase_orders')
    .select('*')
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
    status: row.status
  }));
}

export async function getSuppliers() {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
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
    location: row.location
  }));
}

export async function getInventoryItems() {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
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

export async function getBudgetLines() {
  const { data, error } = await supabase
    .from('budget_lines')
    .select('*')
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
