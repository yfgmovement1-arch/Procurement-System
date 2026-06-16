import React, { useState } from 'react';
import { MetricCard } from '../components/MetricCard';
import { ProgressBar } from '../components/ProgressBar';
import { IconArrowLeft, IconPlus, IconTrash, IconEdit } from '@tabler/icons-react';
import { createBudgetLine, updateBudgetLine, deleteBudgetLine } from '../lib/supabaseClient';

export function Budget({ budgetLines, refresh, setToastMsg }) {
  const [selectedLine, setSelectedLine] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ code: '', department: '', allocated: '', committed: '', spent: '' });

  const totalAllocated = (budgetLines || []).reduce((total, line) => {
    const value = Number(line.allocated?.replace(/\D/g, '') || 0);
    return total + value;
  }, 0);
  const totalCommitted = (budgetLines || []).reduce((total, line) => {
    const value = Number(line.committed?.replace(/\D/g, '') || 0);
    return total + value;
  }, 0);
  const totalSpent = (budgetLines || []).reduce((total, line) => {
    const value = Number(line.spent?.replace(/\D/g, '') || 0);
    return total + value;
  }, 0);

  const formatMWK = (value) => `MK ${value.toLocaleString()}`;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this budget line?')) return;
    try {
      await deleteBudgetLine(selectedLine.code);
      await refresh.budget();
      setToastMsg('Budget line deleted');
      setSelectedLine(null);
    } catch (err) {
      setToastMsg('Error deleting budget line');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const allocatedNum = Number(formData.allocated.replace(/\D/g, '')) || 0;
      const spentNum = Number(formData.spent.replace(/\D/g, '')) || 0;
      const progress = allocatedNum > 0 ? Math.round((spentNum / allocatedNum) * 100) : 0;
      
      await createBudgetLine({
        code: formData.code,
        department: formData.department,
        allocated: formData.allocated,
        committed: formData.committed || 'MK 0',
        spent: formData.spent || 'MK 0',
        progress,
        color: '#185FA5'
      });
      await refresh.budget();
      setToastMsg('Budget line added');
      setIsAdding(false);
      setFormData({ code: '', department: '', allocated: '', committed: '', spent: '' });
    } catch (err) {
      setToastMsg('Error adding budget line');
    }
  };

  if (isAdding) {
    return (
      <div className="glass-panel">
        <button className="btn btn-text" onClick={() => setIsAdding(false)} style={{ marginBottom: '1rem' }}><IconArrowLeft size={16} /> Back</button>
        <h2>Add Budget Line</h2>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', maxWidth: '400px' }}>
          <input className="form-input" placeholder="Budget Code (e.g., AD-2025-006)" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} required />
          <input className="form-input" placeholder="Department" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} required />
          <input className="form-input" placeholder="Allocated (MK ...)" value={formData.allocated} onChange={e => setFormData({...formData, allocated: e.target.value})} required />
          <input className="form-input" placeholder="Committed (MK ...)" value={formData.committed} onChange={e => setFormData({...formData, committed: e.target.value})} />
          <input className="form-input" placeholder="Spent (MK ...)" value={formData.spent} onChange={e => setFormData({...formData, spent: e.target.value})} />
          <button type="submit" className="btn btn-action-primary">Add Budget Line</button>
        </form>
      </div>
    );
  }

  if (selectedLine) {
    return (
      <div className="glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <button className="btn btn-text" onClick={() => setSelectedLine(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <IconArrowLeft size={16} /> Back to Budget
          </button>
          <button className="btn btn-action" onClick={handleDelete} style={{ color: '#e11d48', borderColor: '#e11d48' }}>
            <IconTrash size={16} /> Delete
          </button>
        </div>
        <div>
          <h2>{selectedLine.code}: {selectedLine.dept}</h2>
          <p>Allocated: {selectedLine.allocated}</p>
          <p>Committed: {selectedLine.committed}</p>
          <p>Spent: {selectedLine.spent}</p>
          <div style={{ width: '100%', maxWidth: '300px', marginTop: '1rem' }}>
            <p style={{ marginBottom: '4px', fontSize: '12px' }}>Utilisation ({selectedLine.progress}%)</p>
            <ProgressBar progress={selectedLine.progress} color={selectedLine.color} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="metrics">
        <MetricCard label="Total Allocated" value={formatMWK(totalAllocated)} />
        <MetricCard label="Committed" value={formatMWK(totalCommitted)} badgeText="Loaded from database" badgeClass="badge-warn" />
        <MetricCard label="Spent" value={formatMWK(totalSpent)} badgeText="Real-time totals" badgeClass="badge-success" />
        <MetricCard label="Available" value={formatMWK(Math.max(totalAllocated - totalCommitted, 0))} badgeText="Remaining" badgeClass="badge-info" />
      </div>
      <div className="section">
        <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
          <span className="section-title">Budget Lines by Vote</span>
          <button className="btn btn-action-primary" onClick={() => setIsAdding(true)}><IconPlus size={16} /> Add Budget Line</button>
        </div>
        <div className="table-scroll">
          <table className="modern-table">
          <thead>
            <tr>
              <th>Vote / Department</th><th>Budget Code</th><th>Allocated (MWK)</th>
              <th>Committed (MWK)</th><th>Spent (MWK)</th><th>Utilisation</th>
            </tr>
          </thead>
          <tbody>
            {(budgetLines || []).map(b => (
              <tr key={b.code} onClick={() => setSelectedLine(b)} style={{ cursor: 'pointer' }}>
                <td>{b.dept}</td>
                <td>{b.code}</td>
                <td>{b.allocated}</td>
                <td>{b.committed}</td>
                <td>{b.spent}</td>
                <td>
                  <div style={{ width: 120 }}>
                    <ProgressBar progress={b.progress} color={b.color} />
                  </div>
                </td>
              </tr>
            ))}
            {(budgetLines || []).length === 0 && (
              <tr><td colSpan="6" className="empty">No budget data found.</td></tr>
            )}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
