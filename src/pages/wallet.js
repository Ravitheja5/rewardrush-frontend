import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getAuthSession, fetchLiveUserFromDB } from '../utils/auth';
import { Wallet, Zap, ShieldCheck } from 'lucide-react';

export default function WalletPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = getAuthSession();
    if (!session || !session.phone) {
      router.push('/auth');
      return;
    }
    fetchLiveUserFromDB().then((u) => {
      if (u) setUser(u);
    });
  }, [router]);

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 px-4 pt-4">
      <Head>
        <title>Wallet | RewardRush</title>
      </Head>

      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-black text-white">Live Points Wallet</h1>
        <p className="text-xs text-[#94A3B8]">Connected directly to PostgreSQL account: +91 {user.phone}</p>
      </div>

      <div className="p-6 bg-[#101522] border border-[#252C3D] rounded-2xl space-y-4">
        <div>
          <span className="text-[11px] text-[#94A3B8] uppercase font-bold tracking-wider">Total Available Balance</span>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-3xl font-black text-white">{user.points} <span className="text-sm font-normal text-[#818CF8]">pts</span></h2>
            <span className="text-xs font-bold text-emerald-400">≈ ₹{(user.points / 100).toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Link href="/rewards" className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold rounded-xl">
            Redeem ₹49 Pack
          </Link>
          <Link href="/tasks" className="px-4 py-2 bg-[#0B0F17] border border-[#252C3D] text-[#94A3B8] hover:text-white text-xs font-bold rounded-xl">
            Earn Points
          </Link>
        </div>
      </div>
    </div>
  );
}
