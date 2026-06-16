import React, { useState, useContext, useEffect } from 'react';
import { StatusPill } from '../components/StatusPill';
import { IconArrowLeft, IconSend, IconEdit, IconPrinter, IconFileText, IconPlus, IconTrash } from '@tabler/icons-react';
import { RoleContext } from '../App';
import { canPerform } from '../lib/rbac';
import { createPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder } from '../lib/supabaseClient';

export function PurchaseOrders({ orders, refresh, setToastMsg }) {
  const { currentRole } = useContext(RoleContext);
  const [selectedPO, setSelectedPO] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ supplier: '', items: '', value: '', issue_date: '', expected_delivery: '' });

  const handleDispatch = async () => {
    try {
      await updatePurchaseOrder(selectedPO.id, { dispatch_status: 'Dispatched', status: 'Dispatched' });
      await refresh.orders();
      setToastMsg('Order dispatched successfully');
      setSelectedPO(null);
    } catch (err) {
      setToastMsg('Error dispatching order');
    }
  };

  const handleRevise = async () => {
    try {
      const count = (selectedPO.amendmentCount || 0) + 1;
      await updatePurchaseOrder(selectedPO.id, { amendment_count: count });
      await refresh.orders();
      setToastMsg('Order revised successfully');
      setSelectedPO(null);
    } catch (err) {
      setToastMsg('Error revising order');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await deletePurchaseOrder(selectedPO.id);
      await refresh.orders();
      setToastMsg('Order deleted');
      setSelectedPO(null);
    } catch (err) {
      setToastMsg('Error deleting order');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const newId = `PO-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
      await createPurchaseOrder({
        id: newId,
        supplier: formData.supplier,
        items: formData.items,
        value: formData.value,
        issue_date: formData.issue_date,
        expected_delivery: formData.expected_delivery,
        status: 'Pending',
        dispatch_status: 'Not Dispatched'
      });
      await refresh.orders();
      setToastMsg('Order created successfully');
      setIsAdding(false);
    } catch (err) {
      setToastMsg('Error creating order');
    }
  };

  if (isAdding) {
    return (
      <div className="glass-panel">
        <button className="btn btn-text" onClick={() => setIsAdding(false)} style={{ marginBottom: '1rem' }}><IconArrowLeft size={16} /> Back</button>
        <h2>Create Purchase Order</h2>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', maxWidth: '400px' }}>
          <input className="form-input" placeholder="Supplier Name" value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} required />
          <input className="form-input" placeholder="Items Description" value={formData.items} onChange={e => setFormData({...formData, items: e.target.value})} required />
          <input className="form-input" placeholder="Value (MWK)" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} required />
          <input type="date" className="form-input" value={formData.issue_date} onChange={e => setFormData({...formData, issue_date: e.target.value})} required />
          <input type="date" className="form-input" value={formData.expected_delivery} onChange={e => setFormData({...formData, expected_delivery: e.target.value})} required />
          <button type="submit" className="btn btn-action-primary">Create Order</button>
        </form>
      </div>
    );
  }

  if (selectedPO) {
    return (
      <div className="po-details">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <button className="btn btn-text" onClick={() => setSelectedPO(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <IconArrowLeft size={16} /> Back to Orders
          </button>
          <button className="btn btn-action" onClick={handleDelete} style={{ color: '#e11d48', borderColor: '#e11d48' }}>
            <IconTrash size={16} /> Delete
          </button>
        </div>
        
        <div className="glass-panel">
          <div className="flex-between" style={{ borderBottom: '1px solid var(--color-border-tertiary)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{selectedPO.id}</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>Supplier: <span className="font-medium text-primary">{selectedPO.supplier}</span></p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#185FA5' }}>{selectedPO.value}</div>
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <StatusPill status={selectedPO.status} />
              </div>
            </div>
          </div>

          <div className="two-col">
            <div>
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '8px' }}>Order Details</h4>
              <p style={{ fontSize: '13px', marginBottom: '8px' }}><strong>Items:</strong> {selectedPO.items}</p>
              <p style={{ fontSize: '13px', marginBottom: '8px' }}><strong>Issue Date:</strong> {selectedPO.issueDate}</p>
              <p style={{ fontSize: '13px', marginBottom: '8px' }}><strong>Expected Delivery:</strong> {selectedPO.expectedDelivery}</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>Actions</h4>
              <button className="btn btn-action-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleDispatch}>
                <IconSend size={18} /> Dispatch to Supplier
              </button>
              <button className="btn btn-action" style={{ width: '100%', justifyContent: 'center' }} onClick={handleRevise}>
                <IconEdit size={18} /> Revise PO
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel">
      <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
        <span className="section-title">Purchase Orders</span>
        <button className="btn btn-action-primary" onClick={() => setIsAdding(true)}><IconPlus size={16} /> New Order</button>
      </div>
      <div className="table-scroll">
        <table className="modern-table">
        <thead>
          <tr>
            <th>PO Number</th><th>Supplier</th><th>Items</th>
            <th>Issue Date</th><th>Expected Delivery</th><th>Value (MWK)</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {(orders || []).map(o => (
            <tr key={o.id} onClick={() => setSelectedPO(o)} style={{ cursor: 'pointer' }}>
              <td style={{ color: '#185FA5', fontWeight: 500 }}>{o.id}</td>
              <td className="font-medium">{o.supplier}</td>
              <td>{o.items}</td>
              <td>{o.issueDate}</td>
              <td>{o.expectedDelivery}</td>
              <td className="font-medium">{o.value}</td>
              <td><StatusPill status={o.status} /></td>
            </tr>
          ))}
          {(orders || []).length === 0 && (
            <tr><td colSpan="7" className="empty" style={{ background: '#fff' }}>No purchase orders found.</td></tr>
          )}
        </tbody>
        </table>
      </div>
    </div>
  );
}
