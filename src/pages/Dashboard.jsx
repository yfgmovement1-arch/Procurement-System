import React, { useContext } from 'react';
import { MetricCard } from '../components/MetricCard';
import { StatusPill } from '../components/StatusPill';
import { ProgressBar } from '../components/ProgressBar';
import { IconTrendingUp, IconAlertCircle, IconCheck, IconClock, IconFileDescription, IconTruckDelivery, IconReceipt, IconChevronRight, IconBell } from '@tabler/icons-react';
import { RoleContext } from '../App';
import { canPerform } from '../lib/rbac';

export function Dashboard({ requests = [], budgetLines = [], orders = [] }) {
  const { currentRole } = useContext(RoleContext);
  // Compute some derived states
  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const highPriority = requests.filter(r => r.priority === 'High');
  const recentActivity = [
    { id: 1, type: 'RFQ', text: 'RFQ sent to IT Solutions Ltd for new laptops', time: '2 hours ago', icon: <IconFileDescription size={16} /> },
    { id: 2, type: 'Approval', text: 'PR-2024-0012 approved by Finance Director', time: '5 hours ago', icon: <IconCheck size={16} /> },
    { id: 3, type: 'Delivery', text: 'Office supplies delivered by OfficeMart', time: '1 day ago', icon: <IconTruckDelivery size={16} /> },
  ];

  return (
    <div className="dashboard-container">
      {/* Metrics Row */}
      <div className="metrics">
        <MetricCard label="Total Budget (FY)" value="MK 2.4B" badgeText={<><IconTrendingUp size={11} style={{ marginRight: 3 }} />Govt + Private</>} badgeClass="badge-info" />
        <MetricCard label="Pending PRs" value={pendingRequests.length.toString()} badgeText="Action Required" badgeClass="badge-warn" />
        <MetricCard label="Active POs" value={orders.length.toString()} badgeText="In Progress" badgeClass="badge-success" />
        <MetricCard label="Urgent Items" value={highPriority.length.toString()} badgeText="Needs immediate attention" badgeClass="badge-danger" />
      </div>

      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="dash-col-main">
          
          {/* Procurement Workflow Stages */}
          <div className="glass-panel workflow-section">
            <h3 className="panel-title">Procurement Workflow Status</h3>
            <div className="workflow-stages">
              <div className="stage active">
                <div className="stage-icon"><IconFileDescription size={20} /></div>
                <div className="stage-info">
                  <span className="stage-count">{pendingRequests.length}</span>
                  <span className="stage-label">Pending PRs</span>
                </div>
                <IconChevronRight size={20} className="stage-arrow" />
              </div>
              <div className="stage active">
                <div className="stage-icon"><IconReceipt size={20} /></div>
                <div className="stage-info">
                  <span className="stage-count">3</span>
                  <span className="stage-label">Active RFQs</span>
                </div>
                <IconChevronRight size={20} className="stage-arrow" />
              </div>
              <div className="stage">
                <div className="stage-icon"><IconCheck size={20} /></div>
                <div className="stage-info">
                  <span className="stage-count">2</span>
                  <span className="stage-label">Pending POs</span>
                </div>
                <IconChevronRight size={20} className="stage-arrow" />
              </div>
              <div className="stage">
                <div className="stage-icon"><IconTruckDelivery size={20} /></div>
                <div className="stage-info">
                  <span className="stage-count">5</span>
                  <span className="stage-label">In Transit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Urgent Items */}
          <div className="glass-panel urgent-section">
            <h3 className="panel-title">Action Required: Overdue & Urgent</h3>
            <div className="urgent-list">
              {highPriority.length > 0 ? highPriority.map(r => (
                <div className="urgent-item" key={r.id}>
                  <div className="urgent-icon"><IconAlertCircle size={24} className="text-danger" /></div>
                  <div className="urgent-details">
                    <h4>{r.id} - {r.item}</h4>
                    <p>Requested by: {r.requestedBy} | Dept: {r.dept}</p>
                  </div>
                  <div className="urgent-actions">
                    <button className="btn btn-action">Review PR</button>
                    {canPerform(currentRole, 'DISPATCH_PO') && (
                      <button className="btn btn-action-primary">Send RFQ</button>
                    )}
                  </div>
                </div>
              )) : (
                <div className="urgent-item">
                  <div className="urgent-icon"><IconAlertCircle size={24} className="text-danger" /></div>
                  <div className="urgent-details">
                    <h4>PR-2024-001 - Servers</h4>
                    <p>Requested by: IT Dept | Priority: High</p>
                  </div>
                  <div className="urgent-actions">
                    <button className="btn btn-action">Review PR</button>
                    {canPerform(currentRole, 'DISPATCH_PO') && (
                      <button className="btn btn-action-primary">Send RFQ</button>
                    )}
                  </div>
                </div>
              )}
              {/* Fake an RFQ requiring quote comparison */}
              <div className="urgent-item">
                <div className="urgent-icon"><IconClock size={24} className="text-warn" /></div>
                <div className="urgent-details">
                  <h4>RFQ-2024-008 - IT Equipment</h4>
                  <p>3 quotes received. Awaiting decision.</p>
                </div>
                <div className="urgent-actions">
                  <button className="btn btn-action-secondary">Compare Quotes</button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Purchase Orders / Requests */}
          <div className="glass-panel table-section">
            <h3 className="panel-title">Recent Purchase Orders</h3>
            <div className="table-scroll">
              <table className="modern-table">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Supplier</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 4).map(o => (
                  <tr key={o.id}>
                    <td className="font-medium text-primary">{o.id}</td>
                    <td>{o.supplier_id}</td>
                    <td className="font-medium">{o.total_amount}</td>
                    <td><StatusPill status={o.status} /></td>
                    <td><button className="btn btn-text">View</button></td>
                  </tr>
                ))}
                {orders.length === 0 && (
                   <tr className="mock-row">
                    <td className="font-medium text-primary">PO-2024-101</td>
                    <td>Tech Hub Malawi</td>
                    <td className="font-medium">MK 1,200,000</td>
                    <td><StatusPill status="Sent to Vendor" /></td>
                    <td><button className="btn btn-text">View</button></td>
                  </tr>
                )}
              </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="dash-col-side">
          
          {/* Notifications / Recent Activity */}
          <div className="glass-panel activity-section">
            <div className="panel-header-flex">
              <h3 className="panel-title">Recent Activity</h3>
              <IconBell size={18} className="text-tertiary" />
            </div>
            <div className="activity-timeline">
              {recentActivity.map(act => (
                <div className="timeline-item" key={act.id}>
                  <div className="timeline-icon">{act.icon}</div>
                  <div className="timeline-content">
                    <p>{act.text}</p>
                    <span className="timeline-time">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-panel quick-actions-section">
            <h3 className="panel-title">Quick Actions</h3>
            <div className="action-grid">
              {canPerform(currentRole, 'CREATE_PR') && (
                <button className="quick-btn">
                  <IconFileDescription size={20} />
                  <span>New PR</span>
                </button>
              )}
              {canPerform(currentRole, 'DISPATCH_PO') && (
                <button className="quick-btn">
                  <IconReceipt size={20} />
                  <span>Create PO</span>
                </button>
              )}
              {(canPerform(currentRole, 'APPROVE_PR_MANAGER') || canPerform(currentRole, 'APPROVE_PR_DIRECTOR')) && (
                <button className="quick-btn">
                  <IconCheck size={20} />
                  <span>Approvals</span>
                </button>
              )}
              {canPerform(currentRole, 'CREATE_GRN') && (
                <button className="quick-btn">
                  <IconTruckDelivery size={20} />
                  <span>Receive Items</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
