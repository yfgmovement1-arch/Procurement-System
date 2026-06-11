import React from 'react';

export function Settings() {
  return (
    <div className="section">
      <div className="section-header">
        <span className="section-title">System Settings</span>
      </div>
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 500 }}>
        <div className="form-group">
          <label className="form-label">Organisation Name</label>
          <input className="form-input" defaultValue="Government of Malawi - Procurement Unit" />
        </div>
        <div className="form-group">
          <label className="form-label">Financial Year</label>
          <input className="form-input" defaultValue="2025/2026" />
        </div>
        <div className="form-group">
          <label className="form-label">Currency</label>
          <input className="form-input" defaultValue="Malawi Kwacha (MWK)" />
        </div>
        <div className="form-group">
          <label className="form-label">Approval Threshold (MWK)</label>
          <input className="form-input" defaultValue="500,000" />
        </div>
        <div className="form-group">
          <label className="form-label">PPDA Registration No.</label>
          <input className="form-input" defaultValue="PPDA-MW-2024-0145" />
        </div>
        <button className="btn btn-primary" style={{ width: 'fit-content' }}>Save Settings</button>
      </div>
    </div>
  );
}
