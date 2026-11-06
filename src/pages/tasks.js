import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getAuthSession, fetchLiveUserFromDB } from '../utils/auth';
import { ExternalLink, CheckCircle, Clock, ShieldAlert } from 'lucide-react';

export default function TasksPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [claiming, setClaiming] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const adWindowRef = useRef(null);

  // FIXED ADSTERRA SMARTLINKS (Rule-based)
  const availableTasks = [
    {
      id: 'adsterra_task_1',
      title: 'Adsterra Smartlink Offer 1',
      points: 100,
      staySeconds: 60,
      url: 'https://asiafilm.org/4/2b6d7c7eb71fdb958e6581a1fabc946a'
    },
    {
      id: 'adsterra_task_2',
      title: 'Adsterra Smartlink Offer 2',
      points: 75,
      staySeconds: 60,
      url: 'https://asiafilm.org/4/2b6d7c7eb71fdb958e6581a1fabc946a'
    },
    {
      id: 'adsterra_task_3',
      title: 'Adsterra Smartlink Offer 3',
      points: 50,
      staySeconds: 60,
      url: 'https://asiafilm.org/4/2b6d7c7eb71fdb958e6581a1fabc946a'
    }
  ];

  const loadData = async () => {
    const session = getAuthSession();
    if (!session || !session.phone) {
      router.push('/auth');
      return;
    }
    const liveUser = await fetchLiveUserFromDB();
    if (liveUser) setUser(liveUser);
  };

  useEffect(() => {
    loadData();
  }, [router]);

  // Anti-Cheat: 60s Stay & Tab Close Detection
  useEffect(() => {
    let timer;
    if (activeTask && secondsLeft > 0) {
      timer = setInterval(() => {
        if (adWindowRef.current && adWindowRef.current.closed) {
          setStatusMsg({
            type: 'error',
            text: 'Offer window close chesaru! Poorthiga 60 seconds stay mandatory. Task reset aindi.'
          });
          setActiveTask(null);
          setSecondsLeft(0);
          return;
        }
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeTask, secondsLeft]);

  const handleStartTask = (task) => {
    setStatusMsg(null);
    const win = window.open(task.url, '_blank', 'noopener=false');
    adWindowRef.current = win;
    setActiveTask(task);
    setSecondsLeft(task.staySeconds);
  };

  const handleClaimPoints = async () => {
    if (secondsLeft > 0 || !activeTask || !user) return;
    setClaiming(true);
    setStatusMsg(null);

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
        throw new Error(data.message || 'Task claim cheyadam fail aindi');
      }

      setUser(data.user);
      setStatusMsg({
        type: 'success',
        text: `🎉 +${activeTask.points} Points direct ga PostgreSQL database balance ki credit ayyayi!`
      });
      setActiveTask(null);

      if (adWindowRef.current && !adWindowRef.current.closed) {
        adWindowRef.current.close();
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setClaiming(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-white">
        <p className="text-xs text-[#94A3B8]">Database nundi live data fetch chesthunnam...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-28 px-4 pt-4">
      <Head>
        <title>Adsterra Tasks | RewardRush</title>
      </Head>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">Daily Tasks & Ads</h1>
          <p className="text-xs text-[#94A3B8]">Mee Adsterra Smartlinks tho 60 seconds tasks</p>
        </div>
        <div className="px-3 py-1.5 bg-[#1E1B4B] border border-[#6366F1]/30 rounded-xl text-right">
          <span className="text-[10px] text-[#94A3B8] block">Live DB Balance</span>
          <span className="text-sm font-black text-emerald-400">{user.points} pts</span>
        </div>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-xl text-xs text-center border font-medium ${
          statusMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          {statusMsg.text}
        </div>
      )}

      {/* ACTIVE TASK WITH 60s COUNTDOWN */}
      {activeTask && (
        <div className="p-5 bg-[#1E1B4B] border-2 border-[#6366F1] rounded-2xl space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Clock size={16} className="text-[#818CF8] animate-spin" /> {activeTask.title}
            </span>
            <span className="text-xs font-bold text-amber-400">+{activeTask.points} Pts</span>
          </div>

          <p className="text-xs text-[#94A3B8]">
            {secondsLeft > 0 ? (
              <span>Ad page open lo unchandi: <strong className="text-amber-400 text-sm">{secondsLeft}s</strong></span>
            ) : (
              <span className="text-emerald-400 font-bold">✅ 60 seconds finished! Claim points.</span>
            )}
          </p>

          <button
            onClick={handleClaimPoints}
            disabled={secondsLeft > 0 || claiming}
            className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
              secondsLeft > 0
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg'
            }`}
          >
            <CheckCircle size={15} /> {claiming ? 'Saving in PostgreSQL...' : `Claim ${activeTask.points} Points`}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {availableTasks.map((t) => (
          <div key={t.id} className="p-4 bg-[#101522] border border-[#252C3D] hover:border-[#6366F1]/50 rounded-2xl flex items-center justify-between transition">
            <div>
              <h3 className="text-sm font-bold text-white">{t.title}</h3>
              <p className="text-xs text-[#94A3B8]">Anti-Cheat Active • 60 Sec Stay Required</p>
              <span className="text-xs font-bold text-emerald-400">+{t.points} Points</span>
            </div>
            <button
              onClick={() => handleStartTask(t)}
              disabled={activeTask !== null}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                activeTask !== null ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-[#6366F1] text-white hover:bg-[#4F46E5]'
              }`}
            >
              Start <ExternalLink size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
