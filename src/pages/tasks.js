import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { ExternalLink, CheckCircle2, Clock, PlayCircle } from 'lucide-react';

export default function TasksPage() {
  const [filter, setFilter] = useState('ALL');
  const [activeTimerTask, setActiveTimerTask] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('completed_tasks');
    if (saved) setCompletedTasks(JSON.parse(saved));
  }, []);

  // Countdown Timer Logic
  useEffect(() => {
    if (timeLeft <= 0 || !activeTimerTask) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTaskCompletion(activeTimerTask);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, activeTimerTask]);

  const handleTaskCompletion = (task) => {
    const updated = [...completedTasks, task.id];
    setCompletedTasks(updated);
    localStorage.setItem('completed_tasks', JSON.stringify(updated));

    // Update Wallet Points in localStorage
    const savedUser = JSON.parse(localStorage.getItem('rewardUser') || '{"points": 265}');
    savedUser.points = (savedUser.points || 265) + task.points;
    localStorage.setItem('rewardUser', JSON.stringify(savedUser));

    setAlertMsg(`🎉 Success! Verified: ${task.title}. +${task.points} Points credited.`);
    setActiveTimerTask(null);
  };

  const tasksList = [
    {
      id: 'task-monetag-1',
      title: 'Quick Sponsor Visit #1',
      category: 'Instant',
      badge: 'Live Offer',
      points: 40,
      durationSec: 20,
      time: '20 secs',
      desc: 'Open partner site and explore for 20 seconds to claim instant coins.',
      url: 'https://uplcm.com/4/12198373',
      type: 'web'
    },
    {
      id: 'task-monetag-2',
      title: 'Premium Sponsor Discovery #2',
      category: 'Instant',
      badge: 'High Yield',
      points: 75,
      durationSec: 35,
      time: '35 secs',
      desc: 'Browse trending tech and financial deals on sponsor network.',
      url: 'https://uplcm.com/4/12198373',
      type: 'web'
    },
    {
      id: 'task-monetag-3',
      title: 'Partner Showcase Campaign #3',
      category: 'Instant',
      badge: 'Live Offer',
      points: 100,
      durationSec: 50,
      time: '50 secs',
      desc: 'Engage with advertiser showcase landing page to earn big rewards.',
      url: 'https://uplcm.com/4/12198373',
      type: 'web'
    },
    {
      id: 'task-yt-1',
      title: 'Watch & Learn: Stock Market Basics',
      category: 'Video',
      badge: 'Watch Earn',
      points: 60,
      durationSec: 45,
      time: '45 secs',
      desc: 'Watch quick educational guide on index funds & smart investment.',
      url: 'https://uplcm.com/4/12198373',
      type: 'video'
    },
    {
      id: 'task-yt-2',
      title: 'Watch & Learn: Top Credit Card Rewards',
      category: 'Video',
      badge: 'Watch Earn',
      points: 80,
      durationSec: 60,
      time: '60 secs',
      desc: 'Complete video overview on lifetime-free cashback credit cards.',
      url: 'https://uplcm.com/4/12198373',
      type: 'video'
    }
  ];

  const filtered = filter === 'ALL'
    ? tasksList
    : tasksList.filter(t => t.category.toLowerCase() === filter.toLowerCase() || t.badge.toLowerCase() === filter.toLowerCase());

  const startTask = (task) => {
    if (completedTasks.includes(task.id)) return;

    window.open(task.url, '_blank', 'noopener,noreferrer');
    setActiveTimerTask(task);
    setTimeLeft(task.durationSec);
    setAlertMsg(`⏳ Verifying "${task.title}"... Please keep the sponsor page open for ${task.durationSec}s.`);
  };

  return (
    <div className="space-y-6">
      <Head>
        <title>Earn Points | RewardRush</title>
      </Head>

      <div className="border-b border-[#1C2231] pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-[#F8FAFC]">Available Tasks</h1>
          <span className="px-2.5 py-1 bg-[#34D399]/10 border border-[#34D399]/20 text-[#34D399] text-[11px] font-medium rounded-full">
            ● {tasksList.length} Active Tasks
          </span>
        </div>
        <p className="text-xs text-[#A1A8B8] mt-0.5">Complete verified visits and videos to earn instant wallet points</p>
      </div>

      {alertMsg && (
        <div className="p-3 bg-[#101522] border border-[#252C3D] text-xs text-center rounded-xl text-[#F8FAFC]">
          {alertMsg}
        </div>
      )}

      {/* Timer Progress Banner */}
      {timeLeft > 0 && activeTimerTask && (
        <div className="p-4 bg-[#818CF8]/10 border border-[#818CF8]/30 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="text-[#818CF8] animate-spin" size={20} />
            <div>
              <h4 className="text-sm font-semibold text-[#F8FAFC]">{activeTimerTask.title}</h4>
              <p className="text-xs text-[#A1A8B8]">Verifying your active stay... please wait</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-mono font-bold text-[#818CF8] tabular-nums">{timeLeft}s</span>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['ALL', 'Instant', 'Video'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filter === tab
                ? 'bg-[#818CF8] text-white'
                : 'bg-[#101522] text-[#A1A8B8] border border-[#252C3D] hover:bg-[#151B2B]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Task Cards List */}
      <div className="space-y-3">
        {filtered.map((task) => {
          const isDone = completedTasks.includes(task.id);
          const isCurrent = activeTimerTask?.id === task.id;

          return (
            <div
              key={task.id}
              className={`p-4 bg-[#101522] border rounded-xl flex items-center justify-between gap-3 transition ${
                isDone
                  ? 'border-[#34D399]/30 opacity-60'
                  : 'border-[#252C3D] hover:border-[#1C2335]'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#F8FAFC]">{task.title}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/20">
                    {task.badge}
                  </span>
                </div>
                <p className="text-xs text-[#727C91]">{task.desc}</p>
                <span className="text-[11px] text-[#A1A8B8] block">⏱ Required: {task.time}</span>
              </div>

              <div className="text-right flex flex-col items-end gap-2 shrink-0">
                <span className="text-xs font-semibold text-[#F5B942] tabular-nums">+{task.points} pts</span>
                {isDone ? (
                  <span className="flex items-center gap-1 text-xs text-[#34D399] font-medium px-3 py-1.5 bg-[#34D399]/10 rounded-lg">
                    <CheckCircle2 size={13} /> Completed
                  </span>
                ) : (
                  <button
                    onClick={() => startTask(task)}
                    disabled={isCurrent}
                    className="flex items-center gap-1 px-4 py-1.5 bg-[#818CF8] hover:bg-[#6366F1] disabled:bg-[#151B2B] text-white text-xs font-medium rounded-lg transition"
                  >
                    {isCurrent ? 'Verifying...' : 'Start'} 
                    {task.type === 'video' ? <PlayCircle size={12} /> : <ExternalLink size={12} />}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
