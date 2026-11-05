import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getLoggedInUser } from '../utils/auth';
import { Wallet, ArrowUpRight, ArrowDownLeft, ShieldCheck, Zap } from 'lucide-react';

export default function WalletPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = getLoggedInUser();
    if (!user) {
      router.push('/auth');
    } else {
      setCurrentUser(user);
    }
  }, [router]);

  if (!currentUser) return null;

  const points = currentUser.points || 0;
  const rupees = (points / 100).toFixed(2);
  const rechargeProgress = Math.min(100, ((points / 4900) * 100)).toFixed(1);

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <Head>
        <title>Wallet | Finora Rewards</title>
      </Head>

      <div className="border-b border-[#1C2231] pb-4">
        <h1 className="text-xl font-semibold text-[#F8FAFC]">Live Points Wallet</h1>
        <p className="text-xs text-[#A1A8B8] mt-0.5">
          Connected directly to PostgreSQL account: +91 {currentUser.phone}
        </p>
      </div>

      {/* Main Balance Box */}
      <div className="p-6 bg-gradient-to-br from-[#101522] via-[#151D30] to-[#101522] border border-[#252C3D] rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-[#818CF8] tracking-wider uppercase flex items-center gap-1.5">
            <Wallet size={14} /> Total Available Balance
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
              {points.toLocaleString()}
            </span>
            <span className="text-sm font-semibold text-[#727C91]">pts</span>
            <span className="text-sm font-bold text-[#34D399] ml-2">≈ ₹{rupees}</span>
          </div>
          <span className="text-[11px] text-[#727C91] block">
            Rate: 100 Points = ₹1.00 INR
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/store"
            className="px-5 py-2.5 bg-[#818CF8] hover:bg-[#6366F1] text-white text-xs font-semibold rounded-xl transition text-center shadow-lg shadow-[#818CF8]/20"
          >
            Redeem ₹49 Pack
          </Link>
          <Link
            href="/tasks"
            className="px-5 py-2.5 bg-[#151D30] hover:bg-[#1C253C] border border-[#252C3D] text-[#F8FAFC] text-xs font-semibold rounded-xl transition text-center"
          >
            Earn Points
          </Link>
        </div>
      </div>

      {/* Goal Target */}
      <div className="p-5 bg-[#101522] border border-[#252C3D] rounded-xl space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#F8FAFC] flex items-center gap-1.5">
            <Zap size={14} className="text-[#818CF8]" /> Target Progress (4,900 pts for ₹49 Pack)
          </span>
          <span className="font-bold text-[#818CF8]">{rechargeProgress}%</span>
        </div>
        <div className="w-full bg-[#0B0E17] h-2.5 rounded-full overflow-hidden border border-[#1C2231]">
          <div
            className="bg-gradient-to-r from-[#818CF8] to-[#34D399] h-full transition-all duration-500"
            style={{ width: `${rechargeProgress}%` }}
          />
        </div>
      </div>

      {/* Account Info */}
      <div className="p-4 bg-[#101522] border border-[#252C3D] rounded-xl flex items-center justify-between text-xs">
        <span className="text-[#A1A8B8] flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-[#34D399]" /> Daily Task Usage
        </span>
        <span className="font-bold text-[#F8FAFC]">
          {currentUser.daily_task_count || 0} / 12 Completed Today
        </span>
      </div>
    </div>
  );
}
