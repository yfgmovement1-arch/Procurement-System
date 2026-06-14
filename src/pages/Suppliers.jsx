import React, { useState, useContext } from 'react';
import { StatusPill } from '../components/StatusPill';
import { IconPhone, IconPlus, IconArrowLeft, IconBuildingBank, IconCertificate, IconChartBar, IconStar } from '@tabler/icons-react';
import { RoleContext } from '../App';
import { canPerform } from '../lib/rbac';

export function Suppliers({ suppliers }) {
  const { currentRole } = useContext(RoleContext);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [view, setView] = useState('profile'); // profile, performance

  if (selectedSupplier) {
    return (
      <div className="supplier-details">
        <button className="btn btn-text" onClick={() => setSelectedSupplier(null)} style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <IconArrowLeft size={16} /> Back to Suppliers
        </button>
        
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
          <button className="btn btn-action-primary"><IconPlus size={16} /> Onboard New Supplier</button>
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
