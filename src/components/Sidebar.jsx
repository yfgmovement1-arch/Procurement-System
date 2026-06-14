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
  IconBuildingBank,
  IconX,
  IconReceipt,
  IconFileInvoice,
  IconFileCertificate,
  IconBook,
  IconUserCircle
} from '@tabler/icons-react';
import { hasAccess, ROLES } from '../lib/rbac';

export function Sidebar({ isOpen, onClose, currentRole, onRoleChange }) {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: IconLayoutDashboard },
    { path: '/requests', label: 'Purchase Requests', icon: IconClipboardList },
    { path: '/orders', label: 'Purchase Orders', icon: IconShoppingCart },
    { path: '/goods-receipts', label: 'Goods Receipts', icon: IconReceipt },
    { path: '/invoices', label: 'Invoices', icon: IconFileInvoice },
    { path: '/contracts', label: 'Contracts', icon: IconFileCertificate },
    { path: '/catalogue', label: 'Catalogue', icon: IconBook },
    { path: '/suppliers', label: 'Suppliers', icon: IconBuildingStore },
    { path: '/inventory', label: 'Inventory', icon: IconPackage },
    { path: '/budget', label: 'Budget', icon: IconWallet },
    { path: '/reports', label: 'Reports', icon: IconChartBar },
  ];

  // Filter items based on current role
  const allowedNavItems = navItems.filter(item => hasAccess(currentRole, item.path));

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <IconBuildingBank size={18} style={{ color: '#185FA5', verticalAlign: '-3px', marginRight: '6px' }} />
          ProcureMW
          <span>Malawi Procurement Portal</span>
        </div>
        <button className="mobile-close-btn" onClick={onClose}>
          <IconX size={20} />
        </button>
      </div>
      
      <div className="nav-section">
        <div className="nav-label">Main</div>
        {allowedNavItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end={item.path === '/'}
            onClick={onClose}
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="nav-section" style={{ marginTop: 'auto', borderTop: '0.5px solid var(--color-border-tertiary)' }}>
        {hasAccess(currentRole, '/settings') && (
          <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
            <IconSettings size={16} />
            Settings
          </NavLink>
        )}
        
        <div style={{ padding: '1rem', borderTop: '0.5px solid var(--color-border-tertiary)', marginTop: '0.5rem' }}>
          <label style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', display: 'block' }}>
            Simulated Role (RBAC)
          </label>
          <select 
            value={currentRole} 
            onChange={(e) => onRoleChange(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '6px', 
              fontSize: '12px', 
              borderRadius: '4px',
              border: '1px solid var(--color-border-secondary)',
              background: 'var(--color-background-primary)',
              color: 'var(--color-text-primary)'
            }}
          >
            {Object.values(ROLES).map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
