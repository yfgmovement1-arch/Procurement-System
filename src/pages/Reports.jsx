import React from 'react';
import { IconReportAnalytics, IconBuildingStore, IconWallet, IconPackage, IconClipboardList, IconShieldCheck } from '@tabler/icons-react';

export function Reports() {
  const handleReport = (promptText) => {
    // In a real app, this would trigger report generation
    console.log("Generating report for:", promptText);
  };

  const reports = [
    { icon: IconReportAnalytics, color: '#185FA5', title: 'Quarterly Spend Report', sub: 'Q2 FY 2025/26', prompt: 'Generate a quarterly procurement spend report for Q2 2025 in Malawi showing budget utilisation, top suppliers, and spend by category' },
    { icon: IconBuildingStore, color: '#1D9E75', title: 'Supplier Performance', sub: 'Rating & Compliance', prompt: 'Generate a supplier performance report for Malawi procurement showing delivery rates, value for money and compliance scores' },
    { icon: IconWallet, color: '#BA7517', title: 'Budget vs Actual', sub: 'Variance Analysis', prompt: 'Generate a budget vs actual expenditure analysis report for Malawi government procurement by ministry/department' },
    { icon: IconPackage, color: '#7F77DD', title: 'Inventory Status', sub: 'Stock Levels & Alerts', prompt: 'Generate an inventory stock levels report highlighting low stock and out-of-stock items for procurement action' },
    { icon: IconClipboardList, color: '#D85A30', title: 'Procurement Pipeline', sub: 'Orders & Delivery Status', prompt: 'Generate a procurement pipeline report showing open purchase orders, expected deliveries and pending approvals in Malawi' },
    { icon: IconShieldCheck, color: '#085041', title: 'Compliance & Audit', sub: 'PPDA Compliance Report', prompt: 'Generate a procurement compliance and audit trail report for Malawi showing approval workflows and PPDA compliance' }
  ];

  return (
    <div className="reports-grid">
      {reports.map((r, i) => (
        <div key={i} className="section" style={{ cursor: 'pointer', marginBottom: 0 }} onClick={() => handleReport(r.prompt)}>
          <div style={{ padding: '1.25rem', textAlign: 'center' }}>
            <r.icon size={28} style={{ color: r.color, display: 'block', margin: '0 auto .5rem' }} />
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)' }}>{r.title}</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: '.3rem' }}>{r.sub}</div>
            <div style={{ marginTop: '.75rem', fontSize: 12, color: r.color }}>Generate ↗</div>
          </div>
        </div>
      ))}
    </div>
  );
}
