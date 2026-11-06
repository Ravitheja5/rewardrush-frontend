import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getAuthSession, fetchLiveUserFromDB } from '../utils/auth';
import { Zap, RefreshCw } from 'lucide-react';

export default function DashboardHome() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const user = await fetchLiveUserFromDB();
    if (!user) {
      router.push('/auth');
      return;
    }
    setCurrentUser(user);
    setLoading(false);
  };

  useEffect(() => {
    const session = getAuthSession();
    if (!session) {
      router.push('/auth');
      return;
    }
    loadData();
  }, [router]);

  if (loading && !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
        <RefreshCw className="animate-spin text-[#6366F1] mb-2" size={32} />
        <p className="text-xs text-[#94A3B8]">Fetching live data from database...</p>
      </div>
    );
  }

  if (!currentUser) return null;

  const points = currentUser.points || 0;
  const progressPercent = Math.min(100, ((points / 4900) * 100).toFixed(1));
  const displayName = currentUser.name || 'Member';

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-24">
      <Head>
        <title>Dashboard | RewardRush</title>
      </Head>

      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          Welcome back, {displayName} 👋
        </h1>
        <p className="text-xs text-[#94A3B8]">
          Real-time balance directly from database
        </p>
      </div>

      <div className="p-6 bg-gradient-to-br from-[#101522] via-[#1E1B4B] to-[#101522] border border-[#6366F1]/30 rounded-2xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold flex items-center gap-1.5">
              Available Live Balance {loading && <RefreshCw size={10} className="animate-spin text-[#818CF8]" />}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-white">{points} <span className="text-sm font-normal text-[#818CF8]">pts</span></h2>
              <span className="text-xs font-bold text-[#34D399]">≈ ₹{(points / 100).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href="/rewards"
              className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold rounded-xl shadow transition"
            >
              Redeem Rewards →
            </Link>
            <Link
              href="/tasks"
              className="px-4 py-2 bg-[#252C3D] hover:bg-[#2D3748] text-white text-xs font-bold rounded-xl transition"
            >
              Earn More
            </Link>
          </div>
        </div>

        <div className="text-[11px] text-[#94A3B8] pt-2 border-t border-[#252C3D]/60 flex items-center justify-between">
          <span>Daily tasks: <strong className="text-white">{currentUser.daily_task_count || 0}/130</strong></span>
          <button 
            onClick={loadData}
            className="text-[#818CF8] hover:underline flex items-center gap-1 text-[11px]"
          >
            <RefreshCw size={10} /> Sync Now
          </button>
        </div>
      </div>

      <div className="p-5 bg-[#101522] border border-[#252C3D] rounded-2xl space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Zap className="text-amber-400" size={14} /> ₹49 Data Recharge Goal
          </span>
          <span className="font-bold text-[#818CF8]">{progressPercent}%</span>
        </div>

        <div className="w-full bg-[#0B0F17] rounded-full h-2.5 overflow-hidden border border-[#252C3D]">
          <div
            className="bg-gradient-to-r from-[#6366F1] to-[#34D399] h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <p className="text-[11px] text-[#94A3B8]">
          {points >= 4900 
            ? '🎉 Target reached! Go to Rewards to claim your recharge.' 
            : `Need ${4900 - points} points to claim an instant 1-Day Unlimited Data Pack.`}
        </p>
      </div>
    </div>
  );
}
