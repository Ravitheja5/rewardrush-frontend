import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { apiRequest } from '../utils/api';
import { ShieldCheck, CheckCircle2, Clock, Users, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const [secret, setSecret] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ total_users: 0, pending_recharges: 0, completed_recharges: 0 });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchAdminData = async (adminSecret) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://rewards-app-backend-lq2v.onrender.com'}/api/admin/recharges`, {
        headers: { 'admin-secret': adminSecret }
      });
      const result = await res.json();
      if (result.success) {
        setIsAuthenticated(true);
        setData(result.data || []);
        if (result.stats) setStats(result.stats);
      } else {
        setMsg('❌ Invalid Admin Secret Key');
      }
    } catch (err) {
      setMsg('❌ Error connecting to backend');
    }
    setLoading(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    fetchAdminData(secret);
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://rewards-app-backend-lq2v.onrender.com'}/api/admin/recharge/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'admin-secret': secret
        },
        body: JSON.stringify({ id, status })
      });
      const result = await res.json();
      if (result.success) {
        fetchAdminData(secret);
      }
    } catch (err) {
      alert('Status update failed');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <Head><title>Admin Access | RewardRush</title></Head>
        <form onSubmit={handleLogin} className="max-w-sm w-full bg-[#101522] border border-[#252C3D] p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-[#818CF8]" size={20} />
            <h2 className="text-sm font-bold text-white">RewardRush Admin</h2>
          </div>
          {msg && <p className="text-xs text-red-400">{msg}</p>}
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter Admin Secret"
            className="w-full bg-[#0B0F17] border border-[#252C3D] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366F1]"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold text-xs rounded-xl shadow transition"
          >
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      <Head><title>Admin Panel | RewardRush</title></Head>

      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="text-[#818CF8]" size={20} /> Admin Redemption Console
        </h2>
        <button
          onClick={() => fetchAdminData(secret)}
          className="p-2 bg-[#101522] border border-[#252C3D] hover:border-[#6366F1] rounded-xl text-white text-xs flex items-center gap-1.5 transition"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 bg-[#101522] border border-[#252C3D] rounded-xl">
          <span className="text-[11px] text-[#94A3B8]">Total Registered Users</span>
          <p className="text-xl font-black text-white mt-1">{stats.total_users || 0}</p>
        </div>
        <div className="p-4 bg-[#101522] border border-amber-500/20 rounded-xl">
          <span className="text-[11px] text-amber-400">Pending Recharges</span>
          <p className="text-xl font-black text-amber-400 mt-1">{stats.pending_recharges || 0}</p>
        </div>
        <div className="p-4 bg-[#101522] border border-emerald-500/20 rounded-xl">
          <span className="text-[11px] text-emerald-400">Completed Recharges</span>
          <p className="text-xl font-black text-emerald-400 mt-1">{stats.completed_recharges || 0}</p>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-[#101522] border border-[#252C3D] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-[#252C3D]">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Recharge Requests</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0F17] text-[#94A3B8] border-b border-[#252C3D]">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Target Mobile</th>
                <th className="p-3">Operator</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252C3D] text-white">
              {data.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-[#94A3B8]">No recharge requests logged yet.</td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="hover:bg-[#151B2B] transition">
                    <td className="p-3">{row.user_name || 'User'} ({row.account_phone})</td>
                    <td className="p-3 font-mono font-bold text-[#818CF8]">{row.phone}</td>
                    <td className="p-3 uppercase">{row.operator}</td>
                    <td className="p-3 font-bold text-[#34D399]">₹{row.amount}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {row.status === 'Pending' && (
                        <button
                          onClick={() => updateStatus(row.id, 'Completed')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold transition shadow"
                        >
                          Mark Completed
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
