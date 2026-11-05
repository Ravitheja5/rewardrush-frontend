import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('rewardUser');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('rewardUser');
    setUser(null);
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 pb-28">
      <Head>
        <title>Account Profile | RewardRush</title>
      </Head>

      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
          Account Profile
        </h1>

        {/* User Card */}
        <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 border border-slate-800 rounded-3xl shadow-xl">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-orange-500/20">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : 'RR'}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-100">{user.name || 'Member'}</h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{user.phone}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full">
                    Verified User
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-center">
                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/50">
                  <span className="text-[10px] text-slate-400 block">Available</span>
                  <span className="text-sm font-bold text-amber-400">⚡ {user.points || 265}</span>
                </div>
                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/50">
                  <span className="text-[10px] text-slate-400 block">Redeemed</span>
                  <span className="text-sm font-bold text-slate-300">₹150</span>
                </div>
                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/50">
                  <span className="text-[10px] text-slate-400 block">Tasks</span>
                  <span className="text-sm font-bold text-emerald-400">8 Done</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-800 flex items-center justify-center text-xl text-slate-400">
                👤
              </div>
              <h3 className="text-sm font-semibold text-slate-200">You are not logged in</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">Log in to track points and protect your wallet.</p>
              <Link
                href="/auth"
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 inline-block"
              >
                Sign In / Register
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions List */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden divide-y divide-slate-800/60">
          <Link href="/vault" className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition">
            <div className="flex items-center gap-3">
              <span className="text-lg">🎟️</span>
              <span className="text-xs font-semibold text-slate-200">My Claimed Rewards & Codes</span>
            </div>
            <span className="text-slate-500 text-sm">→</span>
          </Link>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg">🛡️</span>
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Ledger Security & Fraud Rules</span>
                <span className="text-[10px] text-slate-500">Atomic IST-based ledger verification</span>
              </div>
            </div>
            <span className="text-emerald-400 text-xs font-mono font-bold">ACTIVE</span>
          </div>
        </div>

        {user && (
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-bold rounded-2xl transition"
          >
            Log Out
          </button>
        )}
      </div>
    </div>
  );
}
