import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, XCircle, RefreshCw, Clock, ArrowLeft } from 'lucide-react';

export default function AdminPanel() {
  const [authKey, setAuthKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionNotes, setActionNotes] = useState({});

  const checkLogin = (key) => {
    if (key === 'admin123') {
      setIsAuthenticated(true);
      fetchRedemptions('admin123');
    }
  };

  const fetchRedemptions = async (key) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/redemptions', {
        headers: { 'x-admin-key': key || authKey }
      });
      const data = await res.json();
      if (data.success) {
        setRedemptions(data.redemptions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, status) => {
    const note = actionNotes[id] || '';
    try {
      const res = await fetch('http://localhost:5000/api/admin/update-status', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': authKey
        },
        body: JSON.stringify({ id, status, remarks: note })
      });
      const data = await res.json();
      if (data.success) {
        fetchRedemptions(authKey);
      }
    } catch (e) {
      alert('Error updating status');
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', padding: '24px', background: '#111427', borderRadius: '16px', border: '1px solid #23284d', color: '#fff', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <ShieldCheck size={40} color="#f59e0b" style={{ margin: '0 auto 12px' }} />
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Admin Dashboard</h2>
        <p style={{ color: '#8f95b2', fontSize: '13px', marginBottom: '20px' }}>Enter master security key to manage payouts</p>
        <input
          type="password"
          placeholder="Enter Admin Key (e.g. admin123)"
          value={authKey}
          onChange={(e) => setAuthKey(e.target.value)}
          style={{ width: '100%', boxSizing: 'border-box', background: '#0a0b16', border: '1px solid #23284d', borderRadius: '10px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none', marginBottom: '16px' }}
        />
        <button
          onClick={() => checkLogin(authKey)}
          style={{ width: '100%', padding: '12px', background: '#f59e0b', color: '#000', fontWeight: '700', borderRadius: '10px', border: 'none', cursor: 'pointer' }}
        >
          Login to Control Panel
        </button>
      </div>
    );
  }

  const pendingCount = redemptions.filter(r => r.status === 'PENDING').length;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <Link href="/" style={{ color: '#8f95b2', textDecoration: 'none', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
            <ArrowLeft size={14} /> Back to User App
          </Link>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Payout & Voucher Dispatch Panel</h1>
        </div>
        <button
          onClick={() => fetchRedemptions(authKey)}
          style={{ background: '#1e2238', border: '1px solid #23284d', color: '#fff', padding: '8px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px' }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: '#111427', border: '1px solid #23284d', padding: '14px 20px', borderRadius: '12px', flex: 1 }}>
          <div style={{ color: '#8f95b2', fontSize: '12px' }}>Action Required</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: pendingCount > 0 ? '#ef4444' : '#10b981' }}>{pendingCount} Pending</div>
        </div>
        <div style={{ background: '#111427', border: '1px solid #23284d', padding: '14px 20px', borderRadius: '12px', flex: 1 }}>
          <div style={{ color: '#8f95b2', fontSize: '12px' }}>Total Requests</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>{redemptions.length}</div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#8f95b2' }}>Loading live requests...</div>
      ) : redemptions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#111427', borderRadius: '12px', color: '#8f95b2' }}>
          No withdrawal claims found yet.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '14px' }}>
          {redemptions.map(item => (
            <div
              key={item.id}
              style={{
                background: item.status === 'PENDING' ? '#14182e' : '#111427',
                border: item.status === 'PENDING' ? '1px solid #f59e0b' : '1px solid #23284d',
                borderRadius: '14px',
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{item.rewardTitle}</span>
                    <span style={{ fontSize: '11px', background: '#23284d', padding: '2px 8px', borderRadius: '6px', color: '#f59e0b', fontWeight: 'bold' }}>
                      {item.pointsDeducted} PTS (₹{item.amount})
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px' }}>
                    Send To: <strong style={{ color: '#10b981', fontSize: '15px' }}>{item.targetValue}</strong>
                  </div>
                  <div style={{ fontSize: '11px', color: '#8f95b2', marginTop: '2px' }}>
                    User ID: #{item.userId} &bull; Reg Mobile: {item.userPhone || 'N/A'} &bull; Time: {new Date(item.createdAt).toLocaleTimeString()}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: item.status === 'PENDING' ? 'rgba(245, 158, 11, 0.15)' : item.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: item.status === 'PENDING' ? '#f59e0b' : item.status === 'COMPLETED' ? '#10b981' : '#ef4444'
                  }}>
                    {item.status}
                  </span>
                </div>
              </div>

              {item.status === 'PENDING' && (
                <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #23284d', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Enter Voucher Code / Recharge TxID (Optional)"
                    value={actionNotes[item.id] || ''}
                    onChange={(e) => setActionNotes({ ...actionNotes, [item.id]: e.target.value })}
                    style={{ flex: 1, background: '#0a0b16', border: '1px solid #23284d', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '12px', outline: 'none' }}
                  />
                  <button
                    onClick={() => handleUpdate(item.id, 'COMPLETED')}
                    style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <CheckCircle2 size={14} /> Send & Approve
                  </button>
                  <button
                    onClick={() => handleUpdate(item.id, 'REJECTED')}
                    style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <XCircle size={14} /> Reject & Refund
                  </button>
                </div>
              )}

              {item.remarks && (
                <div style={{ marginTop: '8px', fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' }}>
                  Note: {item.remarks}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
