import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getAuthSession, fetchLiveUserFromDB } from '../utils/auth';
import { ExternalLink, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function TasksPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isTabActive, setIsTabActive] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  const adWindowRef = useRef(null);

  const sampleTasks = [
    { id: 'ad_task_1', title: 'Sponsored High-Value Offer', points: 100, url: 'https://asiafilm.org/4/2b6d7c7eb71fdb958e6581a1fabc946a' },
    { id: 'ad_task_2', title: 'Explore Premium Brand Deals', points: 75, url: 'https://asiafilm.org/4/2b6d7c7eb71fdb958e6581a1fabc946a' },
    { id: 'ad_task_3', title: 'Special Partner Promotion', points: 50, url: 'https://asiafilm.org/4/2b6d7c7eb71fdb958e6581a1fabc946a' },
  ];

  useEffect(() => {
    const init = async () => {
      const session = getAuthSession();
      if (!session) {
        router.push('/auth');
        return;
      }
      const liveUser = await fetchLiveUserFromDB();
      if (liveUser) setUser(liveUser);
    };
    init();
  }, [router]);

  // Strict 60-second timer with tab active check
  useEffect(() => {
    let timer;
    if (activeTask && secondsLeft > 0) {
      timer = setInterval(() => {
        // Check if ad window was closed prematurely
        if (adWindowRef.current && adWindowRef.current.closed) {
          setIsTabActive(false);
          setAlertMsg({ 
            type: 'error', 
            text: 'Offer tab close chesaru! Poorthiga 60 seconds chudalsinde. Task reset aindi.' 
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

  const handleStartTask = async (task) => {
    try {
      const backendUrl = 'https://rewards-app-backend-lq2v.onrender.com';
      await fetch(`${backendUrl}/api/tasks/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: user.phone, taskId: task.id })
      });

      // Open offer in dedicated tracked window
      const openedWin = window.open(task.url, '_blank', 'width=1000,height=700,noopener=false');
      adWindowRef.current = openedWin;

      setActiveTask(task);
      setSecondsLeft(60); // 60 SECONDS MANDATORY
      setIsTabActive(true);
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

      setUser(data.user);
      setAlertMsg({ type: 'success', text: `🎉 +${activeTask.points} Points credited directly to DB!` });
      setActiveTask(null);
      if (adWindowRef.current && !adWindowRef.current.closed) {
        adWindowRef.current.close();
      }
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
        <title>Daily Tasks | RewardRush</title>
      </Head>

      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-black text-white">Daily Rewards Tasks</h1>
        <p className="text-xs text-[#94A3B8]">
          Offer link open chesi kaniisam 60 seconds screen meeda undali. Ventane close chesthe task cancel avuthundhi.
        </p>
      </div>

      {alertMsg && (
        <div className={`p-3.5 rounded-xl text-xs text-center border font-medium ${
          alertMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          {alertMsg.text}
        </div>
      )}

      {activeTask && (
        <div className="p-5 bg-[#1E1B4B] border-2 border-[#6366F1] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <Clock size={16} className="text-[#818CF8] animate-spin" /> Task Running: {activeTask.title}
            </h4>
            <p className="text-xs text-[#94A3B8]">
              {secondsLeft > 0 ? (
                <span>Offer page open lo unchandi. Inka <strong className="text-amber-400">{secondsLeft}s</strong> aagali.</span>
              ) : (
                <span className="text-emerald-400 font-bold">✅ 60 seconds complete aindi! Ippudu claim cheskondi.</span>
              )}
            </p>
          </div>

          <button
            onClick={handleClaim}
            disabled={secondsLeft > 0 || claiming}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              secondsLeft > 0
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
            }`}
          >
            <CheckCircle size={15} /> {claiming ? 'Claiming...' : `Claim ${activeTask.points} Pts`}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {sampleTasks.map((t) => (
          <div key={t.id} className="p-4 bg-[#101522] border border-[#252C3D] hover:border-[#6366F1]/50 transition rounded-2xl flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-white">{t.title}</h3>
              <div className="flex items-center gap-3 text-xs">
                <span className="font-bold text-emerald-400">+{t.points} Points</span>
                <span className="text-[#94A3B8]">• 60 Sec Stay Required</span>
              </div>
            </div>
            <button
              onClick={() => handleStartTask(t)}
              disabled={activeTask !== null}
              className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition ${
                activeTask !== null
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-md'
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
