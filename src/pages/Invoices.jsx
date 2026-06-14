import React, { useState, useContext, useEffect } from 'react';
import { StatusPill } from '../components/StatusPill';
import { IconArrowLeft, IconFileInvoice, IconUpload, IconCheck, IconAlertCircle, IconCalendarEvent } from '@tabler/icons-react';
import { RoleContext } from '../App';
import { canPerform } from '../lib/rbac';

export function Invoices({ invoices }) {
  const { currentRole } = useContext(RoleContext);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [view, setView] = useState('list'); // list, create
  const [newInvoice, setNewInvoice] = useState({ supplierId: '', poId: '', grnId: '', amount: '', document_url: '' });
  const [localInvoices, setLocalInvoices] = useState(invoices);

  useEffect(() => {
    setLocalInvoices(invoices);
  }, [invoices]);

  const handleCapture = (e) => {
    e.preventDefault();
    alert('Invoice captured and queued for matching.');
    setView('list');
  };

  const handleMatch = () => {
    const updated = localInvoices.map(i => 
      i.id === selectedInvoice.id ? { ...i, matchStatus: 'Matched' } : i
    );
    setLocalInvoices(updated);
    setSelectedInvoice({ ...selectedInvoice, matchStatus: 'Matched' });
  };

  const handleSchedulePayment = () => {
    const updated = localInvoices.map(i => 
      i.id === selectedInvoice.id ? { ...i, status: 'Scheduled' } : i
    );
    setLocalInvoices(updated);
    setSelectedInvoice({ ...selectedInvoice, status: 'Scheduled' });
  };

  if (view === 'create') {
    return (
      <div className="glass-panel">
        <button className="btn btn-text" onClick={() => setView('list')} style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <IconArrowLeft size={16} /> Back to Invoices
        </button>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '1.5rem' }}>Capture New Invoice</h2>
        <form onSubmit={handleCapture} style={{ maxWidth: '600px' }}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Supplier ID</label>
            <input className="form-input" required placeholder="e.g. SUP-02" value={newInvoice.supplierId} onChange={e => setNewInvoice({...newInvoice, supplierId: e.target.value})} />
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Purchase Order (PO) Ref</label>
            <input className="form-input" required placeholder="e.g. PO-2025-016" value={newInvoice.poId} onChange={e => setNewInvoice({...newInvoice, poId: e.target.value})} />
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Goods Receipt (GRN) Ref</label>
            <input className="form-input" required placeholder="e.g. GRN-2025-101" value={newInvoice.grnId} onChange={e => setNewInvoice({...newInvoice, grnId: e.target.value})} />
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Invoice Amount (MWK)</label>
            <input className="form-input" required placeholder="0.00" value={newInvoice.amount} onChange={e => setNewInvoice({...newInvoice, amount: e.target.value})} />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Upload Invoice Document (PDF/Image)</label>
            <div style={{ border: '1px dashed var(--color-border-secondary)', padding: '2rem', textAlign: 'center', borderRadius: '8px', cursor: 'pointer', background: 'var(--color-background-secondary)' }}>
              <IconUpload size={24} style={{ color: 'var(--color-text-tertiary)', marginBottom: '8px' }} />
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Click to upload or drag and drop<br/><span style={{ fontSize: '11px' }}>(Simulated upload - document_url placeholder)</span></p>
            </div>
          </div>
          <div className="flex-wrap-gap">
            <button type="submit" className="btn btn-action-primary"><IconFileInvoice size={18} /> Capture Invoice</button>
            <button type="button" className="btn btn-action" onClick={() => setView('list')}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  if (selectedInvoice) {
    return (
      <div className="invoice-details">
        <button className="btn btn-text" onClick={() => setSelectedInvoice(null)} style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <IconArrowLeft size={16} /> Back to Invoices
        </button>
        
        <div className="glass-panel">
          <div className="flex-between" style={{ borderBottom: '1px solid var(--color-border-tertiary)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{selectedInvoice.id}</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>Supplier: <span className="font-medium text-primary">{selectedInvoice.supplierId}</span></p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#185FA5' }}>{selectedInvoice.amount}</div>
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <StatusPill status={selectedInvoice.status} />
              </div>
            </div>
          </div>

          <div className="two-col">
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '1rem' }}>3-Way Matching Interface</h4>
              
              <div style={{ border: '1px solid var(--color-border-tertiary)', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', padding: '12px', background: '#F8FAFC', borderBottom: '1px solid var(--color-border-tertiary)' }}>
                  <div style={{ flex: 1, fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Document</div>
                  <div style={{ flex: 1, fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Ref</div>
                  <div style={{ width: '100px', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', textAlign: 'center' }}>Status</div>
                </div>
                <div style={{ display: 'flex', padding: '12px', borderBottom: '1px solid var(--color-border-tertiary)', alignItems: 'center' }}>
                  <div style={{ flex: 1, fontSize: '13px' }}>Purchase Order</div>
                  <div style={{ flex: 1, fontSize: '13px', color: '#185FA5', fontWeight: 500 }}>{selectedInvoice.poId}</div>
                  <div style={{ width: '100px', textAlign: 'center' }}><IconCheck size={18} color="#1D9E75" /></div>
                </div>
                <div style={{ display: 'flex', padding: '12px', borderBottom: '1px solid var(--color-border-tertiary)', alignItems: 'center' }}>
                  <div style={{ flex: 1, fontSize: '13px' }}>Goods Receipt</div>
                  <div style={{ flex: 1, fontSize: '13px', color: '#185FA5', fontWeight: 500 }}>{selectedInvoice.grnId}</div>
                  <div style={{ width: '100px', textAlign: 'center' }}><IconCheck size={18} color="#1D9E75" /></div>
                </div>
                <div style={{ display: 'flex', padding: '12px', background: selectedInvoice.matchStatus === 'Matched' ? '#F0FDF4' : '#FEF2F2', alignItems: 'center' }}>
                  <div style={{ flex: 1, fontSize: '13px', fontWeight: 500 }}>Invoice Match Result</div>
                  <div style={{ flex: 1, fontSize: '13px' }}>{selectedInvoice.matchStatus === 'Matched' ? 'Amounts Match' : 'Discrepancy Found'}</div>
                  <div style={{ width: '100px', textAlign: 'center' }}>
                    {selectedInvoice.matchStatus === 'Matched' ? 
                      <span style={{ color: '#1D9E75', fontWeight: 600, fontSize: '12px' }}>PASSED</span> : 
                      <span style={{ color: '#991B1B', fontWeight: 600, fontSize: '12px' }}>EXCEPTION</span>}
                  </div>
                </div>
              </div>

              {selectedInvoice.matchStatus !== 'Matched' && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', display: 'flex', gap: '12px' }}>
                  <IconAlertCircle color="#991B1B" />
                  <div>
                    <h5 style={{ margin: '0 0 4px 0', color: '#991B1B', fontSize: '13px' }}>Exception Handling Required</h5>
                    <p style={{ fontSize: '12px', color: '#B91C1C' }}>The invoiced amount exceeds the GRN value. Please review and manually approve or request a credit note.</p>
                  </div>
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>Actions</h4>
              
              {selectedInvoice.matchStatus !== 'Matched' && canPerform(currentRole, 'MATCH_INVOICE') && (
                <button className="btn btn-action-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleMatch}>
                  <IconCheck size={18} /> Resolve Exception & Force Match
                </button>
              )}
              
              {canPerform(currentRole, 'SCHEDULE_PAYMENT') && (
                <button 
                  className="btn btn-action" 
                  style={{ width: '100%', justifyContent: 'center', background: '#fff' }}
                  onClick={handleSchedulePayment}
                  disabled={selectedInvoice.matchStatus !== 'Matched' || selectedInvoice.status === 'Paid' || selectedInvoice.status === 'Scheduled'}
                >
                  <IconCalendarEvent size={18} /> 
                  {selectedInvoice.status === 'Scheduled' ? 'Payment Scheduled' : 'Schedule Payment'}
                </button>
              )}
              
              <button className="btn btn-text" style={{ width: '100%', justifyContent: 'center' }}>
                View Original Document
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
        <span className="section-title">Accounts Payable (Invoices)</span>
        {canPerform(currentRole, 'CAPTURE_INVOICE') && (
          <button className="btn btn-action-primary" onClick={() => setView('create')}>
            <IconUpload size={16} /> Capture Invoice
          </button>
        )}
      </div>
      <div className="table-scroll">
        <table className="modern-table">
        <thead>
          <tr>
            <th>Inv No.</th><th>Supplier ID</th><th>PO Ref</th><th>GRN Ref</th>
            <th>Issue Date</th><th>Due Date</th><th>Amount (MWK)</th><th>Match Status</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {(localInvoices || []).map(i => (
            <tr key={i.id} onClick={() => setSelectedInvoice(i)} style={{ cursor: 'pointer' }}>
              <td style={{ color: '#185FA5', fontWeight: 500 }}>{i.id}</td>
              <td className="font-medium">{i.supplierId}</td>
              <td>{i.poId}</td>
              <td>{i.grnId}</td>
              <td>{i.issueDate}</td>
              <td>{i.dueDate}</td>
              <td className="font-medium">{i.amount}</td>
              <td>
                <span style={{ 
                  color: i.matchStatus === 'Matched' ? '#1D9E75' : '#D97706',
                  fontWeight: 500, fontSize: '12px'
                }}>
                  {i.matchStatus}
                </span>
              </td>
              <td><StatusPill status={i.status} /></td>
            </tr>
          ))}
          {(localInvoices || []).length === 0 && (
            <tr><td colSpan="9" className="empty" style={{ background: '#fff' }}>No invoices found.</td></tr>
          )}
        </tbody>
        </table>
      </div>
    </div>
  );
}
