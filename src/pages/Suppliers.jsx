import React, { useState, useContext } from 'react';
import { StatusPill } from '../components/StatusPill';
import { IconPhone, IconPlus, IconArrowLeft, IconBuildingBank, IconCertificate, IconChartBar, IconStar, IconTrash } from '@tabler/icons-react';
import { RoleContext } from '../App';
import { canPerform } from '../lib/rbac';
import { createSupplier, deleteSupplier } from '../lib/supabaseClient';

export function Suppliers({ suppliers, refresh, setToastMsg }) {
  const { currentRole } = useContext(RoleContext);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [view, setView] = useState('profile'); // profile, performance
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: '', phone: '', location: '' });

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;
    try {
      await deleteSupplier(selectedSupplier.id);
      await refresh.suppliers();
      setToastMsg('Supplier deleted');
      setSelectedSupplier(null);
    } catch (err) {
      setToastMsg('Error deleting supplier');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const newId = `SUP-${Date.now().toString().slice(-4)}`;
      await createSupplier({
        id: newId,
        name: formData.name,
        category: formData.category,
        phone: formData.phone,
        location: formData.location,
        rating: 0,
        color: 'background:#E6F1FB;color:#0C447C'
      });
      await refresh.suppliers();
      setToastMsg('Supplier onboarded successfully');
      setIsAdding(false);
    } catch (err) {
      setToastMsg('Error onboarding supplier');
    }
  };

  if (isAdding) {
    return (
      <div className="glass-panel">
        <button className="btn btn-text" onClick={() => setIsAdding(false)} style={{ marginBottom: '1rem' }}><IconArrowLeft size={16} /> Back</button>
        <h2>Onboard New Supplier</h2>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', maxWidth: '400px' }}>
          <input className="form-input" placeholder="Supplier Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <input className="form-input" placeholder="Category (e.g., Office Supplies)" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
          <input className="form-input" placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
          <input className="form-input" placeholder="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
          <button type="submit" className="btn btn-action-primary">Onboard Supplier</button>
        </form>
      </div>
    );
  }

  if (selectedSupplier) {
    return (
      <div className="supplier-details">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <button className="btn btn-text" onClick={() => setSelectedSupplier(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <IconArrowLeft size={16} /> Back to Suppliers
          </button>
          <button className="btn btn-action" onClick={handleDelete} style={{ color: '#e11d48', borderColor: '#e11d48' }}>
            <IconTrash size={16} /> Delete
          </button>
        </div>
        
        <div className="glass-panel" style={{ marginBottom: '1.5rem' }}>
          <div className="flex-responsive">
            <div className="supplier-avatar" style={{ width: 64, height: 64, fontSize: 24, background: '#E6F1FB', color: '#0C447C' }}>
              {selectedSupplier.avatar || selectedSupplier.name?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{selectedSupplier.name}</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '8px' }}>{selectedSupplier.category} · {selectedSupplier.location}</p>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <StatusPill status="Active" />
                <span style={{ fontSize: 13, color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <IconPhone size={14} /> {selectedSupplier.phone}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="tab-bar" style={{ marginBottom: '1rem' }}>
          <button className={`tab ${view === 'profile' ? 'active' : ''}`} onClick={() => setView('profile')}>Profile & Onboarding</button>
          <button className={`tab ${view === 'performance' ? 'active' : ''}`} onClick={() => setView('performance')}>Performance Dashboard</button>
        </div>

        {view === 'profile' && (
          <div className="two-col">
            <div className="glass-panel">
              <h3 className="panel-title"><IconBuildingBank size={18} style={{ verticalAlign: '-3px', marginRight: '6px' }}/> Bank Details</h3>
              {selectedSupplier.bankDetails ? (
                <div style={{ background: 'var(--color-background-secondary)', padding: '1rem', borderRadius: 'var(--border-radius-md)' }}>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{selectedSupplier.bankDetails}</p>
                </div>
              ) : (
                <p style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>No bank details on record. Please complete onboarding.</p>
              )}
            </div>
            <div className="glass-panel">
              <h3 className="panel-title"><IconCertificate size={18} style={{ verticalAlign: '-3px', marginRight: '6px' }}/> Certifications</h3>
              {selectedSupplier.certifications ? (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {selectedSupplier.certifications.split(',').map((cert, idx) => (
                    <span key={idx} style={{ background: '#EAF3DE', color: '#27500A', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                      {cert.trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>No certifications on record.</p>
              )}
            </div>
          </div>
        )}

        {view === 'performance' && (
          <div className="glass-panel">
            <h3 className="panel-title"><IconChartBar size={18} style={{ verticalAlign: '-3px', marginRight: '6px' }}/> Performance Metrics</h3>
            <div className="metrics metrics-3">
              <div className="metric">
                <div className="metric-label">Overall Rating</div>
                <div className="metric-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {selectedSupplier.performanceRating || selectedSupplier.rating || 'N/A'} <IconStar size={20} color="#f59e0b" fill="#f59e0b" />
                </div>
              </div>
              <div className="metric">
                <div className="metric-label">On-Time Delivery Rate</div>
                <div className="metric-value">94%</div>
              </div>
              <div className="metric">
                <div className="metric-label">Quality Acceptance Rate</div>
                <div className="metric-value">98.5%</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex-between" style={{ alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 500, color: 'var(--color-text-primary)' }}>Supplier Directory</h2>
        {canPerform(currentRole, 'ONBOARD_SUPPLIER') && (
          <button className="btn btn-action-primary" onClick={() => setIsAdding(true)}><IconPlus size={16} /> Onboard New Supplier</button>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        {(suppliers || []).map(s => {
          const [bg, col] = (s.color || 'background:#E6F1FB;color:#0C447C').split(';').map(v => v.split(':')[1]);
          return (
            <div className="supplier-card glass-panel" key={s.id} onClick={() => setSelectedSupplier(s)} style={{ cursor: 'pointer', padding: '1rem' }}>
              <div className="supplier-avatar" style={{ background: bg, color: col }}>
                {s.avatar || s.name?.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>{s.name}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: '.2rem 0' }}>{s.category}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: '.4rem' }}>
                  <StatusPill status="Active" />
                  <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>Rating: {s.performanceRating || s.rating}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
