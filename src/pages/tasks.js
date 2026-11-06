import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getLoggedInUser, syncWallet } from '../utils/auth';
import { apiRequest } from '../utils/api';
import { Flame, PlayCircle, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function TasksPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [claimMsg, setClaimMsg] = useState('');

  // Balanced High-Earning Task Pool (40 pts average * 125 tasks = 5,000 pts / day = 1 Recharge Pack)
  const taskCatalog = [
    { id: 'monetag_smart_1', title: 'Telecom Sponsor Video Stream', type: 'High Value Ad', points: 45, duration: 15, url: 'https://www.google.com' },
    { id: 'adsterra_pop_1', title: 'Fintech Credit Score Discovery', type: 'Adsterra Ad', points: 40, duration: 15, url: 'https://www.google.com' },
    { id: 'partner_direct_1', title: '5G Data Offers Exploration', type: 'Partner Link', points: 35, duration: 12, url: 'https://www.google.com' },
    { id: 'video_guide_1', title: 'Finora Platform Earning Guide', type: 'Sponsored Video', points: 50, duration: 20, url: 'https://www.youtube.com' },
    { id: 'adsterra_direct_2', title: 'Quick Instant Cashback Verification', type: 'CPA Task', points: 40, duration: 15, url: 'https://www.google.com' },
    { id: 'monetag_video_2', title: 'Fast-Track Data Accelerator Ad', type: 'Monetag Ad', points: 45, duration: 18, url: 'https://www.google.com' }
  ];

  useEffect(() => {
    const user = getLoggedInUser();
    if (!user) {
      router.push('/auth');
    } else {
      setCurrentUser(user);
    }
  }, [router]);

  useEffect(() => {
    let interval = null;
    if (activeTask && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (activeTask && timer === 0) {
      handleCompleteTask();
    }
    return () => clearInterval(interval);
  }, [activeTask, timer]);

  const handleDailyStreak = async () => {
    if (!currentUser) return;
    setLoading(true);
    const res = await apiRequest('/api/user/daily-checkin', 'POST', { userId: currentUser.id });
    if (res.success) {
      syncWallet(res.user);
      setCurrentUser(res.user);
      setClaimMsg(res.message);
    } else {
      setClaimMsg(`❌ ${res.message}`);
    }
    setLoading(false);
  };

  const startTask = (task) => {
    if ((currentUser.daily_task_count || 0) >= 130) {
      setClaimMsg('❌ You have completed the maximum 130 daily tasks today! Reset happens at midnight.');
      return;
    }
    setActiveTask(task);
    setTimer(task.duration);
    setClaimMsg('');
    if (typeof window !== 'undefined') {
      window.open(task.url, '_blank');
    }
  };

  const handleCompleteTask = async () => {
    if (!activeTask || !currentUser) return;
    setLoading(true);

    try {
      const res = await apiRequest('/api/tasks/complete', 'POST', {
        userId: currentUser.id,
        taskId: activeTask.id,
        points: activeTask.points
      });

      if (res.success) {
        syncWallet(res.user);
        setCurrentUser(res.user);
        setClaimMsg(`🎉 +${activeTask.points} Points added!`);
      } else {
        setClaimMsg(`❌ ${res.message}`);
      }
    } catch (err) {
      setClaimMsg('❌ Verification failed');
    }
    setActiveTask(null);
    setLoading(false);
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16">
      <Head>
        <title>Tasks & Earning | RewardRush</title>
      </Head>

      {/* Daily Streak Box */}
      <div className="p-5 bg-gradient-to-r from-[#101522] via-[#1E1B4B] to-[#101522] border border-[#6366F1]/30 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Flame className="text-amber-400" size={16} /> Daily Check-in Bonus
          </h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">Collect +25 points free everyday</p>
        </div>
        <button
          onClick={handleDailyStreak}
          disabled={loading}
          className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold text-xs rounded-xl shadow transition"
        >
          Claim 25 pts
        </button>
      </div>

      {claimMsg && (
        <div className={`p-3 text-xs text-center rounded-xl font-medium ${claimMsg.includes('❌') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
          {claimMsg}
        </div>
      )}

      {/* Active Running Task */}
      {activeTask && (
        <div className="p-4 bg-[#1E1B4B] border border-[#818CF8] rounded-xl flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin text-[#818CF8]" size={20} />
            <div>
              <p className="text-xs font-bold text-white">Sponsor View in Progress...</p>
              <p className="text-[11px] text-[#A5B4FC]">Please wait {timer}s to claim points</p>
            </div>
          </div>
          <span className="font-mono font-bold text-sm text-[#34D399]">+{activeTask.points} pts</span>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
            Today's Earn Tasks ({currentUser.daily_task_count || 0}/130 Completed)
          </h3>
          <span className="text-xs font-bold text-[#34D399]">
            Target: 4,900 pts = ₹49 Data Pack
          </span>
        </div>

        {taskCatalog.map((task) => (
          <div key={task.id} className="p-4 bg-[#101522] border border-[#252C3D] hover:border-[#6366F1]/50 rounded-xl flex items-center justify-between transition">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{task.title}</span>
                <span className="text-[10px] bg-[#6366F1]/20 text-[#818CF8] px-2 py-0.5 rounded font-mono">
                  {task.type}
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">Complete {task.duration}s view to credit {task.points} pts</p>
            </div>

            <button
              onClick={() => startTask(task)}
              disabled={!!activeTask || loading || (currentUser.daily_task_count || 0) >= 130}
              className="px-4 py-2 bg-[#1E293B] hover:bg-[#6366F1] disabled:opacity-40 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
            >
              Start <span className="text-[#34D399]">+{task.points}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
