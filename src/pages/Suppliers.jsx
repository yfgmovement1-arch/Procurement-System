import React from 'react';
import { StatusPill } from '../components/StatusPill';
import { IconPhone, IconPlus } from '@tabler/icons-react';

export function Suppliers({ suppliers }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
      {(suppliers || []).map(s => {
        const [bg, col] = (s.color || 'background:#E6F1FB;color:#0C447C').split(';').map(v => v.split(':')[1]);
        return (
          <div className="supplier-card" key={s.id}>
            <div className="supplier-avatar" style={{ background: bg, color: col }}>
              {s.avatar || s.name?.slice(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)' }}>{s.name}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: '.2rem 0' }}>{s.category}</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: '.4rem' }}>
                <StatusPill status="Active" />
                <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>Rating: {s.rating}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: '.3rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                <IconPhone size={12} /> {s.phone} &nbsp;·&nbsp; {s.location}
              </div>
            </div>
          </div>
        );
      })}
      <div
        className="supplier-card"
        style={{ border: '0.5px dashed var(--color-border-secondary)', cursor: 'pointer', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '.5rem', minHeight: 100 }}
      >
        <IconPlus size={22} style={{ color: 'var(--color-text-tertiary)' }} />
        <span style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>Add New Supplier</span>
      </div>
    </div>
  );
}
