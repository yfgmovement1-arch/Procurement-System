import React from 'react';
import { useLocation } from 'react-router-dom';
import { IconPlus } from '@tabler/icons-react';

export function Topbar({ onNewRequest }) {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch(location.pathname) {
      case '/': return 'Dashboard';
      case '/requests': return 'Purchase Requests';
      case '/orders': return 'Purchase Orders';
      case '/suppliers': return 'Supplier Management';
      case '/inventory': return 'Inventory';
      case '/budget': return 'Budget Management';
      case '/reports': return 'Reports & Analytics';
      case '/settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="topbar">
      <div className="topbar-title">{getPageTitle()}</div>
      <div className="topbar-right">
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
          FY 2025/26 &nbsp;|&nbsp; Malawi Kwacha (MWK)
        </div>
        <button className="btn btn-primary" onClick={onNewRequest}>
          <IconPlus size={16} />
          New Request
        </button>
      </div>
    </div>
  );
}
