import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  IconLayoutDashboard, 
  IconClipboardList, 
  IconShoppingCart, 
  IconBuildingStore, 
  IconPackage, 
  IconWallet, 
  IconChartBar, 
  IconSettings,
  IconBuildingBank
} from '@tabler/icons-react';

export function Sidebar() {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: IconLayoutDashboard },
    { path: '/requests', label: 'Purchase Requests', icon: IconClipboardList },
    { path: '/orders', label: 'Purchase Orders', icon: IconShoppingCart },
    { path: '/suppliers', label: 'Suppliers', icon: IconBuildingStore },
    { path: '/inventory', label: 'Inventory', icon: IconPackage },
    { path: '/budget', label: 'Budget', icon: IconWallet },
    { path: '/reports', label: 'Reports', icon: IconChartBar },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <IconBuildingBank size={18} style={{ color: '#185FA5', verticalAlign: '-3px', marginRight: '6px' }} />
          ProcureMW
          <span>Malawi Procurement Portal</span>
        </div>
      </div>
      
      <div className="nav-section">
        <div className="nav-label">Main</div>
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end={item.path === '/'}
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="nav-section" style={{ marginTop: 'auto', borderTop: '0.5px solid var(--color-border-tertiary)' }}>
        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <IconSettings size={16} />
          Settings
        </NavLink>
        <div style={{ padding: '.75rem 1rem', display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, color: '#0C447C' }}>
            MZ
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-primary)' }}>Mercy Zimba</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>Procurement Officer</div>
          </div>
        </div>
      </div>
    </div>
  );
}
