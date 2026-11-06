import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getLoggedInUser, syncWallet } from '../utils/auth';
import { apiRequest } from '../utils/api';
import { Flame, Play, Loader2, Sparkles, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function TasksPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [claimMsg, setClaimMsg] = useState('');
  const [taskStartTime, setTaskStartTime] = useState(null);

  // High-CPM Ad Link (130 tasks = 5,200 points total, daily ₹49 data pack guaranteed)
  const LIVE_AD_URL = 'https://asiafilm.org/4/2a9f2d1477def572c8eea4e320a1ae30';

  const dailyAdsList = Array.from({ length: 130 }, (_, index) => ({
    id: `ad_task_${index + 1}`,
    number: index + 1,
    title: `Sponsor Ad Stream #${index + 1}`,
    points: 40,
    duration: 15,
    url: LIVE_AD_URL
  }));

  // Selected 2 High-Reward vCommission Campaigns
  const partnerTasks = [
    {
      id: 'vcomm_13145',
      title: 'Fibe Quick Eligibility Check',
      desc: 'Fill basic salary/employment details form',
      points: 2500,
      badge: 'CPL - High Reward',
      url: 'https://network.vcommission.com/click'
    },
    {
      id: 'vcomm_12592',
      title: 'Xcelviewpoint Survey Profile Sign-up',
      desc: 'Complete simple survey registration to qualify',
      points: 1200,
      badge: 'CPR - Instant Sign-up',
      url: 'https://network.vcommission.com/click'
    }
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
    if (!activeTask) return;

    const endTime = Date.now() + activeTask.duration * 1000;
    setTimer(activeTask.duration);

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setTimer(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        handleCompleteAdTask();
      }
    }, 500);

    return () => clearInterval(interval);
  }, [activeTask]);

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

  const startDailyAdTask = (task) => {
    if ((currentUser.daily_task_count || 0) >= 130) {
      setClaimMsg('❌ Daily limit (130/130 ads) completed for today! Mid-night reset avthundi.');
      return;
    }
    setTaskStartTime(Date.now());
    setActiveTask(task);
    setClaimMsg('');
    if (typeof window !== 'undefined') {
      window.open(task.url, '_blank');
    }
  };

  const handleCompleteAdTask = async () => {
    if (!activeTask || !currentUser) return;
    setLoading(true);

    try {
      const res = await apiRequest('/api/tasks/complete', 'POST', {
        userId: currentUser.id,
        taskId: activeTask.id,
        points: activeTask.points,
        clientStartedAt: taskStartTime
      });

      if (res.success) {
        syncWallet(res.user);
        setCurrentUser(res.user);
        setClaimMsg(`🎉 +${activeTask.points} Points Credited to Wallet!`);
      } else {
        setClaimMsg(`❌ ${res.message}`);
      }
    } catch (err) {
      setClaimMsg('❌ Verification issue. Try again.');
    }

    setActiveTask(null);
    setLoading(false);
  };

  const startPartnerTask = (task) => {
    if (!currentUser) return;
    const finalTrackingUrl = `${task.url}?aff_id=133655&sub1=${currentUser.id}&aff_sub=${currentUser.id}`;
    window.open(finalTrackingUrl, '_blank');
    setClaimMsg(`🚀 '${task.title}' open ayindi! Complete ayyaka points wallet lo credit avthayi.`);
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-24">
      <Head>
        <title>Tasks & Earnings | RewardRush</title>
      </Head>

      {/* Daily Streak Card */}
      <div className="p-5 bg-gradient-to-r from-[#101522] via-[#1E1B4B] to-[#101522] border border-[#6366F1]/30 rounded-2xl flex items-center justify-between shadow-lg">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Flame className="text-amber-400" size={16} /> Daily Login Streak
          </h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">Collect free +25 points every day</p>
        </div>
        <button
          onClick={handleDailyCheckin}
          disabled={loading || !!activeTask}
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

      {/* 15s Timer Notification */}
      {activeTask && (
        <div className="p-4 bg-[#1E1B4B] border-2 border-[#818CF8] rounded-2xl flex items-center justify-between shadow-2xl animate-pulse">
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin text-[#818CF8]" size={22} />
            <div>
              <p className="text-xs font-bold text-white">Ad Verification Active</p>
              <p className="text-[11px] text-[#A5B4FC]">Please wait {timer}s without closing app</p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono text-xl font-black text-[#34D399]">{timer}s</span>
            <span className="block text-[10px] text-[#94A3B8]">+{activeTask.points} pts</span>
          </div>
        </div>
      )}

      {/* SECTION 1: 2 VCOMMISSION HIGH REWARD OFFERS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
            High-Reward Partner Tasks (vCommission)
          </h3>
          <span className="text-xs font-bold text-[#34D399]">
            Balance: {currentUser.points || 0} pts
          </span>
        </div>

        <div className="space-y-2.5">
          {partnerTasks.map((task) => (
            <div 
              key={task.id}
              className="p-4 bg-[#101522] border border-[#252C3D] hover:border-[#6366F1]/50 rounded-xl flex items-center justify-between transition gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white">{task.title}</h4>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono">
                    {task.badge}
                  </span>
                </div>
                <p className="text-[11px] text-[#94A3B8]">{task.desc}</p>
              </div>

              <button
                onClick={() => startPartnerTask(task)}
                className="shrink-0 px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow"
              >
                Claim <span className="text-[#34D399]">+{task.points} pts</span> <ExternalLink size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: 130 DAILY AD STREAMS (TOTAL 5,200 POINTS) */}
      <div className="space-y-3 pt-4 border-t border-[#252C3D]">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#818CF8]" /> Daily Ad Streams ({currentUser.daily_task_count || 0}/130 Completed)
          </h3>
          <span className="text-xs font-bold text-[#818CF8]">
            Goal: 4,900 pts (₹49 Data Pack)
          </span>
        </div>

        <div className="space-y-2.5">
          {dailyAdsList.map((task, idx) => {
            const isCompleted = idx < (currentUser.daily_task_count || 0);

            return (
              <div 
                key={task.id}
                className={`p-4 bg-[#101522] border rounded-xl flex items-center justify-between transition ${
                  isCompleted ? 'border-[#1C2231] opacity-50' : 'border-[#252C3D] hover:border-[#6366F1]/50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{task.title}</span>
                    <span className="text-[10px] bg-[#6366F1]/20 text-[#818CF8] px-2 py-0.5 rounded font-mono">
                      15s View
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8]">View sponsor ad for 15 seconds to credit +40 points</p>
                </div>

                {isCompleted ? (
                  <span className="text-xs font-bold text-[#34D399] flex items-center gap-1 shrink-0">
                    <CheckCircle2 size={16} /> Done
                  </span>
                ) : (
                  <button
                    onClick={() => startDailyAdTask(task)}
                    disabled={!!activeTask || loading || (currentUser.daily_task_count || 0) >= 130}
                    className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] disabled:opacity-40 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow shrink-0"
                  >
                    <Play size={12} fill="white" /> Start <span className="text-[#34D399]">+{task.points}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
