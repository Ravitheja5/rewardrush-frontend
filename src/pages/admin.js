import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { CheckCircle2, Clock, RefreshCw, ShieldCheck, PhoneCall } from 'lucide-react';

export default function AdminDashboard() {
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://rewards-app-backend-lq2v.onrender.com/api/admin/redemptions');
      const data = await res.json();
      if (data && Array.isArray(data.redemptions)) {
        setRedemptions(data.redemptions);
      } else if (Array.isArray(data)) {
        setRedemptions(data);
      } else {
        setRedemptions([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setRedemptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      const res = await fetch('https://rewards-app-backend-lq2v.onrender.com/api/admin/redemptions/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        await fetchRequests();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 px-4 pt-6 text-white">
      <Head>
        <title>Admin Portal | RewardRush</title>
      </Head>

      <div className="flex items-center justify-between border-b border-[#252C3D] pb-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <ShieldCheck className="text-[#6366F1]" size={26} /> Admin Portal
          </h1>
          <p className="text-xs text-[#94A3B8]">Manage mobile recharge redemption queues</p>
        </div>
        <button
          onClick={fetchRequests}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E293B] hover:bg-[#334155] text-xs font-semibold rounded-lg transition"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      <div className="bg-[#101522] border border-[#252C3D] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-[#0B0F17] border-b border-[#252C3D] flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
            Pending Recharge Orders ({redemptions.filter(r => r.status === 'PENDING').length})
          </span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-xs text-[#94A3B8] flex items-center justify-center gap-2">
            <RefreshCw className="animate-spin text-[#6366F1]" size={18} /> Loading database records...
          </div>
        ) : redemptions.length === 0 ? (
          <div className="p-10 text-center text-xs text-[#94A3B8]">
            No recharge requests found in the system.
          </div>
        ) : (
          <div className="divide-y divide-[#252C3D]">
            {redemptions.map((item) => (
              <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#131A2B] transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">#{item.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6366F1]/20 text-[#818CF8] border border-[#6366F1]/30">
                      {item.operator || 'Telecom'}
                    </span>
                    <span className={'px-2 py-0.5 rounded text-[10px] font-bold border ' + (
                      item.status === 'COMPLETED'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    )}>
                      {item.status}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <PhoneCall size={14} /> {item.target_phone || item.phone}
                  </div>
                  <p className="text-[11px] text-[#94A3B8]">
                    {item.pack_name || '₹49 - 1-Day Unlimited Data Pack'} &bull; {item.points_cost || 4900} pts
                  </p>
                </div>

                <div>
                  {item.status === 'PENDING' ? (
                    <button
                      onClick={() => handleApprove(item.id)}
                      disabled={actionLoading === item.id}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-md flex items-center gap-1.5"
                    >
                      {actionLoading === item.id ? (
                        <>Processing...</>
                      ) : (
                        <><CheckCircle2 size={14} /> Mark Recharged</>
                      )}
                    </button>
                  ) : (
                    <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={14} /> Fulfilled
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
