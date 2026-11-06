import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { CheckCircle2, RefreshCw, ShieldCheck, PhoneCall, Lock, LogOut } from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const authStatus = sessionStorage.getItem('rr_admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchRequests();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      sessionStorage.setItem('rr_admin_auth', 'true');
      setIsAuthenticated(true);
      setLoginError('');
      fetchRequests();
    } else {
      setLoginError('Invalid Username or Password! (Use: admin / admin123)');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('rr_admin_auth');
    setIsAuthenticated(false);
  };

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
      console.error(err);
      setRedemptions([]);
    } finally {
      setLoading(false);
    }
  };

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 text-white">
        <Head><title>Admin Login | RewardRush</title></Head>
        <div className="w-full max-w-sm bg-[#101522] border border-[#252C3D] p-6 rounded-2xl shadow-2xl space-y-4">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 bg-[#6366F1]/10 text-[#6366F1] rounded-xl flex items-center justify-center mx-auto border border-[#6366F1]/20">
              <Lock size={24} />
            </div>
            <h2 className="text-xl font-black">Admin Access</h2>
            <p className="text-xs text-[#94A3B8]">Enter credentials to view recharge orders</p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-[#0B0F17] border border-[#252C3D] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6366F1]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                className="w-full bg-[#0B0F17] border border-[#252C3D] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6366F1]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold text-xs rounded-xl transition shadow-lg shadow-[#6366F1]/20"
            >
              Sign In to Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 px-4 pt-4 text-white">
      <Head><title>Admin Panel | RewardRush</title></Head>

      <div className="flex items-center justify-between border-b border-[#252C3D] pb-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <ShieldCheck className="text-emerald-400" size={26} /> Admin Portal
          </h1>
          <p className="text-xs text-[#94A3B8]">Review and approve user recharge requests</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchRequests}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E293B] hover:bg-[#334155] text-xs font-semibold rounded-lg transition"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold rounded-lg transition"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      <div className="bg-[#101522] border border-[#252C3D] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-[#0B0F17] border-b border-[#252C3D]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
            Pending Requests ({redemptions.filter(r => r.status === 'PENDING').length})
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-[#94A3B8] flex items-center justify-center gap-2">
            <RefreshCw className="animate-spin text-[#6366F1]" size={16} /> Loading requests...
          </div>
        ) : redemptions.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#94A3B8]">No redemption records found.</div>
        ) : (
          <div className="divide-y divide-[#252C3D]">
            {redemptions.map((item) => (
              <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">#{item.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6366F1]/20 text-[#818CF8]">
                      {item.operator || 'Telecom'}
                    </span>
                    <span className={'px-2 py-0.5 rounded text-[10px] font-bold ' + (
                      item.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    )}>
                      {item.status}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <PhoneCall size={14} /> {item.target_phone || item.phone}
                  </div>
                  <p className="text-[11px] text-[#94A3B8]">
                    {item.pack_name || '₹49 Data Pack'} &bull; {item.points_cost || item.points_spent || 4900} pts
                  </p>
                </div>

                <div>
                  {item.status === 'PENDING' ? (
                    <button
                      onClick={() => handleApprove(item.id)}
                      disabled={actionLoading === item.id}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-md flex items-center gap-1.5"
                    >
                      {actionLoading === item.id ? 'Updating...' : <><CheckCircle2 size={14} /> Mark Recharged</>}
                    </button>
                  ) : (
                    <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={14} /> Recharged
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
