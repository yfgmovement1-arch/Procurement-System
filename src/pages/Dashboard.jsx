import React from 'react';
import { MetricCard } from '../components/MetricCard';
import { StatusPill } from '../components/StatusPill';
import { ProgressBar } from '../components/ProgressBar';
import { IconTrendingUp } from '@tabler/icons-react';

export function Dashboard({ requests, budgetLines }) {
  const pendingRequests = requests.filter(r => r.status === 'Pending').slice(0, 3);
  const recentRequests = requests.slice(0, 4);

  const openRequestCount = requests.filter(r => r.status === 'Pending').length;
  const recentBudget = budgetLines.slice(0, 5);

  return (
    <div>
      <div className="metrics">
        <MetricCard label="Total Budget (FY)" value="MK 2.4B" badgeText={<><IconTrendingUp size={11} style={{ marginRight: 3 }} />Govt + Private</>} badgeClass="badge-info" />
        <MetricCard label="Spent to Date" value="MK 890M" badgeText="37% utilised" badgeClass="badge-success" />
        <MetricCard label="Open Requests" value={openRequestCount.toString()} badgeText="Awaiting approval" badgeClass="badge-warn" />
        <MetricCard label="Active Suppliers" value="86" badgeText="12 new this quarter" badgeClass="badge-success" />
      </div>

      <div className="two-col">
        <div className="section">
          <div className="section-header">
            <span className="section-title">Recent Purchase Requests</span>
          </div>
          <table>
            <thead>
              <tr><th>REF</th><th>Item</th><th>Dept</th><th>Status</th></tr>
            </thead>
            <tbody>
              {recentRequests.map(r => (
                <tr key={r.id}>
                  <td style={{ color: '#185FA5', fontWeight: 500 }}>{r.id}</td>
                  <td>{r.item.split(' (')[0]}</td>
                  <td>{r.dept}</td>
                  <td><StatusPill status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="section">
          <div className="section-header">
            <span className="section-title">Budget Utilisation by Department</span>
          </div>
          <div className="chart-wrap">
            {recentBudget.map(b => (
              <div className="budget-row" key={b.dept}>
                <span className="budget-label">{b.dept}</span>
                <div className="budget-bar-wrap">
                  <ProgressBar progress={b.progress} color={b.color} />
                </div>
                <span className="budget-amt">MK {(parseInt(b.allocated.replace(/\D/g, '')) / 1000000).toFixed(0)}M</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <span className="section-title">Pending Approvals</span>
        </div>
        <table>
          <thead>
            <tr><th>Ref</th><th>Description</th><th>Requested By</th><th>Department</th><th>Amount (MWK)</th><th>Priority</th></tr>
          </thead>
          <tbody>
            {pendingRequests.map(r => (
              <tr key={r.id}>
                <td style={{ color: '#185FA5', fontWeight: 500 }}>{r.id}</td>
                <td>{r.desc}</td>
                <td>{r.requestedBy}</td>
                <td>{r.dept}</td>
                <td style={{ fontWeight: 500 }}>{r.amount}</td>
                <td><StatusPill status={r.priority} /></td>
              </tr>
            ))}
            {pendingRequests.length === 0 && (
              <tr><td colSpan="6" className="empty">No pending approvals.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
