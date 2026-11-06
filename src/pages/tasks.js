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

  // 1. Mana 2 Live High-CPM Ad Streams
  const adTasks = [
    {
      id: 'ad_stream_1',
      title: 'Telecom Ad Stream #1',
      desc: 'Watch sponsor video stream for 15 seconds',
      points: 40,
      duration: 15,
      url: 'https://asiafilm.org/4/2a9f2d1477def572c8eea4e320a1ae30'
    },
    {
      id: 'ad_stream_2',
      title: 'Telecom Ad Stream #2',
      desc: 'Watch sponsor video stream for 15 seconds',
      points: 40,
      duration: 15,
      url: 'https://asiafilm.org/4/2a9f2d1477def572c8eea4e320a1ae30'
    }
  ];

  // 2. vCommission Testing Kosam Select Chesina 2 Partner Campaigns
  const partnerTasks = [
    {
      id: 'vcomm_13145',
      campaignId: '13145',
      title: 'Fibe.in Quick Eligibility Check',
      desc: 'Fill basic salary details to verify instant eligibility (High Payout)',
      points: 2500,
      badge: 'CPL - ₹315 Payout',
      url: 'https://network.vcommission.com/click'
    },
    {
      id: 'vcomm_12592',
      campaignId: '12592',
      title: 'Xcelviewpoint Survey Profile Sign-up',
      desc: 'Complete simple survey registration to qualify',
      points: 1200,
      badge: 'CPR - ₹30 Payout',
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

  // Timer Countdown Logic for Ad Tasks
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

  const startAdTask = (task) => {
    if ((currentUser.daily_task_count || 0) >= 130) {
      setClaimMsg('❌ Daily limit reached for today! Reset at midnight.');
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
        setClaimMsg(`🎉 +${activeTask.points} Points credited to wallet!`);
      } else {
        setClaimMsg(`❌ ${res.message}`);
      }
    } catch (err) {
      setClaimMsg('❌ Verification issue. Please try again.');
    }

    setActiveTask(null);
    setLoading(false);
  };

  const startPartnerTask = (task) => {
    if (!currentUser) return;
    const finalTrackingUrl = `${task.url}?aff_id=133655&sub1=${currentUser.id}&aff_sub=${currentUser.id}`;
    window.open(finalTrackingUrl, '_blank');
    setClaimMsg(`🚀 '${task.title}' open ayindi! Verification tarvatha wallet lo points auto-credit avthayi.`);
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-24">
      <Head>
        <title>Tasks & Earnings | RewardRush</title>
      </Head>

      {/* Daily Bonus Banner */}
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

      {/* Active Ad Countdown Card */}
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

      {/* SECTION 1: MANA 2 AD STREAM TASKS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#818CF8]" /> Daily Ad Streams (Instant Verification)
          </h3>
          <span className="text-xs font-bold text-[#34D399]">Wallet: {currentUser.points || 0} pts</span>
        </div>

        <div className="space-y-2.5">
          {adTasks.map((task) => (
            <div 
              key={task.id}
              className="p-4 bg-[#101522] border border-[#252C3D] hover:border-[#6366F1]/50 rounded-xl flex items-center justify-between transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{task.title}</span>
                  <span className="text-[10px] bg-[#6366F1]/20 text-[#818CF8] px-2 py-0.5 rounded font-mono">
                    15s Stream
                  </span>
                </div>
                <p className="text-[11px] text-[#94A3B8]">{task.desc}</p>
              </div>

              <button
                onClick={() => startAdTask(task)}
                disabled={!!activeTask || loading || (currentUser.daily_task_count || 0) >= 130}
                className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] disabled:opacity-40 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow shrink-0"
              >
                <Play size={12} fill="white" /> Start <span className="text-[#34D399]">+{task.points}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: vCOMMISSION 2 APPROVED OFFERS */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
          High Reward Partner Campaigns (vCommission)
        </h3>

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
                Claim <span className="text-[#34D399]">+{task.points}</span> <ExternalLink size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
