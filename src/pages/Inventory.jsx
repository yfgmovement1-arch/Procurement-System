import React, { useState } from 'react';
import { MetricCard } from '../components/MetricCard';
import { StatusPill } from '../components/StatusPill';
import { IconArrowLeft, IconPlus, IconTrash, IconEdit } from '@tabler/icons-react';
import { createInventoryItem, updateInventoryItem, deleteInventoryItem } from '../lib/supabaseClient';

export function Inventory({ inventory, refresh, setToastMsg }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ description: '', category: '', in_stock: 0, reorder_level: 0, unit_cost: '' });

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteInventoryItem(selectedItem.code);
      await refresh.inventory();
      setToastMsg('Item deleted');
      setSelectedItem(null);
    } catch (err) {
      setToastMsg('Error deleting item');
    }
  };

  const handleUpdateStatus = async () => {
    try {
      const newStatus = selectedItem.inStock > selectedItem.reorder ? 'In Stock' : 'Low Stock';
      await updateInventoryItem(selectedItem.code, { status: newStatus });
      await refresh.inventory();
      setToastMsg('Status updated');
      setSelectedItem(null);
    } catch (err) {
      setToastMsg('Error updating status');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const newCode = `INV-${Date.now().toString().slice(-4)}`;
      const status = formData.in_stock > formData.reorder_level ? 'In Stock' : 'Low Stock';
      await createInventoryItem({
        code: newCode,
        description: formData.description,
        category: formData.category,
        in_stock: parseInt(formData.in_stock),
        reorder_level: parseInt(formData.reorder_level),
        unit_cost: formData.unit_cost,
        status
      });
      await refresh.inventory();
      setToastMsg('Item added to inventory');
      setIsAdding(false);
      setFormData({ description: '', category: '', in_stock: 0, reorder_level: 0, unit_cost: '' });
    } catch (err) {
      setToastMsg('Error adding item');
    }
  };

  if (isAdding) {
    return (
      <div className="glass-panel">
        <button className="btn btn-text" onClick={() => setIsAdding(false)} style={{ marginBottom: '1rem' }}><IconArrowLeft size={16} /> Back</button>
        <h2>Add Inventory Item</h2>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', maxWidth: '400px' }}>
          <input className="form-input" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
          <input className="form-input" placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
          <input type="number" className="form-input" placeholder="In Stock" value={formData.in_stock} onChange={e => setFormData({...formData, in_stock: e.target.value})} required />
          <input type="number" className="form-input" placeholder="Reorder Level" value={formData.reorder_level} onChange={e => setFormData({...formData, reorder_level: e.target.value})} required />
          <input className="form-input" placeholder="Unit Cost (MWK)" value={formData.unit_cost} onChange={e => setFormData({...formData, unit_cost: e.target.value})} required />
          <button type="submit" className="btn btn-action-primary">Add Item</button>
        </form>
      </div>
    );
  }

  if (selectedItem) {
    return (
      <div className="glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <button className="btn btn-text" onClick={() => setSelectedItem(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <IconArrowLeft size={16} /> Back to Inventory
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-action" onClick={handleUpdateStatus}><IconEdit size={16} /> Check Status</button>
            <button className="btn btn-action" onClick={handleDelete} style={{ color: '#e11d48', borderColor: '#e11d48' }}>
              <IconTrash size={16} /> Delete
            </button>
          </div>
        </div>
        <div>
          <h2>{selectedItem.code}: {selectedItem.desc}</h2>
          <p>Category: {selectedItem.category}</p>
          <p>In Stock: {selectedItem.inStock}</p>
          <p>Reorder Level: {selectedItem.reorder}</p>
          <p>Unit Cost: {selectedItem.unitCost}</p>
          <StatusPill status={selectedItem.status} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="metrics metrics-3">
        <MetricCard label="Total Items" value={(inventory || []).length.toString()} badgeText="Loaded from database" badgeClass="badge-info" />
        <MetricCard label="Low Stock Alerts" value={(inventory || []).filter(i => i.status === 'Low Stock' || i.status === 'Critical').length.toString()} badgeText="Reorder needed" badgeClass="badge-warn" />
        <MetricCard label="Stock Value" value="MK 42.3M" badgeText="Updated today" badgeClass="badge-success" />
      </div>
      <div className="section">
        <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
          <span className="section-title">Inventory Items</span>
          <button className="btn btn-action-primary" onClick={() => setIsAdding(true)}><IconPlus size={16} /> Add Item</button>
        </div>
        <div className="table-scroll">
          <table className="modern-table">
          <thead>
            <tr>
              <th>Item Code</th><th>Description</th><th>Category</th>
              <th>In Stock</th><th>Reorder Level</th><th>Unit Cost (MWK)</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(inventory || []).map(item => (
              <tr key={item.code} onClick={() => setSelectedItem(item)} style={{ cursor: 'pointer' }}>
                <td style={{ fontWeight: 500 }}>{item.code}</td>
                <td>{item.desc}</td>
                <td>{item.category}</td>
                <td style={{ fontWeight: 500 }}>{item.inStock}</td>
                <td>{item.reorder}</td>
                <td>{item.unitCost}</td>
                <td><StatusPill status={item.status} /></td>
              </tr>
            ))}
            {(inventory || []).length === 0 && (
              <tr><td colSpan="7" className="empty">No inventory items found.</td></tr>
            )}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
