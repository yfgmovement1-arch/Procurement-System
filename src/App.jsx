import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Modal } from './components/Modal';
import { Toast } from './components/Toast';

import { Dashboard } from './pages/Dashboard';
import { PurchaseRequests } from './pages/PurchaseRequests';
import { PurchaseOrders } from './pages/PurchaseOrders';
import { Suppliers } from './pages/Suppliers';
import { Inventory } from './pages/Inventory';
import { Budget } from './pages/Budget';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

import { GoodsReceipts } from './pages/GoodsReceipts';
import { Invoices } from './pages/Invoices';
import { Contracts } from './pages/Contracts';
import { Catalogue } from './pages/Catalogue';

import {
  getPurchaseRequests,
  createPurchaseRequest,
  getPurchaseOrders,
  getSuppliers,
  getInventoryItems,
  getBudgetLines,
  getGoodsReceipts,
  getInvoices,
  getContracts,
  getCatalogue
} from './lib/supabaseClient';

import { hasAccess } from './lib/rbac';

export const RoleContext = createContext();

const ProtectedRoute = ({ children, path }) => {
  const { currentRole } = useContext(RoleContext);
  if (!hasAccess(currentRole, path)) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 style={{ color: 'var(--color-text-primary)' }}>Access Denied</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>Your role ({currentRole}) does not have permission to view this module.</p>
      </div>
    );
  }
  return children;
};

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  
  // Data States
  const [requests, setRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [budgetLines, setBudgetLines] = useState([]);
  const [goodsReceipts, setGoodsReceipts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [catalogue, setCatalogue] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // RBAC Simulated Role
  const [currentRole, setCurrentRole] = useState('Procurement Officer');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');

      try {
        const [
          requestsData, ordersData, suppliersData, inventoryData, budgetData,
          grnData, invoiceData, contractData, catData
        ] = await Promise.all([
          getPurchaseRequests().catch(() => []), 
          getPurchaseOrders().catch(() => []),
          getSuppliers().catch(() => []),
          getInventoryItems().catch(() => []),
          getBudgetLines().catch(() => []),
          getGoodsReceipts().catch(() => []),
          getInvoices().catch(() => []),
          getContracts().catch(() => []),
          getCatalogue().catch(() => [])
        ]);

        setRequests(requestsData);
        setOrders(ordersData);
        setSuppliers(suppliersData);
        setInventoryItems(inventoryData);
        setBudgetLines(budgetData);
        setGoodsReceipts(grnData);
        setInvoices(invoiceData);
        setContracts(contractData);
        setCatalogue(catData);
      } catch (err) {
        setError(err?.message || 'Unable to load procurement data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const refreshRequests = async () => {
    const updated = await getPurchaseRequests().catch(() => []);
    setRequests(updated);
  };

  const handleNewRequest = async (data) => {
    try {
      await createPurchaseRequest({
        id: `PR-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
        item: data.item,
        description: data.item,
        department: data.dept,
        requested_by: data.requestedBy,
        request_date: data.date,
        amount: `MK ${Number(data.amount).toLocaleString()}`,
        priority: data.priority,
        status: 'Pending',
        cost_center: data.costCenter || 'General',
        justification: data.justification || '',
        approval_stage: 'Pending Manager'
      });

      await refreshRequests();
      setToastMsg('Purchase request submitted successfully');
      setIsModalOpen(false);
    } catch (err) {
      setToastMsg(err?.message || 'Failed to submit purchase request');
    }
  };

  return (
    <RoleContext.Provider value={{ currentRole, setCurrentRole }}>
      <Router>
        <div className="app">
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
            currentRole={currentRole}
            onRoleChange={setCurrentRole}
          />
          {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
          <div className="main">
            <Topbar 
              onNewRequest={() => setIsModalOpen(true)} 
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            />
            <div className="content">
              {error && <div className="error-banner">{error}</div>}
              {loading && <div className="loading-banner">Loading procurement data…</div>}
              <Routes>
                <Route path="/" element={<ProtectedRoute path="/"><Dashboard requests={requests} budgetLines={budgetLines} orders={orders} /></ProtectedRoute>} />
                <Route path="/requests" element={<ProtectedRoute path="/requests"><PurchaseRequests requests={requests} currentRole={currentRole} onRefresh={refreshRequests} /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute path="/orders"><PurchaseOrders orders={orders} /></ProtectedRoute>} />
                <Route path="/goods-receipts" element={<ProtectedRoute path="/goods-receipts"><GoodsReceipts receipts={goodsReceipts} orders={orders} /></ProtectedRoute>} />
                <Route path="/invoices" element={<ProtectedRoute path="/invoices"><Invoices invoices={invoices} /></ProtectedRoute>} />
                <Route path="/suppliers" element={<ProtectedRoute path="/suppliers"><Suppliers suppliers={suppliers} /></ProtectedRoute>} />
                <Route path="/contracts" element={<ProtectedRoute path="/contracts"><Contracts contracts={contracts} /></ProtectedRoute>} />
                <Route path="/catalogue" element={<ProtectedRoute path="/catalogue"><Catalogue catalogue={catalogue} /></ProtectedRoute>} />
                <Route path="/inventory" element={<ProtectedRoute path="/inventory"><Inventory inventory={inventoryItems} /></ProtectedRoute>} />
                <Route path="/budget" element={<ProtectedRoute path="/budget"><Budget budgetLines={budgetLines} /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute path="/reports"><Reports /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute path="/settings"><Settings /></ProtectedRoute>} />
              </Routes>
            </div>
          </div>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleNewRequest}
          />
          <Toast
            message={toastMsg}
            onClose={() => setToastMsg('')}
          />
        </div>
      </Router>
    </RoleContext.Provider>
  );
}
