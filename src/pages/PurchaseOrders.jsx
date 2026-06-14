import React, { useState, useContext } from 'react';
import { StatusPill } from '../components/StatusPill';
import { IconArrowLeft, IconSend, IconEdit, IconPrinter, IconFileText } from '@tabler/icons-react';
import { RoleContext } from '../App';
import { canPerform } from '../lib/rbac';

export function PurchaseOrders({ orders }) {
  const { currentRole } = useContext(RoleContext);
  const [selectedPO, setSelectedPO] = useState(null);
  const [localOrders, setLocalOrders] = useState(orders);

  // Sync with props
  React.useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  const handleDispatch = () => {
    // Simulate dispatch
    const updated = localOrders.map(o => 
      o.id === selectedPO.id ? { ...o, dispatchStatus: 'Dispatched', status: 'Dispatched' } : o
    );
    setLocalOrders(updated);
    setSelectedPO({ ...selectedPO, dispatchStatus: 'Dispatched', status: 'Dispatched' });
  };

  const handleRevise = () => {
    // Simulate revision
    const count = (selectedPO.amendmentCount || 0) + 1;
    const updated = localOrders.map(o => 
      o.id === selectedPO.id ? { ...o, amendmentCount: count } : o
    );
    setLocalOrders(updated);
    setSelectedPO({ ...selectedPO, amendmentCount: count });
  };

  if (selectedPO) {
    return (
      <div className="po-details">
        <button className="btn btn-text" onClick={() => setSelectedPO(null)} style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <IconArrowLeft size={16} /> Back to Orders
        </button>
        
        <div className="glass-panel">
          <div className="flex-between" style={{ borderBottom: '1px solid var(--color-border-tertiary)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{selectedPO.id}</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>Supplier: <span className="font-medium text-primary">{selectedPO.supplier}</span></p>
              {selectedPO.contractId && (
                <p style={{ color: 'var(--color-text-tertiary)', marginTop: '4px', fontSize: '12px' }}>Contract Ref: {selectedPO.contractId}</p>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#185FA5' }}>{selectedPO.value}</div>
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <StatusPill status={selectedPO.status} />
                {selectedPO.dispatchStatus === 'Dispatched' && <StatusPill status="Dispatched" />}
              </div>
            </div>
          </div>

          <div className="two-col">
            <div>
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '8px' }}>Order Details</h4>
              <p style={{ fontSize: '13px', marginBottom: '8px' }}><strong>Items:</strong> {selectedPO.items}</p>
              <p style={{ fontSize: '13px', marginBottom: '8px' }}><strong>Issue Date:</strong> {selectedPO.issueDate}</p>
              <p style={{ fontSize: '13px', marginBottom: '8px' }}><strong>Expected Delivery:</strong> {selectedPO.expectedDelivery}</p>
              
              <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--color-background-secondary)', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><IconFileText size={16} /> Amendments & Revisions</h4>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  This Purchase Order has been amended <strong>{selectedPO.amendmentCount || 0}</strong> times.
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>Actions</h4>
              
              {canPerform(currentRole, 'DISPATCH_PO') ? (
                <button 
                  className="btn btn-action-primary" 
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={handleDispatch}
                  disabled={selectedPO.dispatchStatus === 'Dispatched'}
                >
                  <IconSend size={18} /> {selectedPO.dispatchStatus === 'Dispatched' ? 'Already Dispatched' : 'Dispatch to Supplier'}
                </button>
              ) : (
                <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', padding: '0.75rem', background: 'var(--color-background-secondary)', borderRadius: '8px', textAlign: 'center' }}>
                  Only Procurement Officers can dispatch POs
                </div>
              )}
              
              {canPerform(currentRole, 'REVISE_PO') ? (
                <button className="btn btn-action" style={{ width: '100%', justifyContent: 'center' }} onClick={handleRevise}>
                  <IconEdit size={18} /> Revise / Amend PO
                </button>
              ) : (
                <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', padding: '0.75rem', background: 'var(--color-background-secondary)', borderRadius: '8px', textAlign: 'center' }}>
                  Only Procurement Managers can revise POs
                </div>
              )}
              
              <button className="btn btn-text" style={{ width: '100%', justifyContent: 'center' }}>
                <IconPrinter size={18} /> Print PO Document
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel">
      <div className="section-header" style={{ padding: '0 0 1.25rem 0', borderBottom: 'none' }}>
        <span className="section-title">Purchase Orders</span>
      </div>
      <div className="table-scroll">
        <table className="modern-table">
        <thead>
          <tr>
            <th>PO Number</th><th>Supplier</th><th>Items</th>
            <th>Issue Date</th><th>Expected Delivery</th><th>Value (MWK)</th><th>Status</th><th>Dispatch</th>
          </tr>
        </thead>
        <tbody>
          {(localOrders || []).map(o => (
            <tr key={o.id} onClick={() => setSelectedPO(o)} style={{ cursor: 'pointer' }}>
              <td style={{ color: '#185FA5', fontWeight: 500 }}>{o.id}</td>
              <td className="font-medium">{o.supplier}</td>
              <td>{o.items}</td>
              <td>{o.issueDate}</td>
              <td>{o.expectedDelivery}</td>
              <td className="font-medium">{o.value}</td>
              <td><StatusPill status={o.status} /></td>
              <td>
                <span style={{ fontSize: '11px', color: o.dispatchStatus === 'Dispatched' ? '#1D9E75' : 'var(--color-text-tertiary)' }}>
                  {o.dispatchStatus || 'Not Dispatched'}
                </span>
              </td>
            </tr>
          ))}
          {(localOrders || []).length === 0 && (
            <tr><td colSpan="8" className="empty" style={{ background: '#fff' }}>No purchase orders found.</td></tr>
          )}
        </tbody>
        </table>
      </div>
    </div>
  );
}
