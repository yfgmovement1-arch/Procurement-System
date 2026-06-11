import React from 'react';

export function MetricCard({ label, value, badgeText, badgeClass }) {
  return (
    <div className="metric">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      {badgeText && (
        <div className={`metric-badge ${badgeClass}`}>
          {badgeText}
        </div>
      )}
    </div>
  );
}
