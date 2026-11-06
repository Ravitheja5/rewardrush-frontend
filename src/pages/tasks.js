import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getLoggedInUser, syncWallet } from '../utils/auth';
import { ExternalLink, CheckCircle, Clock, ShieldAlert } from 'lucide-react';

export default function TasksPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [claiming, setClaiming] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  const sampleTasks = [
    { id: 'ad_task_1', title: 'Visit Partner Offer 1', points: 50, url: 'https://google.com' },
    { id: 'ad_task_2', title: 'Explore Trending Deals', points: 75, url: 'https://bing.com' },
    { id: 'ad_task_3', title: 'Sponsored Special Ad', points: 100, url: 'https://yahoo.com' },
  ];

  useEffect(() => {
    const u = getLoggedInUser();
    if (!u) {
      router.push('/auth');
      return;
    }
    setUser(u);
  }, [router]);

  useEffect(() => {
    let timer;
    if (secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleStartTask = async (task) => {
    try {
      const backendUrl = 'https://rewards-app-backend-lq2v.onrender.com';
      await fetch(`${backendUrl}/api/tasks/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: user.phone, taskId: task.id })
      });

      // Safe new tab opening without window hijacking
      window.open(task.url, '_blank', 'noopener,noreferrer');

      setActiveTask(task);
      setSecondsLeft(20);
      setAlertMsg(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClaim = async () => {
    if (secondsLeft > 0 || !activeTask) return;
    setClaiming(true);
    setAlertMsg(null);

    try {
      const backendUrl = 'https://rewards-app-backend-lq2v.onrender.com';
      const res = await fetch(`${backendUrl}/api/tasks/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: user.phone,
          taskId: activeTask.id,
          pointsReward: activeTask.points
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Claim failed');
      }

      syncWallet(data.user);
      setUser(data.user);
      setAlertMsg({ type: 'success', text: `+${activeTask.points} Points credited successfully!` });
      setActiveTask(null);
    } catch (err) {
      setAlertMsg({ type: 'error', text: err.message });
    } finally {
      setClaiming(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      <Head>
        <title>Tasks & Offers | RewardRush</title>
      </Head>

      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-black text-white">Daily Rewards Tasks</h1>
        <p className="text-xs text-[#94A3B8]">Click the offer, stay for 20 seconds, and claim your points securely.</p>
      </div>

      {alertMsg && (
        <div className={`p-3 rounded-xl text-xs text-center border ${
          alertMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {alertMsg.text}
        </div>
      )}

      {activeTask && (
        <div className="p-4 bg-[#1E1B4B] border border-[#6366F1]/50 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Clock size={16} className="text-[#818CF8]" /> Task In Progress: {activeTask.title}
            </h4>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">
              {secondsLeft > 0 ? `Wait ${secondsLeft}s before claiming...` : 'Ready to claim reward!'}
            </p>
          </div>
          <button
            onClick={handleClaim}
            disabled={secondsLeft > 0 || claiming}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              secondsLeft > 0
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg'
            }`}
          >
            <CheckCircle size={14} /> {claiming ? 'Claiming...' : `Claim ${activeTask.points} Pts`}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {sampleTasks.map((t) => (
          <div key={t.id} className="p-4 bg-[#101522] border border-[#252C3D] rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">{t.title}</h3>
              <span className="text-xs font-bold text-emerald-400">+{t.points} Points</span>
            </div>
            <button
              onClick={() => handleStartTask(t)}
              className="px-3.5 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
            >
              Start <ExternalLink size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
