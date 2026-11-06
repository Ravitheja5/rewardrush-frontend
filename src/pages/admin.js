import React, { useState } from 'react';
import Head from 'next/head';
import { Shield, RefreshCw, Check, X, AlertCircle } from 'lucide-react';

export default function AdminPage() {
  const [secret, setSecret] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [recharges, setRecharges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadRecharges = async (token) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('https://rewards-app-backend-lq2v.onrender.com/api/admin/recharges', {
        headers: { 'admin-secret': token || secret }
      });
      const data = await res.json();
      if (data.success) {
        setRecharges(data.data);
        setIsAuth(true);
      } else {
        setErrorMsg(data.message || 'Access Denied: Invalid Secret Key');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to backend server');
    }
    setLoading(false);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await fetch('https://rewards-app-backend-lq2v.onrender.com/api/admin/recharge/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'admin-secret': secret
        },
        body: JSON.stringify({ id, status })
      });
      loadRecharges(secret);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (!isAuth) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-[#101522] border border-[#252C3D] rounded-2xl space-y-4">
        <Head>
          <title>Admin Login | RewardRush</title>
        </Head>
        <div className="text-center space-y-1">
          <Shield size={28} className="mx-auto text-[#818CF8]" />
          <h2 className="text-lg font-bold text-white">Admin Control Center</h2>
          <p className="text-xs text-[#94A3B8]">Enter secret access key</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
            {errorMsg}
          </div>
        )}

        <input
          type="password"
          placeholder="Admin Secret Key"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-[#0B0E17] border border-[#252C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#818CF8]"
        />

        <button
          onClick={() => loadRecharges(secret)}
          disabled={loading}
          className="w-full py-2.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold text-xs rounded-xl transition"
        >
          {loading ? 'Authenticating...' : 'Access Recharges'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <Head>
        <title>Payouts Console | RewardRush Admin</title>
      </Head>

      <div className="flex items-center justify-between border-b border-[#252C3D] pb-4">
        <div>
          <h1 className="text-xl font-bold text-white">Pending Data Pack Recharges</h1>
          <p className="text-xs text-[#94A3B8]">Process user ₹49 claims</p>
        </div>
        <button
          onClick={() => loadRecharges(secret)}
          className="px-3 py-1.5 bg-[#1E293B] hover:bg-[#334155] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="space-y-3">
        {recharges.map((r) => (
          <div key={r.id} className="p-4 bg-[#101522] border border-[#252C3D] rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">+91 {r.phone}</span>
                <span className="text-xs font-bold text-[#818CF8]">({r.operator})</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${r.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {r.status}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                User: {r.user_name || 'Member'} | Account: +91 {r.account_phone} | Date: {new Date(r.requested_at).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStatusChange(r.id, 'Completed')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1"
              >
                <Check size={14} /> Recharged
              </button>
              <button
                onClick={() => handleStatusChange(r.id, 'Rejected')}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg flex items-center gap-1"
              >
                <X size={14} /> Reject
              </button>
            </div>
          </div>
        ))}
        {recharges.length === 0 && (
          <div className="text-center py-12 text-xs text-[#64748B]">
            No recharge requests submitted yet.
          </div>
        )}
      </div>
    </div>
  );
}
