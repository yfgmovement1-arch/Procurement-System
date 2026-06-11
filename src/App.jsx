import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

import {
  getPurchaseRequests,
  createPurchaseRequest,
  updatePurchaseRequestStatus,
  getPurchaseOrders,
  getSuppliers,
  getInventoryItems,
  getBudgetLines
} from './lib/supabaseClient';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [requests, setRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [budgetLines, setBudgetLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');

      try {
        const [requestsData, ordersData, suppliersData, inventoryData, budgetData] = await Promise.all([
          getPurchaseRequests(),
          getPurchaseOrders(),
          getSuppliers(),
          getInventoryItems(),
          getBudgetLines()
        ]);

        setRequests(requestsData);
        setOrders(ordersData);
        setSuppliers(suppliersData);
        setInventoryItems(inventoryData);
        setBudgetLines(budgetData);
      } catch (err) {
        setError(err?.message || 'Unable to load procurement data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const refreshRequests = async () => {
    const updated = await getPurchaseRequests();
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
        status: 'Pending'
      });

      await refreshRequests();
      setToastMsg('Purchase request submitted successfully');
      setIsModalOpen(false);
    } catch (err) {
      setToastMsg(err?.message || 'Failed to submit purchase request');
    }
  };

  const approveRequest = async (id) => {
    try {
      await updatePurchaseRequestStatus(id, 'Approved');
      setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
      setToastMsg('Request approved');
    } catch (err) {
      setToastMsg(err?.message || 'Failed to approve request');
    }
  };

  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main">
          <Topbar onNewRequest={() => setIsModalOpen(true)} />
          <div className="content">
            {error && <div className="error-banner">{error}</div>}
            {loading && <div className="loading-banner">Loading procurement data…</div>}
            <Routes>
              <Route path="/" element={<Dashboard requests={requests} budgetLines={budgetLines} />} />
              <Route path="/requests" element={<PurchaseRequests requests={requests} />} />
              <Route path="/orders" element={<PurchaseOrders orders={orders} />} />
              <Route path="/suppliers" element={<Suppliers suppliers={suppliers} />} />
              <Route path="/inventory" element={<Inventory inventory={inventoryItems} />} />
              <Route path="/budget" element={<Budget budgetLines={budgetLines} />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
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
  );
}
