import React, { useState, useContext } from 'react';
import { StatusPill } from '../components/StatusPill';
import { IconArrowLeft, IconBox, IconCheck, IconTruckReturn } from '@tabler/icons-react';
import { RoleContext } from '../App';
import { canPerform } from '../lib/rbac';

export function GoodsReceipts({ receipts, orders }) {
  const { currentRole } = useContext(RoleContext);
  const [selectedGRN, setSelectedGRN] = useState(null);
  const [view, setView] = useState('list'); // list, create
  const [newGRN, setNewGRN] = useState({ poId: '', receivedBy: '', itemsReceived: '', condition: 'Good' });

  const handleCreate = (e) => {
    e.preventDefault();
    alert('GRN Created successfully');
    setView('list');
  };

  if (view === 'create') {
    return (
      <div className="glass-panel">
        <button className="btn btn-text" onClick={() => setView('list')} style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <IconArrowLeft size={16} /> Back to Goods Receipts
        </button>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '1.5rem' }}>Create Goods Received Note (GRN)</h2>
        <form onSubmit={handleCreate} style={{ maxWidth: '600px' }}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Purchase Order Reference</label>
            <select className="form-input" required value={newGRN.poId} onChange={e => setNewGRN({...newGRN, poId: e.target.value})}>
              <option value="">Select PO...</option>
              {(orders || []).filter(o => o.status !== 'Closed').map(o => (
                <option key={o.id} value={o.id}>{o.id} - {o.supplier}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Received By</label>
            <input className="form-input" required placeholder="Name of receiving officer" value={newGRN.receivedBy} onChange={e => setNewGRN({...newGRN, receivedBy: e.target.value})} />
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Items Received (Quantities & Descriptions)</label>
            <textarea className="form-input" required rows="4" placeholder="List items and quantities received..." value={newGRN.itemsReceived} onChange={e => setNewGRN({...newGRN, itemsReceived: e.target.value})}></textarea>
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Condition</label>
            <select className="form-input" value={newGRN.condition} onChange={e => setNewGRN({...newGRN, condition: e.target.value})}>
              <option value="Good">Good - No Damage</option>
              <option value="Damaged">Damaged / Poor</option>
              <option value="Partial">Partial Delivery</option>
            </select>
          </div>
          <div className="flex-wrap-gap">
            <button type="submit" className="btn btn-action-primary"><IconCheck size={18} /> Confirm Receipt</button>
            <button type="button" className="btn btn-action" onClick={() => setView('list')}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  if (selectedGRN) {
    return (
      <div className="grn-details">
        <button className="btn btn-text" onClick={() => setSelectedGRN(null)} style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <IconArrowLeft size={16} /> Back to Goods Receipts
        </button>
        
        <div className="glass-panel">
          <div className="flex-between" style={{ borderBottom: '1px solid var(--color-border-tertiary)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{selectedGRN.id}</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>Linked PO: <span className="font-medium text-primary">{selectedGRN.poId}</span></p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <StatusPill status={selectedGRN.status} />
              <p style={{ color: 'var(--color-text-tertiary)', marginTop: '8px', fontSize: '12px' }}>Date: {selectedGRN.receivedDate}</p>
            </div>
          </div>

          <div className="two-col">
            <div>
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '8px' }}>Delivery Information</h4>
              <p style={{ fontSize: '13px', marginBottom: '8px' }}><strong>Received By:</strong> {selectedGRN.receivedBy}</p>
              <p style={{ fontSize: '13px', marginBottom: '8px' }}><strong>Condition:</strong> {selectedGRN.condition}</p>
              
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginTop: '1.5rem', marginBottom: '8px' }}>Items Received</h4>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', background: 'var(--color-background-secondary)', padding: '1rem', borderRadius: '8px' }}>
                {selectedGRN.itemsReceived}
              </p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>Actions</h4>
              
              {selectedGRN.condition !== 'Good' && canPerform(currentRole, 'RETURN_GRN') && (
                <button className="btn" style={{ width: '100%', justifyContent: 'center', background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA' }}>
                  <IconTruckReturn size={18} /> Initiate Return to Supplier
                </button>
              )}
              
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#F8FAFC', borderRadius: '8px', fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                <strong>Note:</strong> This GRN is ready for 3-way matching in the AP (Invoices) module.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel">
      <div className="section-header" style={{ padding: '0 0 1.25rem 0', borderBottom: 'none' }}>
        <span className="section-title">Goods Received Notes (GRN)</span>
        {canPerform(currentRole, 'CREATE_GRN') && (
          <button className="btn btn-action-primary" onClick={() => setView('create')}>
            <IconBox size={16} /> Enter New GRN
          </button>
        )}
      </div>
      <div className="table-scroll">
        <table className="modern-table">
        <thead>
          <tr>
            <th>GRN Ref</th><th>PO Ref</th><th>Received Date</th>
            <th>Received By</th><th>Condition</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {(receipts || []).map(r => (
            <tr key={r.id} onClick={() => setSelectedGRN(r)} style={{ cursor: 'pointer' }}>
              <td style={{ color: '#185FA5', fontWeight: 500 }}>{r.id}</td>
              <td className="font-medium">{r.poId}</td>
              <td>{r.receivedDate}</td>
              <td>{r.receivedBy}</td>
              <td>
                <span style={{ 
                  color: r.condition === 'Good' ? '#1D9E75' : '#D97706',
                  background: r.condition === 'Good' ? '#EAF3DE' : '#FEF3C7',
                  padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 500
                }}>
                  {r.condition}
                </span>
              </td>
              <td><StatusPill status={r.status} /></td>
            </tr>
          ))}
          {(receipts || []).length === 0 && (
            <tr><td colSpan="6" className="empty" style={{ background: '#fff' }}>No goods receipts found.</td></tr>
          )}
        </tbody>
        </table>
      </div>
    </div>
  );
}
