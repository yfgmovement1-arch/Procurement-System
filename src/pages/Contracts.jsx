import React, { useState, useContext } from 'react';
import { StatusPill } from '../components/StatusPill';
import { IconArrowLeft, IconFileCertificate, IconPlus, IconBell, IconHistory, IconTrash } from '@tabler/icons-react';
import { RoleContext } from '../App';
import { canPerform } from '../lib/rbac';
import { createContract, deleteContract } from '../lib/supabaseClient';

export function Contracts({ contracts, refresh, setToastMsg }) {
  const { currentRole } = useContext(RoleContext);
  const [selectedContract, setSelectedContract] = useState(null);
  const [view, setView] = useState('list'); // list, create
  const [newContract, setNewContract] = useState({ supplierId: '', title: '', value: '', startDate: '', endDate: '', terms: '' });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const newId = `CON-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`;
      await createContract({
        id: newId,
        supplier_id: newContract.supplierId,
        title: newContract.title,
        value: newContract.value,
        start_date: newContract.startDate,
        end_date: newContract.endDate,
        terms: newContract.terms,
        status: 'Active'
      });
      await refresh.contracts();
      setToastMsg('Contract Draft Created successfully');
      setView('list');
      setNewContract({ supplierId: '', title: '', value: '', startDate: '', endDate: '', terms: '' });
    } catch (err) {
      setToastMsg('Error creating contract');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this contract?')) return;
    try {
      await deleteContract(selectedContract.id);
      await refresh.contracts();
      setToastMsg('Contract deleted');
      setSelectedContract(null);
    } catch (err) {
      setToastMsg('Error deleting contract');
    }
  };

  if (view === 'create') {
    return (
      <div className="glass-panel">
        <button className="btn btn-text" onClick={() => setView('list')} style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <IconArrowLeft size={16} /> Back to Contracts
        </button>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '1.5rem' }}>Draft New Contract</h2>
        <form onSubmit={handleCreate} style={{ maxWidth: '600px' }}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Contract Title</label>
            <input className="form-input" required placeholder="e.g. Annual IT Hardware Supply" value={newContract.title} onChange={e => setNewContract({...newContract, title: e.target.value})} />
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Supplier ID</label>
            <input className="form-input" required placeholder="e.g. SUP-02" value={newContract.supplierId} onChange={e => setNewContract({...newContract, supplierId: e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input type="date" className="form-input" required value={newContract.startDate} onChange={e => setNewContract({...newContract, startDate: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input type="date" className="form-input" required value={newContract.endDate} onChange={e => setNewContract({...newContract, endDate: e.target.value})} />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Total Contract Value (MWK)</label>
            <input className="form-input" required placeholder="0.00" value={newContract.value} onChange={e => setNewContract({...newContract, value: e.target.value})} />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Key Terms & Milestones</label>
            <textarea className="form-input" required rows="4" placeholder="Net 30, Delivery within 14 days..." value={newContract.terms} onChange={e => setNewContract({...newContract, terms: e.target.value})}></textarea>
          </div>
          <div className="flex-wrap-gap">
            <button type="submit" className="btn btn-action-primary"><IconFileCertificate size={18} /> Save Draft</button>
            <button type="button" className="btn btn-action" onClick={() => setView('list')}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  if (selectedContract) {
    return (
      <div className="contract-details">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <button className="btn btn-text" onClick={() => setSelectedContract(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <IconArrowLeft size={16} /> Back to Contracts
          </button>
          <button className="btn btn-action" onClick={handleDelete} style={{ color: '#e11d48', borderColor: '#e11d48' }}>
            <IconTrash size={16} /> Delete
          </button>
        </div>
        
        <div className="glass-panel">
          <div className="flex-between" style={{ borderBottom: '1px solid var(--color-border-tertiary)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{selectedContract.id}: {selectedContract.title}</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>Supplier: <span className="font-medium text-primary">{selectedContract.supplierId}</span></p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#185FA5' }}>{selectedContract.value}</div>
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <StatusPill status={selectedContract.status} />
              </div>
            </div>
          </div>

          <div className="two-col">
            <div>
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '8px' }}>Contract Details</h4>
              <p style={{ fontSize: '13px', marginBottom: '8px' }}><strong>Start Date:</strong> {selectedContract.startDate}</p>
              <p style={{ fontSize: '13px', marginBottom: '8px' }}><strong>End Date:</strong> {selectedContract.endDate}</p>
              
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginTop: '1.5rem', marginBottom: '8px' }}>Terms & Milestones</h4>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', background: 'var(--color-background-secondary)', padding: '1rem', borderRadius: '8px' }}>
                {selectedContract.terms || 'Standard Terms'}
              </p>

              <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '8px', display: 'flex', gap: '12px' }}>
                <IconBell color="#D97706" />
                <div>
                  <h5 style={{ margin: '0 0 4px 0', color: '#D97706', fontSize: '13px' }}>Renewal Alert</h5>
                  <p style={{ fontSize: '12px', color: '#92400E' }}>This contract expires in 3 months. Review performance and begin renewal discussions.</p>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>Linked Records</h4>
              
              <div style={{ padding: '1rem', border: '1px solid var(--color-border-tertiary)', borderRadius: '8px', background: 'var(--color-background-primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>Purchase Orders</span>
                  <span style={{ fontSize: '12px', color: '#185FA5', cursor: 'pointer' }}>View All (3)</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Total Drawdown: <strong>MK 45,000,000</strong></div>
                <div style={{ width: '100%', height: '4px', background: '#E2E8F0', borderRadius: '2px', marginTop: '8px' }}>
                  <div style={{ width: '30%', height: '100%', background: '#1D9E75', borderRadius: '2px' }}></div>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginTop: '4px', textAlign: 'right' }}>30% utilized</div>
              </div>

              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginTop: '1rem' }}>Actions</h4>
              
              {canPerform(currentRole, 'DRAFT_CONTRACT') && (
                <button className="btn btn-action-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <IconFileCertificate size={18} /> Generate Addendum
                </button>
              )}
              
              <button className="btn btn-action" style={{ width: '100%', justifyContent: 'center', background: '#fff' }}>
                <IconHistory size={18} /> View Version History
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
        <span className="section-title">Contract Management</span>
        {canPerform(currentRole, 'DRAFT_CONTRACT') && (
          <button className="btn btn-action-primary" onClick={() => setView('create')}>
            <IconPlus size={16} /> Draft Contract
          </button>
        )}
      </div>
      <div className="table-scroll">
        <table className="modern-table">
        <thead>
          <tr>
            <th>Contract ID</th><th>Supplier</th><th>Title</th>
            <th>Start Date</th><th>End Date</th><th>Value (MWK)</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {(contracts || []).map(c => (
            <tr key={c.id} onClick={() => setSelectedContract(c)} style={{ cursor: 'pointer' }}>
              <td style={{ color: '#185FA5', fontWeight: 500 }}>{c.id}</td>
              <td className="font-medium">{c.supplierId}</td>
              <td>{c.title}</td>
              <td>{c.startDate}</td>
              <td>{c.endDate}</td>
              <td className="font-medium">{c.value}</td>
              <td><StatusPill status={c.status} /></td>
            </tr>
          ))}
          {(contracts || []).length === 0 && (
            <tr><td colSpan="7" className="empty" style={{ background: '#fff' }}>No contracts found.</td></tr>
          )}
        </tbody>
        </table>
      </div>
    </div>
  );
}
