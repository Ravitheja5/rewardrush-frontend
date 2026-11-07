import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, Clock, Loader2, X, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';

const BACKEND_URL = 'https://rewards-app-backend-lq2v.onrender.com';

export default function DailyVideoTask({
  user,
  taskId = 'video_01',
  title = 'Daily Video Task #1',
  videoUrl = 'https://youtube.com',
  points = 38,
  onClaimSuccess
}) {
  const [modalOpen, setModalOpen] = useState(false);
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

  // Countdown timer inside modal
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
      setErrorMsg('Please log in first to begin this task.');
      return;
    }

    // Open Video destination in new tab
    window.open(videoUrl, '_blank');

    // Open Big Pop-up Modal
    setModalOpen(true);
    setSecondsLeft(60);
    setStatus('running');

    // Register task session start on server
    try {
      await fetch(`${BACKEND_URL}/api/tasks/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: uId, task_id: taskId }),
      });
    } catch (e) {
      console.error(e);
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
        setErrorMsg(data.error || 'Unable to claim reward.');
        setLoading(false);
        return;
      }

      setStatus('completed');
      setModalOpen(false);
      if (onClaimSuccess) onClaimSuccess(data.pointsAwarded);
    } catch (e) {
      setErrorMsg('Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = Math.round(((60 - secondsLeft) / 60) * 100);

  return (
    <>
      {/* Task Card in List */}
      <div className="bg-[#101522] border border-[#252C3D] rounded-2xl p-4 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-white">{title}</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              60s Verification
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">Watch video content and verify engagement to earn points.</p>
          <div className="text-xs font-black text-emerald-400 mt-2">+{points} Points</div>
          {errorMsg && <div className="text-[11px] text-rose-400 mt-1">{errorMsg}</div>}
        </div>

        <div>
          {status === 'completed' ? (
            <button disabled className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-not-allowed">
              <CheckCircle2 size={16} /> Completed
            </button>
          ) : (
            <button
              onClick={() => {
                if (status === 'running' || status === 'can_claim') {
                  setModalOpen(true);
                } else {
                  handleStart();
                }
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              {status === 'running' ? 'View Timer' : 'Start Task'} <Play size={13} fill="currentColor" />
            </button>
          )}
        </div>
      </div>

      {/* Big Pop-up Modal Window */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#111726] border border-[#2B354C] rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
            
            {/* Close / Dismiss */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#1C253B] transition"
            >
              <X size={20} />
            </button>

            {/* Badge & Title */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                <ShieldCheck size={14} /> Task Verification in Progress
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{title}</h2>
              <p className="text-xs sm:text-sm text-[#94A3B8]">
                Please watch the opened video tab for at least 60 seconds. Do not close this session.
              </p>
            </div>

            {/* Big Countdown Circle Display */}
            <div className="py-2 flex flex-col items-center justify-center">
              <div className="relative w-36 h-36 flex items-center justify-center rounded-full bg-[#182138] border-4 border-[#232F4D]">
                <div className="text-center">
                  <div className="text-4xl font-extrabold text-white tracking-tight">
                    {status === 'can_claim' ? '0' : secondsLeft}
                  </div>
                  <div className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                    Seconds
                  </div>
                </div>
              </div>

              {/* Linear Progress Indicator */}
              <div className="w-full bg-[#182138] h-2.5 rounded-full mt-6 overflow-hidden border border-[#232F4D]">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                <AlertCircle size={15} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="space-y-3">
              {status === 'can_claim' ? (
                <button
                  onClick={handleClaim}
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition animate-bounce"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Verifying & Crediting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      <span>Claim +{points} Points Reward</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#1C253B] border border-[#2B354C] text-[#64748B] font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <Clock size={16} className="animate-spin" />
                  <span>Timer Running ({secondsLeft}s remaining)</span>
                </button>
              )}

              <button
                onClick={() => window.open(videoUrl, '_blank')}
                className="w-full py-2.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center justify-center gap-1.5 transition"
              >
                Re-open Video Tab <ExternalLink size={13} />
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
