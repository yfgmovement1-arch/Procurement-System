import React from 'react';
import { MetricCard } from '../components/MetricCard';
import { StatusPill } from '../components/StatusPill';

export function Inventory({ inventory }) {
  return (
    <div>
      <div className="metrics" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '1.25rem' }}>
        <MetricCard label="Total Items" value={(inventory || []).length.toString()} badgeText="Loaded from database" badgeClass="badge-info" />
        <MetricCard label="Low Stock Alerts" value="14" badgeText="Reorder needed" badgeClass="badge-warn" />
        <MetricCard label="Stock Value" value="MK 42.3M" badgeText="Updated today" badgeClass="badge-success" />
      </div>
      <div className="section">
        <div className="section-header">
          <span className="section-title">Inventory Items</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Item Code</th><th>Description</th><th>Category</th>
              <th>In Stock</th><th>Reorder Level</th><th>Unit Cost (MWK)</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(inventory || []).map(item => (
              <tr key={item.code}>
                <td style={{ fontWeight: 500 }}>{item.code}</td>
                <td>{item.desc}</td>
                <td>{item.category}</td>
                <td style={{ fontWeight: 500 }}>{item.inStock}</td>
                <td>{item.reorder}</td>
                <td>{item.unitCost}</td>
                <td><StatusPill status={item.status} /></td>
              </tr>
            ))}
            {(inventory || []).length === 0 && (
              <tr><td colSpan="7" className="empty">No inventory items found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
