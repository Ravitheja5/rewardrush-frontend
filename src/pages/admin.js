import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { apiRequest } from '../utils/api';
import { Check, X, Shield, RefreshCw } from 'lucide-react';

export default function AdminPage() {
  const [secret, setSecret] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [recharges, setRecharges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchRecharges = async (pass) => {
    setLoading(true);
    try {
      const res = await fetch('https://rewards-app-backend-lq2v.onrender.com/api/admin/recharges', {
        headers: { 'admin-secret': pass || secret }
      });
      const data = await res.json();
      if (data.success) {
        setRecharges(data.data);
        setIsAuth(true);
      } else {
        setMsg('Invalid Admin Secret');
      }
    } catch (err) {
      setMsg('Server Connection Error');
    }
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    await fetch('https://rewards-app-backend-lq2v.onrender.com/api/admin/recharge/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'admin-secret': secret
      },
      body: JSON.stringify({ id, status })
    });
    fetchRecharges();
  };

  if (!isAuth) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-[#101522] border border-[#252C3D] rounded-2xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Shield size={20} className="text-[#818CF8]" /> RewardRush Admin Panel
        </h2>
        {msg && <p className="text-xs text-red-400">{msg}</p>}
        <input
          type="password"
          placeholder="Enter Admin Secret Key"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-[#0B0E17] border border-[#252C3D] rounded-xl text-xs text-white"
        />
        <button
          onClick={() => fetchRecharges(secret)}
          className="w-full py-2.5 bg-[#6366F1] text-white font-bold text-xs rounded-xl"
        >
          Access Admin Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <Head>
        <title>Admin - Recharges Management</title>
      </Head>

      <div className="flex items-center justify-between border-b border-[#252C3D] pb-4">
        <div>
          <h1 className="text-xl font-bold text-white">Live Data Recharge Claims</h1>
          <p className="text-xs text-[#94A3B8]">Approve ₹49 unlimited data packs</p>
        </div>
        <button
          onClick={() => fetchRecharges()}
          className="p-2 bg-[#1E293B] text-white rounded-lg hover:bg-[#334155]"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {recharges.map((r) => (
          <div key={r.id} className="p-4 bg-[#101522] border border-[#252C3D] rounded-xl flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">{r.phone} ({r.operator})</p>
              <p className="text-xs text-[#94A3B8]">Amount: ₹{r.amount} | Date: {new Date(r.requested_at).toLocaleString()}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${r.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {r.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateStatus(r.id, 'Completed')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1"
              >
                <Check size={14} /> Recharged
              </button>
              <button
                onClick={() => updateStatus(r.id, 'Rejected')}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg flex items-center gap-1"
              >
                <X size={14} /> Reject
              </button>
            </div>
          </div>
        ))}
        {recharges.length === 0 && <p className="text-xs text-[#94A3B8]">No pending recharges right now.</p>}
      </div>
    </div>
  );
}
