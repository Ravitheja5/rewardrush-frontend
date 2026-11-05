import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { ExternalLink, CheckCircle2, Clock, PlayCircle, AlertTriangle, X, ShieldCheck, Flame, Gift, Sparkles } from 'lucide-react';

export default function TasksPage() {
  const [filter, setFilter] = useState('ALL');
  const [activeTimerTask, setActiveTimerTask] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [alertMsg, setAlertMsg] = useState('');
  
  // Dedicated Video Engine State
  const [videoModalTask, setVideoModalTask] = useState(null);
  const [videoTimeLeft, setVideoTimeLeft] = useState(0);

  const sponsorWindowRef = useRef(null);
  const checkClosedIntervalRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('completed_tasks');
    if (saved) setCompletedTasks(JSON.parse(saved));
  }, []);

  // Web Task Timer Detection
  useEffect(() => {
    if (timeLeft <= 0 || !activeTimerTask) return;

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

    checkClosedIntervalRef.current = setInterval(() => {
      if (sponsorWindowRef.current && sponsorWindowRef.current.closed) {
        clearInterval(timer);
        clearInterval(checkClosedIntervalRef.current);
        setActiveTimerTask(null);
        setTimeLeft(0);
        setAlertMsg('❌ టాస్క్ విఫలమైంది: స్పాన్సర్ పేజీని సమయం కంటే ముందే క్లోజ్ చేశారు!');
      }
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(checkClosedIntervalRef.current);
    };
  }, [timeLeft, activeTimerTask]);

  // Dedicated Video 60s Countdown Timer
  useEffect(() => {
    if (!videoModalTask || videoTimeLeft <= 0) return;

    const vTimer = setInterval(() => {
      setVideoTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(vTimer);
          handleTaskCompletion(videoModalTask);
          setVideoModalTask(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(vTimer);
  }, [videoTimeLeft, videoModalTask]);

  const handleTaskCompletion = (task) => {
    const updated = [...completedTasks, task.id];
    setCompletedTasks(updated);
    localStorage.setItem('completed_tasks', JSON.stringify(updated));

    const savedUser = JSON.parse(localStorage.getItem('rewardUser') || '{"points": 265}');
    savedUser.points = (savedUser.points || 265) + task.points;
    localStorage.setItem('rewardUser', JSON.stringify(savedUser));

    setAlertMsg(`🎉 అభినందనలు! "${task.title}" టాస్క్ పూర్తయింది. +${task.points} పాయింట్లు క్రెడిట్ అయ్యాయి.`);
    setActiveTimerTask(null);
    sponsorWindowRef.current = null;
  };

  const tasksList = [
    {
      id: 'task-yt-finora',
      title: 'Watch & Earn: Finora Earning Guide',
      category: 'Video',
      badge: 'Finora Official',
      points: 60,
      durationSec: 60,
      time: '60 secs',
      desc: 'Finora Telugu గైడ్ వీడియోను 60 సెకన్ల పాటు చూసి కాయిన్స్ పొందండి.',
      youtubeId: 'ZoWP6tc5ols',
      prerollUrl: 'https://asiafilm.org/4/2a9f2d1477def572c8eea4e320a1ae30',
      type: 'video'
    },
    {
      id: 'task-monetag-1',
      title: 'Quick Sponsor Visit #1',
      category: 'Instant',
      badge: 'Monetag Active',
      points: 40,
      durationSec: 20,
      time: '20 secs',
      desc: 'పార్ట్‌నర్ స్పాన్సర్ పేజీని 20 సెకన్ల పాటు ఎక్స్‌ప్లోర్ చేయండి.',
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
      desc: 'గ్లోబల్ ఆఫర్లను 30 సెకన్లు పేజీ క్లోజ్ చేయకుండా పరిశీలించండి.',
      url: 'https://asiafilm.org/4/2a9f2d1477def572c8eea4e320a1ae30',
      type: 'web'
    }
  ];

  const filtered = filter === 'ALL'
    ? tasksList
    : tasksList.filter(t => t.category.toLowerCase() === filter.toLowerCase() || t.badge.toLowerCase().includes(filter.toLowerCase()));

  const startTask = (task) => {
    if (completedTasks.includes(task.id)) return;

    if (task.type === 'video') {
      if (task.prerollUrl) {
        window.open(task.prerollUrl, '_blank', 'noopener=false');
      }
      setVideoModalTask(task);
      setVideoTimeLeft(task.durationSec);
      setAlertMsg(`⏳ స్పాన్సర్ వెరిఫికేషన్ & Finora వీడియో మొదలైంది! 60 సెకన్లలో రివార్డ్ అన్‌లాక్ అవుతుంది.`);
      return;
    }

    const win = window.open(task.url, '_blank', 'noopener=false');
    sponsorWindowRef.current = win;
    setActiveTimerTask(task);
    setTimeLeft(task.durationSec);
    setAlertMsg(`⏳ వెరిఫికేషన్ ప్రారంభమైంది... స్పాన్సర్ ట్యాబ్‌ను ${task.durationSec}s క్లోజ్ చేయవద్దు.`);
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
            ● Finora Partner Active
          </span>
        </div>
        <p className="text-xs text-[#A1A8B8] mt-0.5">Finora వీడియోలు చూడండి & స్పాన్సర్స్ విజిట్ చేసి ₹49 రీఛార్జ్ పాయింట్లు సంపాదించండి</p>
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

      {/* Web Task Timer */}
      {timeLeft > 0 && activeTimerTask && (
        <div className="p-4 bg-[#818CF8]/10 border border-[#818CF8]/30 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="text-[#818CF8] animate-spin" size={20} />
            <div>
              <h4 className="text-sm font-semibold text-[#F8FAFC]">{activeTimerTask.title}</h4>
              <p className="text-xs text-[#FB7185] flex items-center gap-1 mt-0.5">
                <AlertTriangle size={12} /> ట్యాబ్ క్లోజ్ చేస్తే టాస్క్ క్యాన్సిల్ అవుతుంది!
              </p>
            </div>
          </div>
          <span className="text-xl font-mono font-bold text-[#818CF8] tabular-nums">{timeLeft}s</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['ALL', 'Video', 'Instant'].map((tab) => (
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
          const isCurrent = (activeTimerTask?.id === task.id) || (videoModalTask?.id === task.id);

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
                    <CheckCircle2 size={13} /> పూర్తి అయ్యింది
                  </span>
                ) : (
                  <button
                    onClick={() => startTask(task)}
                    disabled={isCurrent}
                    className="flex items-center gap-1 px-4 py-1.5 bg-[#818CF8] hover:bg-[#6366F1] disabled:bg-[#151B2B] text-white text-xs font-medium rounded-lg transition"
                  >
                    {isCurrent ? 'ప్లే అవుతోంది...' : 'Start'}
                    {task.type === 'video' ? <PlayCircle size={12} /> : <ExternalLink size={12} />}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Finora Dedicated Video Player Modal with High-Converting Visual Ads */}
      {videoModalTask && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#101522] border border-[#252C3D] w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl space-y-3.5 p-4 my-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1C2231] pb-2.5">
              <div>
                <h3 className="text-sm font-semibold text-[#F8FAFC]">{videoModalTask.title}</h3>
                <span className="text-[11px] text-[#34D399] flex items-center gap-1">
                  <ShieldCheck size={12} /> Finora Telugu Official
                </span>
              </div>
              <button
                onClick={() => {
                  if (confirm('వీడియో ముందే ఆపేస్తే పాయింట్లు రావు. క్లోజ్ చేయాలా?')) {
                    setVideoModalTask(null);
                    setVideoTimeLeft(0);
                  }
                }}
                className="text-[#727C91] hover:text-white p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* TOP SPONSORED PROMO BANNER (Monetag Direct Ad) */}
            <a
              href="https://uplcm.com/4/12198373"
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden block p-3 bg-gradient-to-r from-[#1E1B4B]/80 via-[#311042]/80 to-[#1E1B4B]/80 border border-[#818CF8]/40 hover:border-[#818CF8] rounded-xl transition group shadow-lg"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#818CF8]/20 text-[#818CF8] rounded-lg">
                    <Flame size={18} className="animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-extrabold uppercase bg-[#818CF8] text-[#0A0D14] px-1.5 py-0.2 rounded font-mono">
                        AD SPONSOR
                      </span>
                      <span className="text-xs font-bold text-white group-hover:text-[#A5B4FC] transition">
                        ⚡ ₹49 Unlimited Data Recharge Coupon
                      </span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">
                      Claim exclusive high-speed 5G voucher codes instantly!
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1.5 bg-[#818CF8] group-hover:bg-[#6366F1] text-white text-[11px] font-semibold rounded-lg shrink-0 flex items-center gap-1 transition">
                  Claim <ExternalLink size={11} />
                </span>
              </div>
            </a>

            {/* DEDICATED YOUTUBE VIDEO CONTAINER */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-[#1C2231] shadow-2xl">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${videoModalTask.youtubeId}?autoplay=1&controls=1&rel=0&modestbranding=1`}
                title="Finora Telugu Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* BOTTOM SPONSORED PROMO BANNER (Adsterra Direct Ad) */}
            <a
              href="https://asiafilm.org/4/2a9f2d1477def572c8eea4e320a1ae30"
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden block p-3 bg-gradient-to-r from-[#064E3B]/80 via-[#0F3C38]/80 to-[#064E3B]/80 border border-[#34D399]/40 hover:border-[#34D399] rounded-xl transition group shadow-lg"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#34D399]/20 text-[#34D399] rounded-lg">
                    <Gift size={18} className="animate-bounce" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-extrabold uppercase bg-[#34D399] text-[#0A0D14] px-1.5 py-0.2 rounded font-mono">
                        SPECIAL OFFER
                      </span>
                      <span className="text-xs font-bold text-white group-hover:text-[#6EE7B7] transition">
                        🎁 Free Instant Scratch & Win Bonus
                      </span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">
                      Tap to check daily unlocked rewards & partner gifts.
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1.5 bg-[#34D399] group-hover:bg-[#10B981] text-[#0A0D14] text-[11px] font-bold rounded-lg shrink-0 flex items-center gap-1 transition">
                  Explore <ExternalLink size={11} />
                </span>
              </div>
            </a>

            {/* LIVE COUNTDOWN FOOTER */}
            <div className="p-3 bg-[#151B2B] rounded-xl flex items-center justify-between border border-[#1C2231]">
              <div className="flex items-center gap-2">
                <Clock className="text-[#818CF8] animate-spin" size={16} />
                <span className="text-xs text-[#F8FAFC]">రివార్డ్ అన్‌లాక్ అవ్వడానికి సమయం:</span>
              </div>
              <span className="text-base font-mono font-bold text-[#34D399] tabular-nums">
                {videoTimeLeft}s
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
