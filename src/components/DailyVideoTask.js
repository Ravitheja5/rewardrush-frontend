import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, Clock, Loader2 } from 'lucide-react';

const BACKEND_URL = 'https://rewards-app-backend-lq2v.onrender.com';

export default function DailyVideoTask({ user, taskId = 'video_01', title = 'Daily Video Task #1', videoUrl = 'https://youtube.com', points = 38, onClaimSuccess }) {
  const [status, setStatus] = useState('idle'); // idle | running | can_claim | completed
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch initial completed state for today
  useEffect(() => {
    const checkState = async () => {
      const uId = user?.id || user?.phone;
      if (!uId) return;
      try {
        const res = await fetch(`${BACKEND_URL}/api/tasks/status/${uId}`);
        const data = await res.json();
        if (data?.completedTaskIds?.includes(taskId)) {
          setStatus('completed');
        }
      } catch (e) {
        console.error(e);
      }
    };
    checkState();
  }, [user, taskId]);

  // Countdown timer
  useEffect(() => {
    let interval = null;
    if (status === 'running' && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (status === 'running' && secondsLeft === 0) {
      setStatus('can_claim');
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [status, secondsLeft]);

  const handleStart = async () => {
    setErrorMsg('');
    const uId = user?.id || user?.phone;
    if (!uId) {
      setErrorMsg('Please login to start task');
      return;
    }

    // Open video link in a new tab
    window.open(videoUrl, '_blank');

    // Notify backend task has started
    try {
      await fetch(`${BACKEND_URL}/api/tasks/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: uId, task_id: taskId }),
      });
      setStatus('running');
      setSecondsLeft(60);
    } catch (e) {
      console.error(e);
      setStatus('running'); // continue locally anyway
    }
  };

  const handleClaim = async () => {
    setLoading(true);
    setErrorMsg('');
    const uId = user?.id || user?.phone;

    try {
      const res = await fetch(`${BACKEND_URL}/api/tasks/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: uId, task_id: taskId, points }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to claim');
        setLoading(false);
        return;
      }

      setStatus('completed');
      if (onClaimSuccess) onClaimSuccess(data.pointsAwarded);
    } catch (e) {
      setErrorMsg('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#101522] border border-[#252C3D] rounded-2xl p-4 flex items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-black text-white">{title}</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            60s Timer
          </span>
        </div>
        <p className="text-xs text-[#94A3B8] mt-1">Watch and engage for 60 seconds to earn points.</p>
        <div className="text-xs font-black text-emerald-400 mt-2">+{points} Points</div>
        {errorMsg && <div className="text-[11px] text-rose-400 mt-1">{errorMsg}</div>}
      </div>

      <div>
        {status === 'completed' && (
          <button disabled className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-not-allowed">
            <CheckCircle2 size={16} /> Claimed
          </button>
        )}

        {status === 'idle' && (
          <button onClick={handleStart} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition">
            Start <Play size={13} fill="currentColor" />
          </button>
        )}

        {status === 'running' && (
          <div className="px-4 py-2 bg-[#1B2234] border border-[#2B354C] text-[#94A3B8] rounded-xl text-xs font-bold flex items-center gap-2">
            <Clock size={14} className="animate-pulse text-indigo-400" />
            <span>{secondsLeft}s left</span>
          </div>
        )}

        {status === 'can_claim' && (
          <button onClick={handleClaim} disabled={loading} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition animate-bounce">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
            Claim +{points} Pts
          </button>
        )}
      </div>
    </div>
  );
}
