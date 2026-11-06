import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getAuthSession, fetchLiveUserFromDB } from '../utils/auth';
import { ExternalLink, CheckCircle, Clock, Zap, Gift, Play, ShieldAlert } from 'lucide-react';

export default function EarnPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [claiming, setClaiming] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const adWindowRef = useRef(null);

  const smartlinkUrl = 'https://asiafilm.org/4/2b6d7c7eb71fdb958e6581a1fabc946a';

  const earnTasks = [
    { id: 'ad_offer_1', title: 'Sponsored Partner Offer 1', points: 100, tag: 'High Reward', url: smartlinkUrl },
    { id: 'ad_offer_2', title: 'Interactive Web Exploration', points: 75, tag: 'Fast Claim', url: smartlinkUrl },
    { id: 'ad_offer_3', title: 'Featured Brand Promotion', points: 50, tag: 'Daily Task', url: smartlinkUrl },
    { id: 'ad_offer_4', title: 'Special Telecom Sponsor', points: 100, tag: 'Special', url: smartlinkUrl },
  ];

  const loadUserData = async () => {
    const session = getAuthSession();
    if (!session || !session.phone) {
      router.push('/auth');
      return;
    }
    const liveUser = await fetchLiveUserFromDB();
    if (liveUser) {
      setUser(liveUser);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUserData();
  }, [router]);

  // Mandatory 60-second timer & window monitoring
  useEffect(() => {
    let timer;
    if (activeTask && secondsLeft > 0) {
      timer = setInterval(() => {
        // If user prematurely closes the tab, cancel the task
        if (adWindowRef.current && adWindowRef.current.closed) {
          setStatusMsg({
            type: 'error',
            text: 'Offer tab ventane close chesaru! Poorthiga 60 seconds screen meeda undali. Task cancelled.'
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
    const win = window.open(task.url, '_blank', 'width=1000,height=700');
    adWindowRef.current = win;
    setActiveTask(task);
    setSecondsLeft(60); // Strict 60s
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
        throw new Error(data.message || 'Points claim failed');
      }

      setUser(data.user);
      setStatusMsg({
        type: 'success',
        text: `🎉 Super! +${activeTask.points} Points direct ga mee DB balance ki add ayyayi!`
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-white">
        <p className="text-xs text-[#94A3B8]">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-28 px-4 pt-4">
      <Head>
        <title>Earn Points | RewardRush</title>
      </Head>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">Earn Points Hub</h1>
          <p className="text-xs text-[#94A3B8]">Complete 60s sponsor tasks & get real recharge points</p>
        </div>
        <div className="px-3 py-1.5 bg-[#1E1B4B] border border-[#6366F1]/30 rounded-xl text-right">
          <span className="text-[10px] text-[#94A3B8] block">Live Balance</span>
          <span className="text-sm font-black text-white">{user?.points || 0} pts</span>
        </div>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-xl text-xs text-center border font-medium ${
          statusMsg.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          {statusMsg.text}
        </div>
      )}

      {/* ACTIVE RUNNING TASK BANNER */}
      {activeTask && (
        <div className="p-5 bg-gradient-to-r from-[#1E1B4B] to-[#101522] border-2 border-[#6366F1] rounded-2xl space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Clock size={16} className="text-[#818CF8] animate-spin" /> {activeTask.title}
            </span>
            <span className="text-xs font-black text-amber-400">+{activeTask.points} Pts</span>
          </div>

          <p className="text-xs text-[#94A3B8]">
            {secondsLeft > 0 ? (
              <span>Ad tab close cheyakunda screen meeda unchandi: <strong className="text-amber-400 text-sm">{secondsLeft}s</strong></span>
            ) : (
              <span className="text-emerald-400 font-bold">✅ 60 seconds finished! Claim your points below.</span>
            )}
          </p>

          <button
            onClick={handleClaimPoints}
            disabled={secondsLeft > 0 || claiming}
            className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
              secondsLeft > 0
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
            }`}
          >
            <CheckCircle size={15} /> {claiming ? 'Saving to Database...' : `Claim ${activeTask.points} Points`}
          </button>
        </div>
      )}

      {/* TASK LIST */}
      <div className="space-y-3">
        <h2 className="text-xs uppercase font-bold text-[#94A3B8] tracking-wider">Available Daily Offers</h2>
        {earnTasks.map((task) => (
          <div
            key={task.id}
            className="p-4 bg-[#101522] border border-[#252C3D] hover:border-[#6366F1]/50 rounded-2xl flex items-center justify-between transition"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{task.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#6366F1]/20 text-[#818CF8] font-semibold border border-[#6366F1]/30">
                  {task.tag}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">Requires 60s view time • Instant DB credit</p>
              <span className="text-xs font-bold text-emerald-400">+{task.points} Points</span>
            </div>

            <button
              onClick={() => handleStartTask(task)}
              disabled={activeTask !== null}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
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
