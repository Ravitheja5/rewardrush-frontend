import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getAuthSession, fetchLiveUserFromDB } from '../utils/auth';
import { Sparkles, CheckCircle2, Clock, ExternalLink, RefreshCw } from 'lucide-react';

export default function TasksPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('daily');

  // Timer & Auto-credit State
  const [activeTask, setActiveTask] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [crediting, setCrediting] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const loadUserData = async () => {
    setLoading(true);
    const liveUser = await fetchLiveUserFromDB();
    if (!liveUser) {
      router.push('/auth');
      return;
    }
    setUser(liveUser);
    setLoading(false);
  };

  useEffect(() => {
    const session = getAuthSession();
    if (!session) {
      router.push('/auth');
      return;
    }
    loadUserData();
  }, [router]);

  // 60-Second Countdown & Automatic Coin Credit
  useEffect(() => {
    let timer;
    if (activeTask && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (activeTask && timeLeft === 0 && !crediting) {
      autoCreditTaskReward();
    }
    return () => clearInterval(timer);
  }, [activeTask, timeLeft]);

  const handleStartTask = (task) => {
    setActiveTask(task);
    setTimeLeft(60);
    setSuccessToast('');

    // Open advertiser link in a separate tab
    if (task.url) {
      window.open(task.url, '_blank');
    }
  };

  const autoCreditTaskReward = async () => {
    setCrediting(true);
    try {
      const res = await fetch('https://rewards-app-backend-lq2v.onrender.com/api/tasks/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: user.phone,
          points: activeTask.points || 38,
          taskId: activeTask.id
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setSuccessToast(`+${activeTask.points || 38} Points automatically credited to your balance!`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCrediting(false);
      setTimeout(() => {
        setActiveTask(null);
      }, 2500);
    }
  };

  // Generate 130 Clean Daily Tasks without third-party names
  const dailyTasks = Array.from({ length: 130 }, (_, i) => ({
    id: i + 1,
    title: `Daily Video Task #${i + 1}`,
    desc: 'Watch and engage for 60 seconds to earn points',
    points: 38,
    url: 'https://shopee.com.my'
  }));

  // Clean Partner Tasks without third-party names
  const specialTasks = [
    { id: 'p1', title: 'Special Financial Partner Task #1', desc: 'Browse curated partner services for 60 seconds', points: 250, url: 'https://google.com' },
    { id: 'p2', title: 'Special Financial Partner Task #2', desc: 'Explore top financial tools and benefits', points: 300, url: 'https://google.com' }
  ];

  if (loading && !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
        <RefreshCw className="animate-spin text-[#6366F1] mb-2" size={32} />
        <p className="text-xs text-[#94A3B8]">Loading tasks...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-28 px-4 pt-4 text-white">
      <Head>
        <title>Earn Rewards Hub | RewardRush</title>
      </Head>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252C3D] pb-5">
        <div>
          <h1 className="text-2xl font-black">Earn Rewards Hub</h1>
          <p className="text-xs text-[#94A3B8]">Target: 4,900 Points = ₹49 Unlimited Data Pack</p>
        </div>
        <div className="px-4 py-2 bg-[#101522] border border-[#252C3D] rounded-2xl flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-[#94A3B8] uppercase block font-bold">Live Balance</span>
            <span className="text-sm font-black text-emerald-400">{user.points} pts</span>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span className="font-semibold">{successToast}</span>
        </div>
      )}

      {/* Clean Tabs */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setActiveTab('daily')}
          className={'py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition ' + (
            activeTab === 'daily'
              ? 'bg-[#6366F1] border-[#6366F1] text-white shadow-lg shadow-[#6366F1]/20'
              : 'bg-[#101522] border-[#252C3D] text-[#94A3B8] hover:border-gray-600'
          )}
        >
          <Sparkles size={16} /> 130 Daily Tasks (38 Pts Each)
        </button>

        <button
          onClick={() => setActiveTab('special')}
          className={'py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition ' + (
            activeTab === 'special'
              ? 'bg-[#6366F1] border-[#6366F1] text-white shadow-lg shadow-[#6366F1]/20'
              : 'bg-[#101522] border-[#252C3D] text-[#94A3B8] hover:border-gray-600'
          )}
        >
          <Sparkles size={16} /> Special Bonus Tasks
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {(activeTab === 'daily' ? dailyTasks : specialTasks).map((task) => (
          <div
            key={task.id}
            className="p-4 bg-[#101522] border border-[#252C3D] rounded-2xl flex items-center justify-between gap-4 hover:border-gray-700 transition"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold">{task.title}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6366F1]/15 text-[#818CF8]">
                  60s Timer
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">{task.desc}</p>
              <span className="inline-block text-xs font-bold text-emerald-400">
                +{task.points} Points
              </span>
            </div>

            <button
              onClick={() => handleStartTask(task)}
              disabled={activeTask !== null}
              className="px-5 py-2.5 bg-[#6366F1] hover:bg-[#4F46E5] disabled:opacity-40 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-md shadow-[#6366F1]/20"
            >
              Start <ExternalLink size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Floating Auto-Credit Countdown Modal */}
      {activeTask && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <div className="bg-[#101522]/95 backdrop-blur-md border border-[#6366F1] p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#6366F1]/20 text-[#6366F1] flex items-center justify-center border border-[#6366F1]/30">
                <Clock className="animate-spin" size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold">{activeTask.title} in progress</h4>
                <p className="text-[11px] text-[#94A3B8]">
                  {timeLeft > 0 ? (
                    <>Wait <strong className="text-white">{timeLeft}s</strong>. Coins will credit automatically!</>
                  ) : crediting ? (
                    <span className="text-amber-400 font-semibold">Crediting coins to database...</span>
                  ) : (
                    <span className="text-emerald-400 font-semibold">Credited successfully!</span>
                  )}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-emerald-400 block">+{activeTask.points} pts</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
