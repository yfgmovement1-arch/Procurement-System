import React, { useState, useMemo } from 'react';
import { StatusPill } from '../components/StatusPill';

export function PurchaseRequests({ requests }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      const matchFilter = filter === 'All' || r.status === filter;
      const matchSearch = r.item.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [requests, filter, search]);

  return (
    <div className="section">
      <div className="section-header">
        <span className="section-title">All Purchase Requests</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input 
            className="form-input" 
            placeholder="Search requests..." 
            style={{ width: 200, height: 32, fontSize: 12 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="tab-bar">
            {['All', 'Pending', 'Approved', 'Ordered'].map(tab => (
              <div 
                key={tab}
                className={`tab ${filter === tab ? 'active' : ''}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
              </div>
            ))}
          </div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Ref No.</th><th>Description</th><th>Dept / Ministry</th><th>Requested By</th>
            <th>Date</th><th>Amount (MWK)</th><th>Status</th><th></th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map(r => (
            <tr key={r.id}>
              <td style={{ color: '#185FA5', fontWeight: 500 }}>{r.id}</td>
              <td>{r.desc}</td>
              <td>{r.dept}</td>
              <td>{r.requestedBy}</td>
              <td>{r.date}</td>
              <td>{r.amount}</td>
              <td><StatusPill status={r.status} /></td>
              <td><button className="btn" style={{ padding: '3px 8px', fontSize: 11 }}>View</button></td>
            </tr>
          ))}
          {filteredRequests.length === 0 && (
            <tr><td colSpan="8" className="empty">No requests found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
