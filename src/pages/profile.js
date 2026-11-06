import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getLoggedInUser, logoutUser } from '../utils/auth';
import { User, Phone, Award, LogOut, ShieldCheck, Zap, Share2 } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const sessionUser = getLoggedInUser();
    if (!sessionUser) {
      router.push('/auth');
    } else {
      setUser(sessionUser);
    }
  }, [router]);

  const handleLogout = () => {
    logoutUser();
    router.push('/auth');
  };

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-16">
      <Head>
        <title>Account Profile | RewardRush</title>
      </Head>

      <div className="border-b border-[#252C3D] pb-4">
        <h1 className="text-xl font-bold text-white">User Profile</h1>
        <p className="text-xs text-[#94A3B8]">Manage your verified reward credentials</p>
      </div>

      {/* Profile Card */}
      <div className="p-6 bg-[#101522] border border-[#252C3D] rounded-2xl space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-tr from-[#6366F1] to-[#34D399] rounded-2xl flex items-center justify-center text-white text-xl font-extrabold shadow-lg">
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-base font-bold text-white">{user.name || 'Member'}</h2>
            <p className="text-xs text-[#94A3B8] font-mono">+91 {user.phone}</p>
            <span className="inline-block mt-1 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
              Verified Account
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#1C2231]">
          <div className="p-3 bg-[#0B0E17] rounded-xl border border-[#1C2231]">
            <span className="text-[11px] text-[#64748B] block">Available Points</span>
            <span className="text-lg font-bold text-[#34D399]">{user.points || 0} pts</span>
          </div>
          <div className="p-3 bg-[#0B0E17] rounded-xl border border-[#1C2231]">
            <span className="text-[11px] text-[#64748B] block">Tasks Completed Today</span>
            <span className="text-lg font-bold text-[#818CF8]">{user.daily_task_count || 0} / 130</span>
          </div>
        </div>

        {user.referral_code && (
          <div className="p-3 bg-[#151D30] rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#818CF8]">Your Referral Code</span>
              <p className="text-xs font-mono font-bold text-white">{user.referral_code}</p>
            </div>
            <button
              onClick={() => alert(`Share code ${user.referral_code} with friends to earn bonus points!`)}
              className="p-2 bg-[#1E293B] hover:bg-[#334155] text-white rounded-lg"
            >
              <Share2 size={16} />
            </button>
          </div>
        )}

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 mt-2"
        >
          <LogOut size={16} /> Logout of RewardRush
        </button>
      </div>
    </div>
  );
}
