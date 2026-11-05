import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getLoggedInUser, syncWallet, logoutUser } from '../utils/auth';
import { apiRequest } from '../utils/api';
import { CheckCircle2, Clock, PlayCircle, ExternalLink, ShieldCheck, LogOut, Lock } from 'lucide-react';

export default function TasksPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [alertMsg, setAlertMsg] = useState('');

  const [activeTimerTask, setActiveTimerTask] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const [videoModalTask, setVideoModalTask] = useState(null);
  const [videoTimeLeft, setVideoTimeLeft] = useState(0);
  const [canCloseVideo, setCanCloseVideo] = useState(false);

  const sponsorWindowRef = useRef(null);
  const checkClosedIntervalRef = useRef(null);

  useEffect(() => {
    const user = getLoggedInUser();
    if (!user) {
      router.push('/auth');
    } else {
      setCurrentUser(user);
    }
  }, [router]);

  // Web Task Timer Detection
  useEffect(() => {
    if (timeLeft <= 0 || !activeTimerTask) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          clearInterval(checkClosedIntervalRef.current);
          handleBackendComplete(activeTimerTask);
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
        setAlertMsg('❌ Task Failed: Sponsor tab was closed prematurely.');
      }
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(checkClosedIntervalRef.current);
    };
  }, [timeLeft, activeTimerTask]);

  // Video 60s + 2s Timer Detection
  useEffect(() => {
    if (!videoModalTask || videoTimeLeft <= 0) return;

    const vTimer = setInterval(() => {
      setVideoTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(vTimer);
          setCanCloseVideo(true);
          handleBackendComplete(videoModalTask);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(vTimer);
  }, [videoTimeLeft, videoModalTask]);

  // Direct PostgreSQL Backend Sync
  const handleBackendComplete = async (task) => {
    if (!currentUser) return;
    try {
      const res = await apiRequest('/api/tasks/complete', 'POST', {
        userId: currentUser.id,
        taskId: task.id,
        points: task.points
      });

      if (res.success) {
        syncWallet(res.user);
        setCurrentUser(res.user);
        setAlertMsg(`🎉 Success! +${task.points} pts added to your PostgreSQL wallet.`);
      } else {
        setAlertMsg(`⚠️ ${res.message}`);
      }
    } catch (err) {
      setAlertMsg('❌ Error updating wallet on backend');
    }
    setActiveTimerTask(null);
    sponsorWindowRef.current = null;
  };

  const tasksList = [
    {
      id: 'task-finora-video-1',
      title: 'Finora Official Earning Guide',
      category: 'Video',
      badge: 'Official Video',
      points: 50,
      durationSec: 62,
      time: '62s locked',
      desc: 'Watch Finora Telugu guide. Window lock enabled until timer completes.',
      youtubeId: 'ZoWP6tc5ols',
      prerollUrl: 'https://asiafilm.org/4/2a9f2d1477def572c8eea4e320a1ae30',
      type: 'video'
    },
    {
      id: 'task-monetag-sponsor-1',
      title: 'Monetag Partner Verification',
      category: 'Instant',
      badge: 'Monetag Ad',
      points: 35,
      durationSec: 22,
      time: '22 secs',
      desc: 'Visit sponsor page without closing tab until timer ends.',
      url: 'https://uplcm.com/4/12198373',
      type: 'web'
    },
    {
      id: 'task-adsterra-sponsor-2',
      title: 'Global Adsterra Discovery',
      category: 'Instant',
      badge: 'Adsterra Ad',
      points: 40,
      durationSec: 25,
      time: '25 secs',
      desc: 'Explore exclusive high-speed data offers on global network.',
      url: 'https://asiafilm.org/4/2a9f2d1477def572c8eea4e320a1ae30',
      type: 'web'
    }
  ];

  const startTask = (task) => {
    if (!currentUser) return;

    if ((currentUser.daily_task_count || 0) >= 12) {
      setAlertMsg('⚠️ Daily limit of 12 tasks reached! Come back tomorrow.');
      return;
    }

    if (task.type === 'video') {
      if (task.prerollUrl) window.open(task.prerollUrl, '_blank', 'noopener=false');
      setVideoModalTask(task);
      setVideoTimeLeft(task.durationSec);
      setCanCloseVideo(false);
      setAlertMsg('⏳ Video locked for 62s mandatory view duration.');
      return;
    }

    const win = window.open(task.url, '_blank', 'noopener=false');
    sponsorWindowRef.current = win;
    setActiveTimerTask(task);
    setTimeLeft(task.durationSec);
    setAlertMsg(`⏳ Verification in progress... Keep tab open for ${task.durationSec}s.`);
  };

  if (!currentUser) return null;

  const earnedRupees = ((currentUser.points || 0) / 100).toFixed(2);
  const rechargeProgress = Math.min(100, (((currentUser.points || 0) / 4900) * 100)).toFixed(1);

  return (
    <div className="space-y-6 pb-12">
      <Head>
        <title>Tasks & Earnings | Finora Rewards</title>
      </Head>

      {/* Live Balance Card */}
      <div className="p-5 bg-gradient-to-r from-[#101522] via-[#151D30] to-[#101522] border border-[#252C3D] rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#818CF8]">Logged in as +91 {currentUser.phone}</span>
            <button
              onClick={() => { logoutUser(); router.push('/auth'); }}
              className="text-[#727C91] hover:text-[#FB7185] transition"
              title="Logout"
            >
              <LogOut size={13} />
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#F8FAFC] tracking-tight">₹{earnedRupees}</span>
            <span className="text-xs text-[#34D399] font-medium font-mono">({currentUser.points} pts)</span>
          </div>
          <p className="text-[11px] text-[#A1A8B8]">100 Points = ₹1.00 INR | Live PostgreSQL Wallet</p>
        </div>

        <div className="sm:text-right space-y-1 sm:max-w-xs w-full">
          <div className="flex justify-between sm:justify-end gap-2 text-xs font-medium">
            <span className="text-[#A1A8B8]">₹49 Data Goal</span>
            <span className="text-[#818CF8] font-bold">{rechargeProgress}%</span>
          </div>
          <div className="w-full bg-[#0B0E17] h-2 rounded-full overflow-hidden border border-[#1C2231]">
            <div
              className="bg-gradient-to-r from-[#818CF8] to-[#34D399] h-full transition-all duration-500"
              style={{ width: `${rechargeProgress}%` }}
            />
          </div>
          <span className="text-[10px] text-[#727C91] block">
            Daily Tasks Completed: {currentUser.daily_task_count || 0} / 12
          </span>
        </div>
      </div>

      {alertMsg && (
        <div className={`p-3.5 border text-xs text-center rounded-xl font-medium ${
          alertMsg.includes('❌') || alertMsg.includes('⚠️')
            ? 'bg-[#FB7185]/10 border-[#FB7185]/30 text-[#FB7185]'
            : 'bg-[#34D399]/10 border-[#34D399]/30 text-[#34D399]'
        }`}>
          {alertMsg}
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-3">
        {tasksList.map((task) => (
          <div
            key={task.id}
            className="p-4 bg-[#101522] border border-[#252C3D] rounded-xl flex items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#F8FAFC]">{task.title}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#818CF8]/10 text-[#818CF8] border border-[#818CF8]/20">
                  {task.badge}
                </span>
              </div>
              <p className="text-xs text-[#727C91]">{task.desc}</p>
              <span className="text-[11px] text-[#A1A8B8] block">⏱ Duration: {task.time}</span>
            </div>

            <div className="text-right flex flex-col items-end gap-2 shrink-0">
              <span className="text-xs font-bold text-[#F5B942]">
                +{task.points} pts (₹{(task.points / 100).toFixed(2)})
              </span>
              <button
                onClick={() => startTask(task)}
                className="px-4 py-1.5 bg-[#818CF8] hover:bg-[#6366F1] text-white text-xs font-semibold rounded-lg transition"
              >
                Start
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Force-watch Modal */}
      {videoModalTask && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#101522] border border-[#252C3D] w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl space-y-3.5 p-4 my-auto">
            <div className="flex items-center justify-between border-b border-[#1C2231] pb-2.5">
              <div>
                <h3 className="text-sm font-semibold text-[#F8FAFC]">{videoModalTask.title}</h3>
                <span className="text-[11px] text-[#818CF8] flex items-center gap-1">
                  <ShieldCheck size={12} /> Live Verified Stream
                </span>
              </div>

              {canCloseVideo ? (
                <button
                  onClick={() => { setVideoModalTask(null); setCanCloseVideo(false); }}
                  className="px-3 py-1 bg-[#34D399] text-[#0B0E17] text-xs font-bold rounded-lg hover:bg-[#10B981] transition"
                >
                  Close & Claim
                </button>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FB7185]/10 border border-[#FB7185]/20 text-[#FB7185] text-[11px] font-semibold rounded-lg">
                  <Lock size={12} /> Locked ({videoTimeLeft}s)
                </div>
              )}
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-[#1C2231]">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${videoModalTask.youtubeId}?autoplay=1&controls=1&rel=0&modestbranding=1`}
                title="Finora Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-3 bg-[#151B2B] rounded-xl flex items-center justify-between">
              <span className="text-xs text-[#A1A8B8]">
                {canCloseVideo ? '✅ Completed! Points credited to Postgres.' : '🔒 Video locked until timer hits 0s.'}
              </span>
              <span className="text-sm font-mono font-bold text-[#34D399]">{videoTimeLeft}s</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
