import React, { useState } from 'react';
import Head from 'next/head';

export default function TasksPage() {
  const [filter, setFilter] = useState('ALL');

  const tasksList = [
    {
      id: 'task-1',
      title: 'Tata Neu SuperApp',
      category: 'App Install',
      badge: 'Easy',
      points: 250,
      inr: 25,
      time: '4 mins',
      desc: 'Install, register with mobile number & verify OTP',
      icon: '🛍️'
    },
    {
      id: 'task-2',
      title: 'PhonePe UPI Setup',
      category: 'Finance Offers',
      badge: 'Medium',
      points: 400,
      inr: 40,
      time: '6 mins',
      desc: 'Link bank account and perform first ₹1 test transaction',
      icon: '💳'
    },
    {
      id: 'task-3',
      title: 'College Tech & AI Survey',
      category: 'Surveys',
      badge: 'Instant',
      points: 120,
      inr: 12,
      time: '3 mins',
      desc: '5 quick questions regarding daily developer tooling',
      icon: '📊'
    },
    {
      id: 'task-4',
      title: 'Online Food Ordering Poll',
      category: 'Surveys',
      badge: 'Instant',
      points: 80,
      inr: 8,
      time: '2 mins',
      desc: 'Short review of weekend dining habits and coupons',
      icon: '🍕'
    }
  ];

  const filtered = filter === 'ALL'
    ? tasksList
    : tasksList.filter(t => t.badge.toLowerCase() === filter.toLowerCase() || t.category.toLowerCase() === filter.toLowerCase());

  const handleStartTask = (task) => {
    const clickId = `clk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    alert(`Starting ${task.title}...\nTracking Click ID: ${clickId}\nComplete the task on the target page to receive ${task.points} points.`);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 pb-28">
      <Head>
        <title>Earn Points | RewardRush</title>
      </Head>

      <div className="max-w-2xl mx-auto space-y-5">
        {/* Title & S2S Status */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              Earn Rewards
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Complete verified partner tasks for points</p>
          </div>
          <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold rounded-full">
            ● S2S Active
          </span>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {['ALL', 'Easy', 'Medium', 'Instant'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                filter === tab
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Task Cards */}
        <div className="space-y-3">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="p-4 bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl transition flex items-center justify-between gap-3 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl shadow-inner border border-slate-700/50">
                  {t.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-100">{t.title}</h3>
                    <span className="px-1.5 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 text-[9px] font-semibold rounded">
                      {t.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{t.desc}</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">⏱ {t.time}</span>
                </div>
              </div>

              <div className="text-right flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold rounded-lg font-mono">
                  +{t.points} PTS
                </span>
                <button
                  onClick={() => handleStartTask(t)}
                  className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs rounded-xl shadow hover:opacity-95 transition"
                >
                  Start
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
