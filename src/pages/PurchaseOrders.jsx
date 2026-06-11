import React from 'react';
import { StatusPill } from '../components/StatusPill';

export function PurchaseOrders({ orders }) {
  return (
    <div className="section">
      <div className="section-header">
        <span className="section-title">Purchase Orders</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>PO Number</th><th>Supplier</th><th>Items</th>
            <th>Issue Date</th><th>Expected Delivery</th><th>Value (MWK)</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {(orders || []).map(o => (
            <tr key={o.id}>
              <td style={{ color: '#185FA5', fontWeight: 500 }}>{o.id}</td>
              <td>{o.supplier}</td>
              <td>{o.items}</td>
              <td>{o.issueDate}</td>
              <td>{o.expectedDelivery}</td>
              <td>{o.value}</td>
              <td><StatusPill status={o.status} /></td>
            </tr>
          ))}
          {(orders || []).length === 0 && (
            <tr><td colSpan="7" className="empty">No purchase orders found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
