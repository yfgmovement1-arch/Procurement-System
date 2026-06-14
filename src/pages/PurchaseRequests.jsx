import React, { useState, useMemo } from 'react';
import { StatusPill } from '../components/StatusPill';
import { IconArrowLeft, IconCheck, IconX, IconClock, IconFileDescription } from '@tabler/icons-react';
import { updatePurchaseRequestStatus } from '../lib/supabaseClient';

export function PurchaseRequests({ requests, currentRole, onRefresh }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedReq, setSelectedReq] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      const matchFilter = filter === 'All' || r.status === filter;
      const matchSearch = r.item.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [requests, filter, search]);

  const handleApprove = async () => {
    setLoadingAction(true);
    try {
      let nextStage = selectedReq.approvalStage;
      let nextStatus = selectedReq.status;

      if (selectedReq.approvalStage === 'Pending Manager') {
        nextStage = 'Pending Director';
      } else if (selectedReq.approvalStage === 'Pending Director') {
        nextStage = 'Approved';
        nextStatus = 'Approved';
      } else if (!selectedReq.approvalStage && selectedReq.status === 'Pending') {
        // Fallback for old data
        nextStage = 'Approved';
        nextStatus = 'Approved';
      }

      await updatePurchaseRequestStatus(selectedReq.id, nextStatus, nextStage);
      await onRefresh();
      setSelectedReq({ ...selectedReq, status: nextStatus, approvalStage: nextStage });
    } catch (err) {
      console.error(err);
    }
    setLoadingAction(false);
  };

  const handleReject = async () => {
    setLoadingAction(true);
    try {
      await updatePurchaseRequestStatus(selectedReq.id, 'Rejected', 'Rejected');
      await onRefresh();
      setSelectedReq({ ...selectedReq, status: 'Rejected', approvalStage: 'Rejected' });
    } catch (err) {
      console.error(err);
    }
    setLoadingAction(false);
  };

  // Determine if current user can approve
  const canApprove = () => {
    if (selectedReq?.status !== 'Pending') return false;
    if (selectedReq?.approvalStage === 'Pending Manager' && currentRole === 'Procurement Manager') return true;
    if (selectedReq?.approvalStage === 'Pending Director' && currentRole === 'Finance Director') return true;
    // Fallback for demo flexibility
    if (!selectedReq?.approvalStage) return true;
    return false;
  };

  if (selectedReq) {
    return (
      <div className="pr-details">
        <button className="btn btn-text" onClick={() => setSelectedReq(null)} style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <IconArrowLeft size={16} /> Back to Requests
        </button>
        
        <div className="glass-panel" style={{ marginBottom: '1.5rem' }}>
          <div className="flex-between">
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{selectedReq.id}: {selectedReq.item}</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: '8px' }}>Requested by: <span className="font-medium">{selectedReq.requestedBy}</span> ({selectedReq.dept})</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#185FA5' }}>{selectedReq.amount}</div>
              <div style={{ marginTop: '8px' }}><StatusPill status={selectedReq.status} /></div>
            </div>
          </div>

          <div className="two-col" style={{ marginTop: '2rem', borderTop: '1px solid var(--color-border-tertiary)', paddingTop: '1.5rem' }}>
            <div>
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '8px' }}>Details</h4>
              <p style={{ fontSize: '13px', marginBottom: '8px' }}><strong>Cost Center:</strong> {selectedReq.costCenter || 'N/A'}</p>
              <p style={{ fontSize: '13px', marginBottom: '8px' }}><strong>Priority:</strong> {selectedReq.priority}</p>
              <p style={{ fontSize: '13px', marginBottom: '8px' }}><strong>Date:</strong> {selectedReq.date}</p>
              
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginTop: '1.5rem', marginBottom: '8px' }}>Justification</h4>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', background: 'var(--color-background-secondary)', padding: '1rem', borderRadius: '8px' }}>
                {selectedReq.justification || 'No justification provided.'}
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--color-border-secondary)' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '1.25rem' }}>Approval Workflow</h4>
              <div className="activity-timeline">
                <div className="timeline-item">
                  <div className="timeline-icon" style={{ background: '#EAF3DE', color: '#27500A', borderColor: '#EAF3DE' }}><IconCheck size={16} /></div>
                  <div className="timeline-content">
                    <p><strong>Submitted</strong> by {selectedReq.requestedBy}</p>
                    <span className="timeline-time">{selectedReq.date}</span>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className={`timeline-icon ${selectedReq.approvalStage !== 'Pending Manager' && selectedReq.status !== 'Pending' ? 'completed' : ''}`} style={{ 
                    background: (selectedReq.approvalStage === 'Pending Manager' && selectedReq.status === 'Pending') ? '#fff' : '#EAF3DE',
                    borderColor: (selectedReq.approvalStage === 'Pending Manager' && selectedReq.status === 'Pending') ? '#185FA5' : '#EAF3DE',
                    color: (selectedReq.approvalStage === 'Pending Manager' && selectedReq.status === 'Pending') ? '#185FA5' : '#27500A'
                  }}>
                    {selectedReq.status === 'Rejected' && selectedReq.approvalStage === 'Rejected' ? <IconX size={16} color="#e11d48"/> : 
                     (selectedReq.approvalStage === 'Pending Manager' && selectedReq.status === 'Pending') ? <IconClock size={16} /> : <IconCheck size={16} />}
                  </div>
                  <div className="timeline-content">
                    <p><strong>Manager Approval</strong></p>
                    {selectedReq.approvalStage === 'Pending Manager' && selectedReq.status === 'Pending' && <span className="timeline-time" style={{ color: '#d97706' }}>Awaiting Action</span>}
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-icon" style={{ 
                    background: selectedReq.status === 'Approved' ? '#EAF3DE' : '#fff',
                    borderColor: selectedReq.approvalStage === 'Pending Director' ? '#185FA5' : 'var(--color-border-secondary)',
                    color: selectedReq.status === 'Approved' ? '#27500A' : 'var(--color-text-tertiary)'
                  }}>
                    {selectedReq.status === 'Approved' ? <IconCheck size={16} /> : <IconClock size={16} />}
                  </div>
                  <div className="timeline-content">
                    <p><strong>Director Approval</strong></p>
                    {selectedReq.approvalStage === 'Pending Director' && selectedReq.status === 'Pending' && <span className="timeline-time" style={{ color: '#d97706' }}>Awaiting Action</span>}
                  </div>
                </div>
              </div>

              {canApprove() && (
                <div className="flex-wrap-gap" style={{ marginTop: '2rem' }}>
                  <button className="btn btn-action-primary" onClick={handleApprove} disabled={loadingAction} style={{ flex: 1 }}>
                    {loadingAction ? 'Processing...' : 'Approve Request'}
                  </button>
                  <button className="btn btn-action" onClick={handleReject} disabled={loadingAction} style={{ flex: 1 }}>
                    Reject
                  </button>
                </div>
              )}
              {!canApprove() && selectedReq.status === 'Pending' && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', fontSize: '12px', color: 'var(--color-text-tertiary)', textAlign: 'center' }}>
                  Your role ({currentRole}) does not have permission to action this request at its current stage.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel">
      <div className="section-header" style={{ padding: '0 0 1.25rem 0', borderBottom: 'none' }}>
        <span className="section-title">Purchase Requisitions</span>
        <div className="flex-wrap-gap">
          <input 
            className="form-input" 
            placeholder="Search PRs..." 
            style={{ width: 200, height: 32, fontSize: 12 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="tab-bar">
            {['All', 'Pending', 'Approved', 'Ordered'].map(tab => (
              <div 
                key={tab}
                className={`tab ${filter === tab ? 'active' : ''}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="table-scroll">
        <table className="modern-table">
        <thead>
          <tr>
            <th>PR No.</th><th>Item</th><th>Cost Center</th><th>Stage</th>
            <th>Date</th><th>Amount (MWK)</th><th>Status</th><th></th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map(r => (
            <tr key={r.id} onClick={() => setSelectedReq(r)} style={{ cursor: 'pointer' }}>
              <td style={{ color: '#185FA5', fontWeight: 500 }}>{r.id}</td>
              <td>{r.item.split(' (')[0]}</td>
              <td>{r.costCenter || r.dept}</td>
              <td style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{r.approvalStage || 'Legacy'}</td>
              <td>{r.date}</td>
              <td className="font-medium">{r.amount}</td>
              <td><StatusPill status={r.status} /></td>
              <td><button className="btn btn-text">Review</button></td>
            </tr>
          ))}
          {filteredRequests.length === 0 && (
            <tr><td colSpan="8" className="empty" style={{ background: '#fff' }}>No requests found.</td></tr>
          )}
        </tbody>
        </table>
      </div>
    </div>
  );
}
