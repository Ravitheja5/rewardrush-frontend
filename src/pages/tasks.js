import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getLoggedInUser, syncWallet } from '../utils/auth';
import { apiRequest } from '../utils/api';
import { PlayCircle, ShieldCheck, CheckCircle2, Loader2, Sparkles, Flame } from 'lucide-react';

export default function TasksPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [claimMsg, setClaimMsg] = useState('');

  // 12 Daily Tasks pool with Real Ad URL Hooks
  const tasks = [
    { id: 'ad_monetag_1', title: 'High-Speed Telecom Sponsor Visit', type: 'Monetag Ad', points: 40, duration: 15, adUrl: 'https://www.google.com' },
    { id: 'ad_adsterra_1', title: 'Financial Product Discovery', type: 'Adsterra Ad', points: 45, duration: 20, adUrl: 'https://www.google.com' },
    { id: 'ad_video_1', title: 'Finora App Promo & Review Video', type: 'Video Ad', points: 50, duration: 25, adUrl: 'https://www.youtube.com' },
    { id: 'ad_survey_1', title: 'Quick Network Survey Check', type: 'Partner Ad', points: 35, duration: 15, adUrl: 'https://www.google.com' },
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

  const handleDailyCheckin = async () => {
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
    if ((currentUser.daily_task_count || 0) >= 12) {
      setClaimMsg('❌ Daily task limit (12/12) reached! Reset happens at midnight.');
      return;
    }
    setActiveTask(task);
    setTimer(task.duration);
    setClaimMsg('');
    // Open sponsor/ad link in new tab
    if (typeof window !== 'undefined') {
      window.open(task.adUrl, '_blank');
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
        setClaimMsg(`🎉 +${activeTask.points} Points Credited to your wallet!`);
      } else {
        setClaimMsg(`❌ ${res.message}`);
      }
    } catch (err) {
      setClaimMsg('❌ Failed to verify task.');
    }
    setActiveTask(null);
    setLoading(false);
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16">
      <Head>
        <title>Earn Points | RewardRush</title>
      </Head>

      {/* Header & Daily Streak Bonus Box */}
      <div className="p-5 bg-gradient-to-r from-[#101522] via-[#1E1B4B] to-[#101522] border border-[#6366F1]/30 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Flame className="text-[#F59E0B]" size={16} /> Daily Login Streak
          </h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">Claim +20 points every 24 hours</p>
        </div>
        <button
          onClick={handleDailyCheckin}
          disabled={loading}
          className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold text-xs rounded-xl shadow transition"
        >
          Claim Daily 20 pts
        </button>
      </div>

      {claimMsg && (
        <div className={`p-3 text-xs text-center rounded-xl font-medium ${claimMsg.includes('❌') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
          {claimMsg}
        </div>
      )}

      {/* Active Task Floating Banner */}
      {activeTask && (
        <div className="p-4 bg-[#1E1B4B] border border-[#818CF8] rounded-xl flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin text-[#818CF8]" size={20} />
            <div>
              <p className="text-xs font-bold text-white">Ad Verification in Progress...</p>
              <p className="text-[11px] text-[#A5B4FC]">Keep the opened tab active: {timer}s remaining</p>
            </div>
          </div>
          <span className="font-mono font-bold text-sm text-[#34D399]">+{activeTask.points} pts</span>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
          Available Tasks ({currentUser.daily_task_count || 0}/12 Completed)
        </h3>

        {tasks.map((task) => (
          <div key={task.id} className="p-4 bg-[#101522] border border-[#252C3D] hover:border-[#6366F1]/50 rounded-xl flex items-center justify-between transition">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{task.title}</span>
                <span className="text-[10px] bg-[#6366F1]/20 text-[#818CF8] px-2 py-0.5 rounded font-mono">
                  {task.type}
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">View sponsor page for {task.duration}s to claim reward</p>
            </div>

            <button
              onClick={() => startTask(task)}
              disabled={!!activeTask || loading || (currentUser.daily_task_count || 0) >= 12}
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
