import React from 'react';
import { useLocation } from 'react-router-dom';
import { IconPlus, IconMenu2 } from '@tabler/icons-react';

export function Topbar({ onNewRequest, onToggleSidebar }) {
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
      <div className="topbar-left">
        <button className="mobile-menu-btn" onClick={onToggleSidebar}>
          <IconMenu2 size={20} />
        </button>
        <div className="topbar-title">{getPageTitle()}</div>
      </div>
      <div className="topbar-right">
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
          FY 2025/26 &nbsp;|&nbsp; Malawi Kwacha (MWK)
        </div>
        {(location.pathname === '/' || location.pathname === '/requests') && (
          <button className="btn btn-primary" onClick={onNewRequest}>
            <IconPlus size={16} />
            <span className="btn-label">New Request</span>
          </button>
        )}
      </div>
    </div>
  );
}
