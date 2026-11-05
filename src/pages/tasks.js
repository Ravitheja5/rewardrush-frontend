import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { ExternalLink, CheckCircle2, Clock, PlayCircle, AlertTriangle } from 'lucide-react';

export default function TasksPage() {
  const [filter, setFilter] = useState('ALL');
  const [activeTimerTask, setActiveTimerTask] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [alertMsg, setAlertMsg] = useState('');
  
  const sponsorWindowRef = useRef(null);
  const checkClosedIntervalRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('completed_tasks');
    if (saved) setCompletedTasks(JSON.parse(saved));
  }, []);

  // Timer & Window Closed Detection Logic
  useEffect(() => {
    if (timeLeft <= 0 || !activeTimerTask) return;

    // 1. Timer countdown interval
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          clearInterval(checkClosedIntervalRef.current);
          handleTaskCompletion(activeTimerTask);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 2. Strict Check: If user closes advertiser window before time
    checkClosedIntervalRef.current = setInterval(() => {
      if (sponsorWindowRef.current && sponsorWindowRef.current.closed) {
        clearInterval(timer);
        clearInterval(checkClosedIntervalRef.current);
        setActiveTimerTask(null);
        setTimeLeft(0);
        setAlertMsg('❌ టాస్క్ విఫలమైంది: మీరు స్పాన్సర్ పేజీని సమయం కంటే ముందే క్లోజ్ చేశారు! పాయింట్లు లభించవు.');
      }
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(checkClosedIntervalRef.current);
    };
  }, [timeLeft, activeTimerTask]);

  const handleTaskCompletion = (task) => {
    const updated = [...completedTasks, task.id];
    setCompletedTasks(updated);
    localStorage.setItem('completed_tasks', JSON.stringify(updated));

    // Update Points
    const savedUser = JSON.parse(localStorage.getItem('rewardUser') || '{"points": 265}');
    savedUser.points = (savedUser.points || 265) + task.points;
    localStorage.setItem('rewardUser', JSON.stringify(savedUser));

    setAlertMsg(`🎉 అభినందనలు! "${task.title}" పూర్తయింది. +${task.points} పాయింట్లు క్రెడిట్ అయ్యాయి.`);
    setActiveTimerTask(null);
    sponsorWindowRef.current = null;
  };

  const tasksList = [
    {
      id: 'task-monetag-1',
      title: 'Quick Sponsor Visit #1',
      category: 'Instant',
      badge: 'Monetag Active',
      points: 40,
      durationSec: 20,
      time: '20 secs',
      desc: 'ప్రకటన పేజీని 20 సెకన్ల పాటు క్లోజ్ చేయకుండా పరిశీలించండి.',
      url: 'https://uplcm.com/4/12198373',
      type: 'web'
    },
    {
      id: 'task-adsterra-1',
      title: 'Global Sponsor Discovery #2',
      category: 'Instant',
      badge: 'Adsterra Active',
      points: 70,
      durationSec: 30,
      time: '30 secs',
      desc: 'ప్రీమియం గ్లోబల్ స్పాన్సర్ డీల్స్‌ను 30 సెకన్లు క్లోజ్ చేయకుండా బ్రౌజ్ చేయండి.',
      url: 'https://asiafilm.org/4/2a9f2d1477def572c8eea4e320a1ae30',
      type: 'web'
    },
    {
      id: 'task-monetag-2',
      title: 'High-Yield Sponsor Showcase #3',
      category: 'Instant',
      badge: 'Monetag Active',
      points: 85,
      durationSec: 35,
      time: '35 secs',
      desc: 'ట్రెండింగ్ స్పాన్సర్ ఆఫర్‌ను 35 సెకన్ల పాటు బ్రౌజ్ చేయండి.',
      url: 'https://uplcm.com/4/12198373',
      type: 'web'
    },
    {
      id: 'task-yt-1',
      title: 'Watch & Learn: Investment Guides',
      category: 'Video',
      badge: 'Educational',
      points: 50,
      durationSec: 40,
      time: '40 secs',
      desc: 'స్మార్ట్ ఇన్వెస్ట్‌మెంట్ గైడ్ వీడియోను వీక్షించండి.',
      url: 'https://asiafilm.org/4/2a9f2d1477def572c8eea4e320a1ae30',
      type: 'video'
    }
  ];

  const filtered = filter === 'ALL'
    ? tasksList
    : tasksList.filter(t => t.category.toLowerCase() === filter.toLowerCase() || t.badge.toLowerCase().includes(filter.toLowerCase()));

  const startTask = (task) => {
    if (completedTasks.includes(task.id)) return;

    const win = window.open(task.url, '_blank', 'noopener=false');
    sponsorWindowRef.current = win;

    setActiveTimerTask(task);
    setTimeLeft(task.durationSec);
    setAlertMsg(`⏳ వెరిఫికేషన్ నడుస్తోంది... దయచేసి స్పాన్సర్ పేజీని ${task.durationSec} సెకన్ల పాటు క్లోజ్ చేయవద్దు.`);
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
            ● 2 Networks Active
          </span>
        </div>
        <p className="text-xs text-[#A1A8B8] mt-0.5">మల్టీ-నెట్‌వర్క్ స్పాన్సర్ ఆఫర్లను పూర్తి చేసి తక్షణమే వాలెట్ పాయింట్లు సంపాదించండి</p>
      </div>

      {alertMsg && (
        <div className={`p-3.5 border text-xs text-center rounded-xl font-medium ${
          alertMsg.includes('❌') 
            ? 'bg-[#FB7185]/10 border-[#FB7185]/30 text-[#FB7185]'
            : alertMsg.includes('🎉')
            ? 'bg-[#34D399]/10 border-[#34D399]/30 text-[#34D399]'
            : 'bg-[#101522] border-[#252C3D] text-[#F8FAFC]'
        }`}>
          {alertMsg}
        </div>
      )}

      {/* Countdown Timer Display */}
      {timeLeft > 0 && activeTimerTask && (
        <div className="p-4 bg-[#818CF8]/10 border border-[#818CF8]/30 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="text-[#818CF8] animate-spin" size={20} />
            <div>
              <h4 className="text-sm font-semibold text-[#F8FAFC]">{activeTimerTask.title}</h4>
              <p className="text-xs text-[#FB7185] flex items-center gap-1 mt-0.5">
                <AlertTriangle size={12} /> ట్యాబ్ క్లోజ్ చేస్తే పాయింట్లు రద్దు చేయబడతాయి!
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-mono font-bold text-[#818CF8] tabular-nums">{timeLeft}s</span>
          </div>
        </div>
      )}

      {/* Filters */}
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

      {/* Task Cards */}
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
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#818CF8]/10 text-[#818CF8] border border-[#818CF8]/20">
                    {task.badge}
                  </span>
                </div>
                <p className="text-xs text-[#727C91]">{task.desc}</p>
                <span className="text-[11px] text-[#A1A8B8] block">⏱ సమయం: {task.time}</span>
              </div>

              <div className="text-right flex flex-col items-end gap-2 shrink-0">
                <span className="text-xs font-semibold text-[#F5B942] tabular-nums">+{task.points} pts</span>
                {isDone ? (
                  <span className="flex items-center gap-1 text-xs text-[#34D399] font-medium px-3 py-1.5 bg-[#34D399]/10 rounded-lg">
                    <CheckCircle2 size={13} /> పూర్తయింది
                  </span>
                ) : (
                  <button
                    onClick={() => startTask(task)}
                    disabled={isCurrent}
                    className="flex items-center gap-1 px-4 py-1.5 bg-[#818CF8] hover:bg-[#6366F1] disabled:bg-[#151B2B] text-white text-xs font-medium rounded-lg transition"
                  >
                    {isCurrent ? 'ధృవీకరిస్తోంది...' : 'Start'} 
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
