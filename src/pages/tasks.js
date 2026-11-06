import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getLoggedInUser, syncWallet } from '../utils/auth';
import { apiRequest } from '../utils/api';
import { Flame, PlayCircle, Loader2, Zap, CheckCircle2, XCircle, ExternalLink, ShieldCheck } from 'lucide-react';

export default function TasksPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [claimMsg, setClaimMsg] = useState('');

  // 130 Dynamic Tasks Pool (Different High-Paying Ad Networks)
  const baseAdTypes = [
    { title: 'Monetag Rewarded Video Stream', type: 'Monetag Video', points: 45, duration: 15, url: 'https://www.highcpmgate.com/sample_monetag' },
    { title: 'Adsterra 5G Telecom Sponsor Ad', type: 'Adsterra Smartlink', points: 40, duration: 15, url: 'https://www.profitablecpmrate.com/sample_adsterra' },
    { title: 'Fintech Credit Score & Card Discovery', type: 'CPA Offer', points: 45, duration: 20, url: 'https://groww.in' },
    { title: 'Unlimited High-Speed Data Offer Check', type: 'Direct Ad', points: 35, duration: 12, url: 'https://jio.com' },
    { title: 'Monetag Interstitial High CPM Stream', type: 'Monetag Banner', points: 40, duration: 15, url: 'https://www.highcpmgate.com/sample_monetag2' }
  ];

  // 130 Tasks List generate chesthundhi
  const dynamicTasksList = Array.from({ length: 130 }, (_, index) => {
    const template = baseAdTypes[index % baseAdTypes.length];
    return {
      id: `task_dyn_${index + 1}`,
      title: `${template.title} #${index + 1}`,
      type: template.type,
      points: template.points,
      duration: template.duration,
      url: template.url
    };
  });

  useEffect(() => {
    const user = getLoggedInUser();
    if (!user) {
      router.push('/auth');
    } else {
      setCurrentUser(user);
    }
  }, [router]);

  // Robust Timestamp-Based Timer (Window Switch Chesina Seconds Thaggavu / Aagavu)
  useEffect(() => {
    if (!activeTask) return;

    const endTime = Date.now() + activeTask.duration * 1000;
    setTimer(activeTask.duration);

    const interval = setInterval(() => {
      const remainingSeconds = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setTimer(remainingSeconds);

      if (remainingSeconds <= 0) {
        clearInterval(interval);
        handleCompleteTask();
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

  const startTask = (task) => {
    if ((currentUser.daily_task_count || 0) >= 130) {
      setClaimMsg('❌ Mee daily limit (130/130 tasks) poorthi ayindi! Midnight reset avthundi.');
      return;
    }
    setActiveTask(task);
    setClaimMsg('');
    // Open Ad in new tab
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
        setClaimMsg(`🎉 +${activeTask.points} Points Mee Wallet Lo Add Ayyayi!`);
      } else {
        setClaimMsg(`❌ ${res.message}`);
      }
    } catch (err) {
      setClaimMsg('❌ Verification server issue. Try again.');
    }
    setActiveTask(null);
    setLoading(false);
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-24">
      <Head>
        <title>Tasks & Real Ads | RewardRush</title>
      </Head>

      {/* Daily Streak Card */}
      <div className="p-5 bg-gradient-to-r from-[#101522] via-[#1E1B4B] to-[#101522] border border-[#6366F1]/30 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Flame className="text-amber-400" size={16} /> Daily Login Streak
          </h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">Collect free +25 points every day</p>
        </div>
        <button
          onClick={handleDailyCheckin}
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

      {/* FULL-SCREEN AD COUNTDOWN TIMER OVERLAY */}
      {activeTask && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#101522] border-2 border-[#818CF8] rounded-2xl p-6 text-center space-y-5 shadow-2xl animate-fade-in">
            <div className="w-16 h-16 mx-auto bg-[#818CF8]/20 text-[#818CF8] rounded-full flex items-center justify-center">
              <span className="text-2xl font-black font-mono">{timer}s</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Sponsor Ad Verification in Progress</h3>
              <p className="text-xs text-[#94A3B8]">
                New tab lo ad load avuthundi. Ee screen close cheyakunda {timer} seconds wait cheyandi.
              </p>
            </div>

            <div className="w-full bg-[#1E293B] h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#818CF8] to-[#34D399] h-full transition-all duration-300"
                style={{ width: `${((activeTask.duration - timer) / activeTask.duration) * 100}%` }}
              />
            </div>

            <div className="p-3 bg-[#0B0E17] rounded-xl flex items-center justify-between text-xs text-[#94A3B8]">
              <span>Reward Points:</span>
              <span className="font-bold text-[#34D399] font-mono">+{activeTask.points} Points</span>
            </div>

            <p className="text-[11px] text-[#64748B] flex items-center justify-center gap-1">
              <ShieldCheck size={14} className="text-[#34D399]" /> IST Verified Instant Credit
            </p>
          </div>
        </div>
      )}

      {/* 130 TASKS LIST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
            Daily Earning Tasks Pool ({currentUser.daily_task_count || 0} / 130 Done)
          </h3>
          <span className="text-xs font-bold text-[#34D399]">
            Goal: 4,900 pts (₹49 Data Pack)
          </span>
        </div>

        <div className="space-y-2.5">
          {dynamicTasksList.map((task, idx) => {
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
                      {task.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8]">Watch sponsor ad for {task.duration}s to credit points</p>
                </div>

                {isCompleted ? (
                  <span className="text-xs font-bold text-[#34D399] flex items-center gap-1">
                    <CheckCircle2 size={16} /> Completed
                  </span>
                ) : (
                  <button
                    onClick={() => startTask(task)}
                    disabled={!!activeTask || loading}
                    className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] disabled:opacity-40 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow"
                  >
                    Start <span className="text-[#34D399]">+{task.points}</span>
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
