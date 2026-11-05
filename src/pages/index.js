import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getLoggedInUser } from '../utils/auth';
import { Zap, CheckCircle2, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const sessionUser = getLoggedInUser();
    setUser(sessionUser);
  }, []);

  const points = user ? user.points : 0;
  const rupees = (points / 100).toFixed(2);
  const rechargeProgress = Math.min(100, ((points / 4900) * 100)).toFixed(1);

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <Head>
        <title>RewardRush - Fintech Rewards Ecosystem</title>
      </Head>

      {/* Greeting & Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">
          {user ? `Welcome back, +91 ${user.phone} 👋` : 'Welcome to RewardRush 👋'}
        </h1>
        <p className="text-xs text-[#727C91] mt-0.5">
          {user ? 'Your real-time earnings and redemption progress' : 'Login to earn free unlimited 1-day high speed data packs'}
        </p>
      </div>

      {/* Available Balance Card */}
      <div className="p-6 bg-[#101522] border border-[#252C3D] rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-[#818CF8] tracking-wider uppercase">
            Available Live Balance
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
              {points.toLocaleString()}
            </span>
            <span className="text-sm font-semibold text-[#727C91]">pts</span>
            <span className="text-sm font-bold text-[#34D399] ml-2">≈ ₹{rupees}</span>
          </div>
          <p className="text-[11px] text-[#727C91]">
            Daily tasks completed: <strong className="text-[#F8FAFC]">{user ? user.daily_task_count : 0}/12</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/store"
                className="px-5 py-2.5 bg-[#818CF8] hover:bg-[#6366F1] text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-[#818CF8]/20 flex items-center gap-1.5"
              >
                Redeem Rewards <ArrowRight size={14} />
              </Link>
              <Link
                href="/tasks"
                className="px-5 py-2.5 bg-[#151D30] hover:bg-[#1C253C] border border-[#252C3D] text-[#F8FAFC] text-xs font-semibold rounded-xl transition"
              >
                Earn More
              </Link>
            </>
          ) : (
            <Link
              href="/auth"
              className="px-6 py-2.5 bg-[#818CF8] hover:bg-[#6366F1] text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-[#818CF8]/20"
            >
              Login / Register Now
            </Link>
          )}
        </div>
      </div>

      {/* Goal Progress Card */}
      <div className="p-5 bg-[#101522] border border-[#252C3D] rounded-2xl space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#F8FAFC] flex items-center gap-1.5">
            <Zap size={14} className="text-[#818CF8]" /> ₹49 Data Recharge Goal
          </span>
          <span className="font-bold text-[#818CF8]">{rechargeProgress}%</span>
        </div>
        <div className="w-full bg-[#0B0E17] h-2.5 rounded-full overflow-hidden border border-[#1C2231]">
          <div
            className="bg-gradient-to-r from-[#818CF8] to-[#34D399] h-full transition-all duration-500"
            style={{ width: `${rechargeProgress}%` }}
          />
        </div>
        <p className="text-[11px] text-[#727C91]">
          Need 4,900 points to claim an instant 1-Day Unlimited Data Pack.
        </p>
      </div>
    </div>
  );
}
