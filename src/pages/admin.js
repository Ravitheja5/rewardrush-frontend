import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { ShieldCheck, CheckCircle2, Clock, Users, RefreshCw } from 'lucide-react';

export default function AdminPage() {
  const [data, setData] = useState({ redemptions: [], users: [] });
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://rewards-app-backend-lq2v.onrender.com/api/admin/redemptions');
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await fetch('https://rewards-app-backend-lq2v.onrender.com/api/admin/redemptions/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      fetchAdminData();
    } catch (e) {
      alert('Error updating status');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-28 px-4 pt-6 text-white">
      <Head>
        <title>Admin Dashboard | RewardRush</title>
      </Head>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <ShieldCheck className="text-emerald-400" /> Admin Redemption Control
          </h1>
          <p className="text-xs text-[#94A3B8]">Approve ₹49 Unlimited Data Pack requests</p>
        </div>
        <button
          onClick={fetchAdminData}
          className="p-2.5 bg-[#101522] border border-[#252C3D] hover:border-[#6366F1] rounded-xl text-xs flex items-center gap-1.5"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* REDEMPTIONS TABLE */}
      <div className="p-6 bg-[#101522] border border-[#252C3D] rounded-2xl space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#94A3B8]">
          Pending ₹49 Mobile Recharge Orders ({data.redemptions.length})
        </h2>

        {data.redemptions.length === 0 ? (
          <p className="text-xs text-[#94A3B8]">Ippativaraku e redemption requests levu.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#252C3D] text-[#94A3B8]">
                <tr>
                  <th className="py-2.5">User Phone</th>
                  <th>Target Mobile</th>
                  <th>Operator</th>
                  <th>Pack</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252C3D]/60">
                {data.redemptions.map((r) => (
                  <tr key={r.id}>
                    <td className="py-3 font-mono">{r.phone}</td>
                    <td className="font-mono text-emerald-400 font-bold">{r.target_phone}</td>
                    <td><span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-bold">{r.operator}</span></td>
                    <td>{r.pack_name} ({r.points_spent} pts)</td>
                    <td>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      {r.status === 'PENDING' ? (
                        <button
                          onClick={() => updateStatus(r.id, 'COMPLETED')}
                          className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold"
                        >
                          Mark Recharged
                        </button>
                      ) : (
                        <span className="text-[#94A3B8] text-[10px]">Recharged ✅</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* REGISTERED USERS LIST */}
      <div className="p-6 bg-[#101522] border border-[#252C3D] rounded-2xl space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-2">
          <Users size={16} /> All Live Users in PostgreSQL ({data.users.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.users.map((u) => (
            <div key={u.id} className="p-3 bg-[#0B0F17] border border-[#252C3D] rounded-xl flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-white">{u.name}</p>
                <p className="text-[#94A3B8]">{u.phone}</p>
              </div>
              <div className="text-right">
                <span className="text-emerald-400 font-black">{u.points} pts</span>
                <p className="text-[10px] text-[#94A3B8]">{u.daily_task_count || 0}/130 tasks</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
