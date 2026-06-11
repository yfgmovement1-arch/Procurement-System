import React from 'react';

export function StatusPill({ status }) {
  const getStatusClass = (s) => {
    switch (s?.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'ordered': return 'status-ordered';
      case 'received': return 'status-received';
      case 'in transit': return 'status-ordered';
      case 'confirmed': return 'status-approved';
      case 'delivered': return 'status-received';
      case 'low stock': return 'badge-warn';
      case 'in stock': return 'status-approved';
      case 'critical': return 'badge-danger';
      case 'out of stock': return 'status-rejected';
      case 'urgent': return 'badge-danger';
      case 'high': return 'status-pending';
      case 'normal': return 'status-ordered';
      default: return 'status-pending';
    }
  };

  return (
    <span className={`status-pill ${getStatusClass(status)}`}>
      {status}
    </span>
  );
}
