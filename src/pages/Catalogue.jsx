import React, { useState, useContext } from 'react';
import { StatusPill } from '../components/StatusPill';
import { IconArrowLeft, IconBook, IconPlus, IconShoppingCart, IconBuildingStore, IconTrash, IconEdit } from '@tabler/icons-react';
import { RoleContext } from '../App';
import { canPerform } from '../lib/rbac';
import { createCatalogueItem, updateCatalogueItem, deleteCatalogueItem } from '../lib/supabaseClient';

export function Catalogue({ catalogue, refresh, setToastMsg }) {
  const { currentRole } = useContext(RoleContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const [view, setView] = useState('list'); // list, create, edit
  const [newItem, setNewItem] = useState({ name: '', category: '', supplierId: '', unitPrice: '', pricingTier: 'Standard', status: 'Active' });
  const [editItem, setEditItem] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const newId = `CAT-${Date.now().toString().slice(-3)}`;
      await createCatalogueItem({
        id: newId,
        name: newItem.name,
        category: newItem.category,
        supplier_id: newItem.supplierId,
        unit_price: newItem.unitPrice,
        pricing_tier: newItem.pricingTier,
        status: newItem.status
      });
      await refresh.catalogue();
      setToastMsg('Catalogue item added successfully');
      setView('list');
      setNewItem({ name: '', category: '', supplierId: '', unitPrice: '', pricingTier: 'Standard', status: 'Active' });
    } catch (err) {
      setToastMsg('Error adding catalogue item');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await updateCatalogueItem(editItem.id, {
        name: editItem.name,
        category: editItem.category,
        supplier_id: editItem.supplierId,
        unit_price: editItem.unitPrice,
        pricing_tier: editItem.pricingTier,
        status: editItem.status
      });
      await refresh.catalogue();
      setToastMsg('Catalogue item updated successfully');
      setEditItem(null);
      setView('list');
    } catch (err) {
      setToastMsg('Error updating catalogue item');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this catalogue item?')) return;
    try {
      await deleteCatalogueItem(selectedItem.id);
      await refresh.catalogue();
      setToastMsg('Catalogue item deleted');
      setSelectedItem(null);
    } catch (err) {
      setToastMsg('Error deleting catalogue item');
    }
  };

  // ── EDIT FORM ──────────────────────────────────────────────
  if (view === 'edit' && editItem) {
    return (
      <div className="glass-panel">
        <button className="btn btn-text" onClick={() => { setView('list'); setEditItem(null); setSelectedItem(null); }} style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <IconArrowLeft size={16} /> Back to Catalogue
        </button>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '1.5rem' }}>Edit Catalogue Item</h2>
        <form onSubmit={handleEdit} style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Item Name</label>
            <input className="form-input" required value={editItem.name} onChange={e => setEditItem({...editItem, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" required value={editItem.category} onChange={e => setEditItem({...editItem, category: e.target.value})}>
              <option value="">Select Category...</option>
              <option value="ICT Equipment">ICT Equipment</option>
              <option value="Stationery">Stationery</option>
              <option value="Furniture">Furniture</option>
              <option value="Services">Services</option>
              <option value="Medical">Medical</option>
              <option value="Fuel">Fuel</option>
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Preferred Supplier ID</label>
              <input className="form-input" required value={editItem.supplierId} onChange={e => setEditItem({...editItem, supplierId: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Unit Price (MWK)</label>
              <input className="form-input" required value={editItem.unitPrice} onChange={e => setEditItem({...editItem, unitPrice: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Pricing Tier</label>
            <input className="form-input" value={editItem.pricingTier} onChange={e => setEditItem({...editItem, pricingTier: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-input" value={editItem.status} onChange={e => setEditItem({...editItem, status: e.target.value})}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Discontinued">Discontinued</option>
            </select>
          </div>
          <div className="flex-wrap-gap">
            <button type="submit" className="btn btn-action-primary">Save Changes</button>
            <button type="button" className="btn btn-action" onClick={() => { setView('list'); setEditItem(null); setSelectedItem(null); }}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  // ── CREATE FORM ────────────────────────────────────────────
  if (view === 'create') {
    return (
      <div className="glass-panel">
        <button className="btn btn-text" onClick={() => setView('list')} style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <IconArrowLeft size={16} /> Back to Catalogue
        </button>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '1.5rem' }}>Add Item to Catalogue</h2>
        <form onSubmit={handleCreate} style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Item Name</label>
            <input className="form-input" required placeholder="e.g. Dell Monitor 24''" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" required value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
              <option value="">Select Category...</option>
              <option value="ICT Equipment">ICT Equipment</option>
              <option value="Stationery">Stationery</option>
              <option value="Furniture">Furniture</option>
              <option value="Services">Services</option>
              <option value="Medical">Medical</option>
              <option value="Fuel">Fuel</option>
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Preferred Supplier ID</label>
              <input className="form-input" required placeholder="e.g. SUP-02" value={newItem.supplierId} onChange={e => setNewItem({...newItem, supplierId: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Unit Price (MWK)</label>
              <input className="form-input" required placeholder="0.00" value={newItem.unitPrice} onChange={e => setNewItem({...newItem, unitPrice: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Pricing Tier / Volume Discount</label>
            <input className="form-input" placeholder="e.g. Tier 1 (>10 units: 5% discount)" value={newItem.pricingTier} onChange={e => setNewItem({...newItem, pricingTier: e.target.value})} />
          </div>
          <div className="flex-wrap-gap">
            <button type="submit" className="btn btn-action-primary"><IconPlus size={18} /> Add Item</button>
            <button type="button" className="btn btn-action" onClick={() => setView('list')}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  // ── DETAIL VIEW ────────────────────────────────────────────
  if (selectedItem) {
    return (
      <div className="catalogue-details">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <button className="btn btn-text" onClick={() => setSelectedItem(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <IconArrowLeft size={16} /> Back to Catalogue
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            {canPerform(currentRole, 'ADD_CATALOGUE') && (
              <button className="btn btn-action" onClick={() => { setEditItem({...selectedItem}); setView('edit'); }}>
                <IconEdit size={16} /> Edit
              </button>
            )}
            {canPerform(currentRole, 'ADD_CATALOGUE') && (
              <button className="btn btn-action" onClick={handleDelete} style={{ color: '#e11d48', borderColor: '#e11d48' }}>
                <IconTrash size={16} /> Delete
              </button>
            )}
          </div>
        </div>
        
        <div className="glass-panel">
          <div className="flex-between" style={{ borderBottom: '1px solid var(--color-border-tertiary)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '8px', background: 'var(--color-background-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconBook size={28} color="var(--color-text-tertiary)" />
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{selectedItem.name}</h2>
                <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>{selectedItem.category} | Item Code: {selectedItem.id}</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#1D9E75' }}>{selectedItem.unitPrice}</div>
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <StatusPill status={selectedItem.status} />
              </div>
            </div>
          </div>

          <div className="two-col">
            <div>
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '8px' }}>Pricing & Supplier Information</h4>
              <p style={{ fontSize: '13px', marginBottom: '8px' }}><strong>Base Unit Price:</strong> {selectedItem.unitPrice}</p>
              <p style={{ fontSize: '13px', marginBottom: '8px' }}><strong>Pricing Tier:</strong> {selectedItem.pricingTier}</p>
              
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#F8FAFC', border: '1px solid var(--color-border-secondary)', borderRadius: '8px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <IconBuildingStore color="#185FA5" size={20} />
                <div>
                  <h5 style={{ margin: '0 0 4px 0', color: '#185FA5', fontSize: '13px' }}>Preferred Supplier</h5>
                  <p style={{ fontSize: '13px', fontWeight: 500 }}>{selectedItem.supplierId}</p>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>This item is linked to a negotiated contract with the preferred supplier. Direct purchase orders will automatically route to them.</p>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>Actions</h4>
              
              <button className="btn btn-action-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <IconShoppingCart size={18} /> Add to Requisition
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── LIST VIEW ──────────────────────────────────────────────
  return (
    <div className="glass-panel">
      <div className="section-header" style={{ padding: '0 0 1.25rem 0', borderBottom: 'none' }}>
        <span className="section-title">Item Master Catalogue</span>
        {canPerform(currentRole, 'ADD_CATALOGUE') && (
          <button className="btn btn-action-primary" onClick={() => setView('create')}><IconPlus size={16} /> Add Item</button>
        )}
      </div>
      <div className="table-scroll">
        <table className="modern-table">
        <thead>
          <tr>
            <th>Item Code</th><th>Name</th><th>Category</th>
            <th>Preferred Supplier</th><th>Unit Price (MWK)</th><th>Pricing Tier</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {(catalogue || []).map(c => (
            <tr key={c.id} onClick={() => setSelectedItem(c)} style={{ cursor: 'pointer' }}>
              <td style={{ color: '#185FA5', fontWeight: 500 }}>{c.id}</td>
              <td className="font-medium">{c.name}</td>
              <td>{c.category}</td>
              <td><span style={{ background: '#E6F1FB', color: '#0C447C', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>{c.supplierId}</span></td>
              <td className="font-medium text-success">{c.unitPrice}</td>
              <td style={{ fontSize: '12px' }}>{c.pricingTier}</td>
              <td><StatusPill status={c.status} /></td>
            </tr>
          ))}
          {(catalogue || []).length === 0 && (
            <tr><td colSpan="7" className="empty" style={{ background: '#fff' }}>No items found in catalogue.</td></tr>
          )}
        </tbody>
        </table>
      </div>
    </div>
  );
}
