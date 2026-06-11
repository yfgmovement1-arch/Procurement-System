import React from 'react';
import { MetricCard } from '../components/MetricCard';
import { ProgressBar } from '../components/ProgressBar';

export function Budget({ budgetLines }) {
  const totalAllocated = budgetLines.reduce((total, line) => {
    const value = Number(line.allocated?.replace(/\D/g, '') || 0);
    return total + value;
  }, 0);
  const totalCommitted = budgetLines.reduce((total, line) => {
    const value = Number(line.committed?.replace(/\D/g, '') || 0);
    return total + value;
  }, 0);
  const totalSpent = budgetLines.reduce((total, line) => {
    const value = Number(line.spent?.replace(/\D/g, '') || 0);
    return total + value;
  }, 0);

  const formatMWK = (value) => `MK ${value.toLocaleString()}`;

  return (
    <div>
      <div className="metrics">
        <MetricCard label="Total Allocated" value={formatMWK(totalAllocated)} />
        <MetricCard label="Committed" value={formatMWK(totalCommitted)} badgeText="Loaded from database" badgeClass="badge-warn" />
        <MetricCard label="Spent" value={formatMWK(totalSpent)} badgeText="Real-time totals" badgeClass="badge-success" />
        <MetricCard label="Available" value={formatMWK(Math.max(totalAllocated - totalCommitted, 0))} badgeText="Remaining" badgeClass="badge-info" />
      </div>
      <div className="section">
        <div className="section-header">
          <span className="section-title">Budget Lines by Vote</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Vote / Department</th><th>Budget Code</th><th>Allocated (MWK)</th>
              <th>Committed (MWK)</th><th>Spent (MWK)</th><th>Utilisation</th>
            </tr>
          </thead>
          <tbody>
            {(budgetLines || []).map(b => (
              <tr key={b.code}>
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
  );
}
