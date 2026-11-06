import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getAuthSession, fetchLiveUserFromDB, logoutUser } from '../utils/auth';
import { User, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState({ name: 'Ravitheja Ediga', phone: '6300442917', points: 10000 });

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

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-28 px-4 pt-4">
      <Head>
        <title>Account Profile | RewardRush</title>
      </Head>

      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-black text-white">User Profile</h1>
        <p className="text-xs text-[#94A3B8]">Manage your verified reward credentials</p>
      </div>

      <div className="p-6 bg-[#101522] border border-[#252C3D] rounded-3xl space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6366F1] to-[#34D399] flex items-center justify-center text-white font-black text-xl">
            {user.name ? user.name[0] : 'U'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user.name || 'Member'}</h2>
            <p className="text-xs text-[#94A3B8]">+91 {user.phone}</p>
            <span className="inline-block mt-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Verified Account
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-[#0B0F17] border border-[#252C3D] rounded-2xl">
            <span className="text-[10px] text-[#94A3B8] uppercase font-bold block mb-1">Available Points</span>
            <span className="text-lg font-black text-emerald-400">{user.points} pts</span>
          </div>
          <div className="p-4 bg-[#0B0F17] border border-[#252C3D] rounded-2xl">
            <span className="text-[10px] text-[#94A3B8] uppercase font-bold block mb-1">Tasks Completed Today</span>
            <span className="text-lg font-black text-indigo-400">{user.daily_task_count || 0} / 130</span>
          </div>
        </div>

        <button
          onClick={logoutUser}
          className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
        >
          <LogOut size={16} /> Logout of RewardRush
        </button>
      </div>
    </div>
  );
}
