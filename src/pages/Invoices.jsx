import React, { useState, useContext } from 'react';
import { StatusPill } from '../components/StatusPill';
import { IconArrowLeft, IconFileInvoice, IconUpload, IconCheck, IconAlertCircle, IconCalendarEvent, IconTrash, IconEdit } from '@tabler/icons-react';
import { RoleContext } from '../App';
import { canPerform } from '../lib/rbac';
import { createInvoice, updateInvoice, deleteInvoice } from '../lib/supabaseClient';

export function Invoices({ invoices, refresh, setToastMsg }) {
  const { currentRole } = useContext(RoleContext);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [view, setView] = useState('list'); // list, create, edit
  const [newInvoice, setNewInvoice] = useState({
    supplierId: '', poId: '', grnId: '', amount: '',
    issueDate: '', dueDate: '', matchStatus: 'Pending'
  });
  const [editInvoice, setEditInvoice] = useState(null);
  const [saving, setSaving] = useState(false);

  // ── CREATE ─────────────────────────────────────────────────
  const handleCapture = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const newId = `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`;
      await createInvoice({
        id: newId,
        supplier_id: newInvoice.supplierId,
        po_id: newInvoice.poId,
        grn_id: newInvoice.grnId,
        amount: newInvoice.amount,
        issue_date: newInvoice.issueDate,
        due_date: newInvoice.dueDate,
        document_url: null,
        status: 'Pending',
        match_status: newInvoice.matchStatus
      });
      await refresh.invoices();
      setToastMsg('Invoice captured and queued for matching');
      setView('list');
      setNewInvoice({ supplierId: '', poId: '', grnId: '', amount: '', issueDate: '', dueDate: '', matchStatus: 'Pending' });
    } catch (err) {
      setToastMsg('Error capturing invoice');
    }
    setSaving(false);
  };

  // ── UPDATE STATUS ──────────────────────────────────────────
  const handleMatch = async () => {
    setSaving(true);
    try {
      await updateInvoice(selectedInvoice.id, { match_status: 'Matched' });
      await refresh.invoices();
      setToastMsg('Invoice matched successfully');
      setSelectedInvoice({ ...selectedInvoice, matchStatus: 'Matched' });
    } catch (err) {
      setToastMsg('Error matching invoice');
    }
    setSaving(false);
  };

  const handleSchedulePayment = async () => {
    setSaving(true);
    try {
      await updateInvoice(selectedInvoice.id, { status: 'Scheduled' });
      await refresh.invoices();
      setToastMsg('Payment scheduled');
      setSelectedInvoice({ ...selectedInvoice, status: 'Scheduled' });
    } catch (err) {
      setToastMsg('Error scheduling payment');
    }
    setSaving(false);
  };

  const handleMarkPaid = async () => {
    setSaving(true);
    try {
      await updateInvoice(selectedInvoice.id, { status: 'Paid' });
      await refresh.invoices();
      setToastMsg('Invoice marked as Paid');
      setSelectedInvoice({ ...selectedInvoice, status: 'Paid' });
    } catch (err) {
      setToastMsg('Error updating invoice');
    }
    setSaving(false);
  };

  // ── EDIT ───────────────────────────────────────────────────
  const handleEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateInvoice(editInvoice.id, {
        supplier_id: editInvoice.supplierId,
        po_id: editInvoice.poId,
        grn_id: editInvoice.grnId,
        amount: editInvoice.amount,
        status: editInvoice.status,
        match_status: editInvoice.matchStatus
      });
      await refresh.invoices();
      setToastMsg('Invoice updated successfully');
      setEditInvoice(null);
      setSelectedInvoice(null);
      setView('list');
    } catch (err) {
      setToastMsg('Error updating invoice');
    }
    setSaving(false);
  };

  // ── DELETE ─────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to archive this invoice? It will be soft-deleted and excluded from active views.')) return;
    setSaving(true);
    try {
      await deleteInvoice(selectedInvoice.id);
      await refresh.invoices();
      setToastMsg('Invoice archived (soft-deleted)');
      setSelectedInvoice(null);
    } catch (err) {
      setToastMsg('Error deleting invoice');
    }
    setSaving(false);
  };

  // ── EDIT FORM ──────────────────────────────────────────────
  if (view === 'edit' && editInvoice) {
    return (
      <div className="glass-panel">
        <button className="btn btn-text" onClick={() => { setView('list'); setEditInvoice(null); setSelectedInvoice(null); }}
          style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <IconArrowLeft size={16} /> Back to Invoices
        </button>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '1.5rem' }}>Edit Invoice: {editInvoice.id}</h2>
        <form onSubmit={handleEdit} style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Supplier ID</label>
            <input className="form-input" required value={editInvoice.supplierId}
              onChange={e => setEditInvoice({...editInvoice, supplierId: e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">PO Reference</label>
              <input className="form-input" required value={editInvoice.poId}
                onChange={e => setEditInvoice({...editInvoice, poId: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">GRN Reference</label>
              <input className="form-input" value={editInvoice.grnId}
                onChange={e => setEditInvoice({...editInvoice, grnId: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Invoice Amount (MWK)</label>
            <input className="form-input" required value={editInvoice.amount}
              onChange={e => setEditInvoice({...editInvoice, amount: e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-input" value={editInvoice.status}
                onChange={e => setEditInvoice({...editInvoice, status: e.target.value})}>
                <option value="Pending">Pending</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Paid">Paid</option>
                <option value="Disputed">Disputed</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Match Status</label>
              <select className="form-input" value={editInvoice.matchStatus}
                onChange={e => setEditInvoice({...editInvoice, matchStatus: e.target.value})}>
                <option value="Pending">Pending</option>
                <option value="Matched">Matched</option>
                <option value="Exception">Exception</option>
              </select>
            </div>
          </div>
          <div className="flex-wrap-gap">
            <button type="submit" className="btn btn-action-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" className="btn btn-action"
              onClick={() => { setView('list'); setEditInvoice(null); setSelectedInvoice(null); }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ── CAPTURE FORM ───────────────────────────────────────────
  if (view === 'create') {
    return (
      <div className="glass-panel">
        <button className="btn btn-text" onClick={() => setView('list')}
          style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <IconArrowLeft size={16} /> Back to Invoices
        </button>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '1.5rem' }}>Capture New Invoice</h2>
        <form onSubmit={handleCapture} style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Supplier ID</label>
            <input className="form-input" required placeholder="e.g. SUP-02"
              value={newInvoice.supplierId} onChange={e => setNewInvoice({...newInvoice, supplierId: e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Purchase Order (PO) Ref</label>
              <input className="form-input" required placeholder="e.g. PO-2025-016"
                value={newInvoice.poId} onChange={e => setNewInvoice({...newInvoice, poId: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Goods Receipt (GRN) Ref</label>
              <input className="form-input" placeholder="e.g. GRN-2025-101"
                value={newInvoice.grnId} onChange={e => setNewInvoice({...newInvoice, grnId: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Invoice Amount (MWK)</label>
            <input className="form-input" required placeholder="0.00"
              value={newInvoice.amount} onChange={e => setNewInvoice({...newInvoice, amount: e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Issue Date</label>
              <input type="date" className="form-input" required
                value={newInvoice.issueDate} onChange={e => setNewInvoice({...newInvoice, issueDate: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input type="date" className="form-input" required
                value={newInvoice.dueDate} onChange={e => setNewInvoice({...newInvoice, dueDate: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Upload Invoice Document (PDF/Image)</label>
            <div style={{ border: '1px dashed var(--color-border-secondary)', padding: '2rem', textAlign: 'center', borderRadius: '8px', cursor: 'pointer', background: 'var(--color-background-secondary)' }}>
              <IconUpload size={24} style={{ color: 'var(--color-text-tertiary)', marginBottom: '8px' }} />
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                Click to upload or drag and drop<br/>
                <span style={{ fontSize: '11px' }}>(File upload not yet enabled — URL will be stored when configured)</span>
              </p>
            </div>
          </div>
          <div className="flex-wrap-gap">
            <button type="submit" className="btn btn-action-primary" disabled={saving}>
              <IconFileInvoice size={18} /> {saving ? 'Capturing...' : 'Capture Invoice'}
            </button>
            <button type="button" className="btn btn-action" onClick={() => setView('list')}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  // ── DETAIL VIEW ────────────────────────────────────────────
  if (selectedInvoice) {
    return (
      <div className="invoice-details">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <button className="btn btn-text" onClick={() => setSelectedInvoice(null)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <IconArrowLeft size={16} /> Back to Invoices
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            {canPerform(currentRole, 'CAPTURE_INVOICE') && (
              <button className="btn btn-action"
                onClick={() => { setEditInvoice({...selectedInvoice}); setView('edit'); }}>
                <IconEdit size={16} /> Edit
              </button>
            )}
            {canPerform(currentRole, 'CAPTURE_INVOICE') && (
              <button className="btn btn-action" onClick={handleDelete}
                style={{ color: '#e11d48', borderColor: '#e11d48' }} disabled={saving}>
                <IconTrash size={16} /> Archive
              </button>
            )}
          </div>
        </div>
        
        <div className="glass-panel">
          <div className="flex-between" style={{ borderBottom: '1px solid var(--color-border-tertiary)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{selectedInvoice.id}</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                Supplier: <span className="font-medium text-primary">{selectedInvoice.supplierId}</span>
              </p>
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
                  <div style={{ flex: 1, fontSize: '13px', color: '#185FA5', fontWeight: 500 }}>{selectedInvoice.grnId || '—'}</div>
                  <div style={{ width: '100px', textAlign: 'center' }}>{selectedInvoice.grnId ? <IconCheck size={18} color="#1D9E75" /> : <span style={{ fontSize: '11px', color: '#D97706' }}>Pending</span>}</div>
                </div>
                <div style={{ display: 'flex', padding: '12px', background: selectedInvoice.matchStatus === 'Matched' ? '#F0FDF4' : '#FEF2F2', alignItems: 'center' }}>
                  <div style={{ flex: 1, fontSize: '13px', fontWeight: 500 }}>Invoice Match Result</div>
                  <div style={{ flex: 1, fontSize: '13px' }}>{selectedInvoice.matchStatus === 'Matched' ? 'Amounts Match' : 'Discrepancy Found'}</div>
                  <div style={{ width: '100px', textAlign: 'center' }}>
                    {selectedInvoice.matchStatus === 'Matched'
                      ? <span style={{ color: '#1D9E75', fontWeight: 600, fontSize: '12px' }}>PASSED</span>
                      : <span style={{ color: '#991B1B', fontWeight: 600, fontSize: '12px' }}>EXCEPTION</span>}
                  </div>
                </div>
              </div>

              {selectedInvoice.matchStatus !== 'Matched' && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', display: 'flex', gap: '12px' }}>
                  <IconAlertCircle color="#991B1B" />
                  <div>
                    <h5 style={{ margin: '0 0 4px 0', color: '#991B1B', fontSize: '13px' }}>Exception Handling Required</h5>
                    <p style={{ fontSize: '12px', color: '#B91C1C' }}>The invoiced amount may differ from the GRN value. Please review and manually approve or request a credit note.</p>
                  </div>
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>Actions</h4>

              {/* Invoice details */}
              <div style={{ padding: '1rem', background: 'var(--color-background-secondary)', borderRadius: '8px', fontSize: '13px' }}>
                <p style={{ marginBottom: '6px' }}><strong>Issue Date:</strong> {selectedInvoice.issueDate}</p>
                <p><strong>Due Date:</strong> {selectedInvoice.dueDate}</p>
              </div>
              
              {selectedInvoice.matchStatus !== 'Matched' && canPerform(currentRole, 'MATCH_INVOICE') && (
                <button className="btn btn-action-primary" style={{ width: '100%', justifyContent: 'center' }}
                  onClick={handleMatch} disabled={saving}>
                  <IconCheck size={18} /> Resolve Exception & Force Match
                </button>
              )}
              
              {canPerform(currentRole, 'SCHEDULE_PAYMENT') && (
                <button className="btn btn-action"
                  style={{ width: '100%', justifyContent: 'center', background: '#fff' }}
                  onClick={handleSchedulePayment}
                  disabled={saving || selectedInvoice.matchStatus !== 'Matched' || ['Paid','Scheduled'].includes(selectedInvoice.status)}>
                  <IconCalendarEvent size={18} />
                  {selectedInvoice.status === 'Scheduled' ? 'Payment Scheduled' : 'Schedule Payment'}
                </button>
              )}

              {canPerform(currentRole, 'SCHEDULE_PAYMENT') && selectedInvoice.status === 'Scheduled' && (
                <button className="btn btn-action-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={handleMarkPaid} disabled={saving}>
                  <IconCheck size={18} /> Mark as Paid
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

  // ── LIST VIEW ──────────────────────────────────────────────
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
          {(invoices || []).map(i => (
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
          {(invoices || []).length === 0 && (
            <tr><td colSpan="9" className="empty" style={{ background: '#fff' }}>No invoices found.</td></tr>
          )}
        </tbody>
        </table>
      </div>
    </div>
  );
}
