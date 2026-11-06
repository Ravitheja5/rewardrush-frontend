import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getAuthSession, fetchLiveUserFromDB } from '../utils/auth';
import { ExternalLink, CheckCircle, Clock, Zap, Flame } from 'lucide-react';

export default function TasksPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('daily_ads');
  const [activeTask, setActiveTask] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [claiming, setClaiming] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const adWindowRef = useRef(null);

  const smartlinkUrl = 'https://asiafilm.org/4/2b6d7c7eb71fdb958e6581a1fabc946a';

  // 130 Tasks x 38 Points = 4,940 Points (Full ₹49 Data Pack Opportunity)
  const dailyAdTasks = Array.from({ length: 130 }, (_, i) => ({
    id: `ad_task_${i + 1}`,
    title: `Sponsored Ad Task #${i + 1}`,
    points: 38,
    seconds: 60,
    url: smartlinkUrl,
    badge: `Task ${i + 1}/130`
  }));

  // High Commission vCommission Campaigns
  const vCommissionOffers = [
    {
      id: 'vcomm_kotak811',
      title: 'Kotak 811 Zero Balance Savings Account',
      category: 'Banking',
      points: 2500,
      rewardValue: '₹25.00 Value',
      desc: 'Open a verified zero-balance digital savings account online.',
      url: smartlinkUrl,
      seconds: 60
    },
    {
      id: 'vcomm_angelone',
      title: 'Angel One Free Demat Account Opening',
      category: 'FinTech',
      points: 2000,
      rewardValue: '₹20.00 Value',
      desc: 'Complete digital Aadhaar KYC to activate your free demat account.',
      url: smartlinkUrl,
      seconds: 60
    },
    {
      id: 'vcomm_aubank_cc',
      title: 'AU Small Finance Bank Lifetime Free Credit Card',
      category: 'Credit Cards',
      points: 3500,
      rewardValue: '₹35.00 Value',
      desc: 'Check instant eligibility for a lifetime free reward credit card.',
      url: smartlinkUrl,
      seconds: 60
    },
    {
      id: 'vcomm_indusind',
      title: 'IndusInd Bank Instant Digital Account',
      category: 'Banking',
      points: 1800,
      rewardValue: '₹18.00 Value',
      desc: 'Instant zero-balance savings account with complimentary virtual debit card.',
      url: smartlinkUrl,
      seconds: 60
    },
    {
      id: 'vcomm_bajaj_finserv',
      title: 'Bajaj Finserv Insta EMI Card Eligibility Check',
      category: 'Credit & Loans',
      points: 1500,
      rewardValue: '₹15.00 Value',
      desc: 'Apply online and activate an instant credit limit of up to ₹2,00,000.',
      url: smartlinkUrl,
      seconds: 60
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

  // Anti-Cheat: 60s View & Tab Close Detection
  useEffect(() => {
    let timer;
    if (activeTask && secondsLeft > 0) {
      timer = setInterval(() => {
        if (adWindowRef.current && adWindowRef.current.closed) {
          setStatusMsg({
            type: 'error',
            text: 'Offer tab was closed early! You must view the page for full 60 seconds. Task cancelled.'
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
    setSecondsLeft(task.seconds || 60);
  };

  const handleClaimPoints = async () => {
    if (secondsLeft > 0 || !activeTask || !user) return;
    setClaiming(true);
    setStatusMsg(null);

    try {
      const res = await fetch('https://rewards-app-backend-lq2v.onrender.com/api/tasks/claim', {
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
        throw new Error(data.message || 'Task claim failed');
      }

      setUser(data.user);
      setStatusMsg({
        type: 'success',
        text: `+${activeTask.points} Points credited directly to PostgreSQL database!`
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
        <p className="text-xs text-[#94A3B8]">Loading tasks from database...</p>
      </div>
    );
  }

  const tasksToDisplay = activeTab === 'daily_ads' ? dailyAdTasks : vCommissionOffers;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-28 px-4 pt-4">
      <Head>
        <title>Tasks & Offers | RewardRush</title>
      </Head>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">Daily Tasks & Offers</h1>
          <p className="text-xs text-[#94A3B8]">Complete tasks to claim the ₹49 Unlimited Data Pack (4,900 pts)</p>
        </div>
        <div className="px-3 py-1.5 bg-[#1E1B4B] border border-[#6366F1]/30 rounded-xl text-right">
          <span className="text-[10px] text-[#94A3B8] block">Live Balance</span>
          <span className="text-sm font-black text-emerald-400">{user.points} pts</span>
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

      {/* DUAL CHANNEL NAVIGATION */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#101522] border border-[#252C3D] rounded-2xl">
        <button
          onClick={() => setActiveTab('daily_ads')}
          className={`py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'daily_ads'
              ? 'bg-[#6366F1] text-white shadow-md'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <Zap size={14} /> 130 Daily Ads (38 pts each)
        </button>
        <button
          onClick={() => setActiveTab('vcomm')}
          className={`py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'vcomm'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <Flame size={14} /> vCommission Campaigns
        </button>
      </div>

      {/* ACTIVE 60s RUNNING TASK BANNER */}
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
              <span>Keep offer tab open: <strong className="text-amber-400 text-sm">{secondsLeft}s</strong> remaining</span>
            ) : (
              <span className="text-emerald-400 font-bold">60 seconds finished! Claim your points below.</span>
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
            <CheckCircle size={15} /> {claiming ? 'Updating Database...' : `Claim ${activeTask.points} Points`}
          </button>
        </div>
      )}

      {/* TASK LIST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#94A3B8]">
          <span className="uppercase font-bold tracking-wider">
            {activeTab === 'daily_ads' ? 'Daily Adsterra Tasks Pool (130 Max)' : 'High-Ticket vCommission Offers'}
          </span>
          <span>{tasksToDisplay.length} Available</span>
        </div>

        {tasksToDisplay.map((t) => (
          <div
            key={t.id}
            className="p-4 bg-[#101522] border border-[#252C3D] hover:border-[#6366F1]/50 rounded-2xl flex items-center justify-between transition"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{t.title}</span>
                {t.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#6366F1]/20 text-[#818CF8] border border-[#6366F1]/30 font-semibold">
                    {t.badge}
                  </span>
                )}
                {t.category && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                    {t.category}
                  </span>
                )}
              </div>
              {t.desc && <p className="text-xs text-[#94A3B8]">{t.desc}</p>}
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-xs font-bold text-emerald-400">+{t.points} Points</span>
                {t.rewardValue && <span className="text-[10px] text-amber-400 font-semibold">({t.rewardValue})</span>}
                <span className="text-[10px] text-[#94A3B8]">• 60s View Required</span>
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
