import React, { useState } from 'react';
import { IconX, IconSend } from '@tabler/icons-react';

export function Modal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    dept: '',
    requestedBy: '',
    item: '',
    quantity: 1,
    amount: '',
    priority: 'Normal',
    date: '',
    justification: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      dept: '', requestedBy: '', item: '', quantity: 1, amount: '', priority: 'Normal', date: '', justification: ''
    });
  };

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,.45)', zIndex: 100, minHeight: 600,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: 'var(--color-background-primary)',
        borderRadius: 'var(--border-radius-lg)',
        border: '0.5px solid var(--color-border-tertiary)',
        width: 520, padding: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: 16, fontWeight: 500 }}>New Purchase Request</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: 18 }}>
            <IconX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Department / Ministry</label>
              <input name="dept" value={formData.dept} onChange={handleChange} required className="form-input" placeholder="e.g. Ministry of Health" />
            </div>
            <div className="form-group">
              <label className="form-label">Requested By</label>
              <input name="requestedBy" value={formData.requestedBy} onChange={handleChange} required className="form-input" placeholder="Full Name" />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 12 }}>
            <label className="form-label">Item Description</label>
            <input name="item" value={formData.item} onChange={handleChange} required className="form-input" placeholder="Brief description of goods or services" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input name="quantity" type="number" min="1" value={formData.quantity} onChange={handleChange} required className="form-input" placeholder="1" />
            </div>
            <div className="form-group">
              <label className="form-label">Estimated Cost (MWK)</label>
              <input name="amount" value={formData.amount} onChange={handleChange} required className="form-input" placeholder="0.00" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="form-input">
                <option>Normal</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Required Date</label>
              <input name="date" type="date" value={formData.date} onChange={handleChange} required className="form-input" />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Justification</label>
            <textarea name="justification" value={formData.justification} onChange={handleChange} required className="form-input" rows="3" placeholder="Reason for procurement request..."></textarea>
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <IconSend size={16} />
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
