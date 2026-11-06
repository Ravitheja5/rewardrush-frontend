import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { fetchLiveUserFromDB, getAuthSession } from '../utils/auth';
import { Zap, RefreshCw, Smartphone, Award } from 'lucide-react';

export default function DashboardHome() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if session exists in browser
    const session = getAuthSession();
    if (!session || !session.phone) {
      router.replace('/auth');
      return;
    }

    // Fetch directly from live Render DB
    fetchLiveUserFromDB().then((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        // DB lo phone unna response raakapothe fallback session phone tho minimum state create chestam
        setCurrentUser({ name: 'Member', phone: session.phone, points: 0, daily_task_count: 0 });
      }
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-white">
        <RefreshCw className="animate-spin text-[#6366F1] mb-3" size={32} />
        <p className="text-xs text-[#94A3B8]">Connecting to live database...</p>
      </div>
    );
  }

  if (!currentUser) return null;

  const points = currentUser.points || 0;
  const progressPercent = Math.min(100, ((points / 4900) * 100).toFixed(1));

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-24 px-4 pt-4">
      <Head>
        <title>Dashboard | RewardRush</title>
      </Head>

      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-black text-white">
          Welcome, {currentUser.name || 'Member'} 👋
        </h1>
        <p className="text-xs text-[#94A3B8]">
          Phone: {currentUser.phone} • Real-time DB Sync
        </p>
      </div>

      <div className="p-6 bg-[#101522] border border-[#252C3D] rounded-2xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold">
              Available Live Balance
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-white">{points} <span className="text-sm font-normal text-[#818CF8]">pts</span></h2>
              <span className="text-xs font-bold text-[#34D399]">≈ ₹{(points / 100).toFixed(2)}</span>
            </div>
          </div>

          <Link
            href="/rewards"
            className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold rounded-xl shadow transition"
          >
            Redeem Recharge →
          </Link>
        </div>

        <div className="text-[11px] text-[#94A3B8] pt-2 border-t border-[#252C3D] flex items-center justify-between">
          <span>Daily Tasks: <strong className="text-white">{currentUser.daily_task_count || 0}/130</strong></span>
          <Link href="/tasks" className="text-[#818CF8] hover:underline font-bold">
            Start Earning →
          </Link>
        </div>
      </div>

      <div className="p-5 bg-[#101522] border border-[#252C3D] rounded-2xl space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Zap className="text-amber-400" size={14} /> ₹49 Recharge Goal
          </span>
          <span className="font-bold text-[#818CF8]">{progressPercent}%</span>
        </div>

        <div className="w-full bg-[#0B0F17] rounded-full h-2.5 overflow-hidden border border-[#252C3D]">
          <div
            className="bg-[#6366F1] h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <p className="text-[11px] text-[#94A3B8]">
          {points >= 4900 
            ? '🎉 Target reached! Click Redeem to claim your data pack.' 
            : `Need ${4900 - points} points to reach ₹49 Recharge.`}
        </p>
      </div>
    </div>
  );
}
