import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getAuthSession, fetchLiveUserFromDB } from '../utils/auth';
import { ExternalLink, CheckCircle, Clock, Zap, Award, Flame } from 'lucide-react';

export default function TasksPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('smartlinks'); // 'smartlinks' (Stream 1) vs 'partner' (Stream 2)
  const [activeTask, setActiveTask] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [claiming, setClaiming] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const adWindowRef = useRef(null);

  const smartlinkUrl = 'https://asiafilm.org/4/2b6d7c7eb71fdb958e6581a1fabc946a';

  // STREAM 1: Daily Adsterra Smartlink Tasks (Target: 130 Tasks/Day @ 40 pts each)
  const smartlinkTasks = Array.from({ length: 30 }, (_, i) => ({
    id: `smartlink_task_${i + 1}`,
    title: `Sponsor Ad Task #${i + 1}`,
    points: 40,
    seconds: 60,
    url: smartlinkUrl,
    type: 'Smartlink 60s'
  }));

  // STREAM 2: High Commission Affiliate Offers (Fast Points to reach ₹49 Pack)
  const highCommissionOffers = [
    {
      id: 'cpa_offer_1',
      title: 'FinTech Savings App Install & Explore',
      points: 500,
      seconds: 60,
      rewardText: '₹5.00 Value',
      url: smartlinkUrl,
      type: 'High Commission'
    },
    {
      id: 'cpa_offer_2',
      title: 'Instant Credit Score Check Partner',
      points: 400,
      seconds: 60,
      rewardText: '₹4.00 Value',
      url: smartlinkUrl,
      type: 'High Commission'
    },
    {
      id: 'cpa_offer_3',
      title: 'Verified Cashback Portal Sign Up',
      points: 350,
      seconds: 60,
      rewardText: '₹3.50 Value',
      url: smartlinkUrl,
      type: 'High Commission'
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

  // Mandatory 60s view & Tab close anti-cheat
  useEffect(() => {
    let timer;
    if (activeTask && secondsLeft > 0) {
      timer = setInterval(() => {
        if (adWindowRef.current && adWindowRef.current.closed) {
          setStatusMsg({
            type: 'error',
            text: 'Offer tab ventane close chesaru! Poorthiga 60 seconds aagalsinde. Task reset aindi.'
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
    setSecondsLeft(task.seconds);
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
        text: `🎉 +${activeTask.points} Points direct ga mee PostgreSQL DB balance ki add ayyayi!`
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
        <p className="text-xs text-[#94A3B8]">Loading live balance from DB...</p>
      </div>
    );
  }

  const tasksToDisplay = activeTab === 'smartlinks' ? smartlinkTasks : highCommissionOffers;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-28 px-4 pt-4">
      <Head>
        <title>Tasks & Offers | RewardRush</title>
      </Head>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">Daily Tasks Hub</h1>
          <p className="text-xs text-[#94A3B8]">Complete tasks to claim ₹49 Data Pack (4,900 pts)</p>
        </div>
        <div className="px-3 py-1.5 bg-[#1E1B4B] border border-[#6366F1]/30 rounded-xl text-right">
          <span className="text-[10px] text-[#94A3B8] block">Live Balance</span>
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

      {/* 2 COMMISSION STREAM TABS */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#101522] border border-[#252C3D] rounded-2xl">
        <button
          onClick={() => setActiveTab('smartlinks')}
          className={`py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'smartlinks' ? 'bg-[#6366F1] text-white shadow-md' : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <Zap size={14} /> 60s Ad Tasks (Daily 130)
        </button>
        <button
          onClick={() => setActiveTab('partner')}
          className={`py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'partner' ? 'bg-amber-500 text-black shadow-md' : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <Flame size={14} /> High-Commission Offers
        </button>
      </div>

      {/* ACTIVE RUNNING TASK BANNER */}
      {activeTask && (
        <div className="p-5 bg-[#1E1B4B] border-2 border-[#6366F1] rounded-2xl space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Clock size={16} className="text-[#818CF8] animate-spin" /> {activeTask.title}
            </span>
            <span className="text-xs font-black text-amber-400">+{activeTask.points} Pts</span>
          </div>

          <p className="text-xs text-[#94A3B8]">
            {secondsLeft > 0 ? (
              <span>Ad page open lo unchandi: <strong className="text-amber-400 text-sm">{secondsLeft}s</strong></span>
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
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg'
            }`}
          >
            <CheckCircle size={15} /> {claiming ? 'Updating DB...' : `Claim ${activeTask.points} Points`}
          </button>
        </div>
      )}

      {/* TASK LIST */}
      <div className="space-y-3">
        {tasksToDisplay.map((t) => (
          <div key={t.id} className="p-4 bg-[#101522] border border-[#252C3D] hover:border-[#6366F1]/50 rounded-2xl flex items-center justify-between transition">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-white">{t.title}</h3>
              <p className="text-xs text-[#94A3B8]">60s Stay • Instant DB Credit</p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs font-bold text-emerald-400">+{t.points} Points</span>
                {t.rewardText && <span className="text-[10px] text-amber-400 font-semibold">({t.rewardText})</span>}
              </div>
            </div>
            <button
              onClick={() => handleStartTask(t)}
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
