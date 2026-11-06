import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getLoggedInUser, syncWallet } from '../utils/auth';
import { apiRequest } from '../utils/api';
import { Flame, Play, Loader2, ShieldCheck, CheckCircle2, Smartphone, FileText, CreditCard, ExternalLink, Sparkles } from 'lucide-react';

export default function TasksPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [timer, setTimer] = useState(0);
  const [activeCategory, setActiveCategory] = useState('daily_ads');
  const [loading, setLoading] = useState(false);
  const [claimMsg, setClaimMsg] = useState('');

  // 1. Mee Live High-CPM Ad Link
  const LIVE_AD_URL = 'https://asiafilm.org/4/2a9f2d1477def572c8eea4e320a1ae30';

  // 130 Daily Instant Ad Tasks (15s duration, 40 pts)
  const dailyAdsList = Array.from({ length: 130 }, (_, index) => ({
    id: `ad_task_${index + 1}`,
    number: index + 1,
    title: `Telecom Sponsor Video Stream #${index + 1}`,
    type: 'High-CPM Ad',
    points: 40,
    duration: 15,
    url: LIVE_AD_URL
  }));

  // 2. High-Ticket Affiliate Partner Tasks (vCommission)
  const affiliateOffers = {
    installs: [
      { id: 'v_happyyou', title: 'HappyYou Android App Install', desc: 'Download app & complete simple registration', points: 1500, tag: 'App Install', url: 'https://network.vcommission.com/click' },
      { id: 'v_xcel', title: 'Xcelviewpoint Survey Sign-up', desc: 'Quick survey profile completion', points: 1200, tag: 'Survey CPR', url: 'https://network.vcommission.com/click' },
      { id: 'v_mcd', title: 'McDonalds Official App', desc: 'Install Android app & explore deals', points: 1000, tag: 'Brand CPR', url: 'https://network.vcommission.com/click' }
    ],
    leads: [
      { id: 'v_fatak', title: 'FatakPaisa Free Credit Score', desc: 'Check eligibility with mobile number in 1 min', points: 2000, tag: 'Quick CPL', url: 'https://network.vcommission.com/click' },
      { id: 'v_fibe', title: 'Fibe Quick Eligibility Check', desc: 'Instant salary/employment verification', points: 2200, tag: 'Free Lead', url: 'https://network.vcommission.com/click' },
      { id: 'v_fundsbull', title: 'FundsBull Advisory Setup', desc: 'Get free insurance/finance quotes online', points: 1800, tag: 'Free Lead', url: 'https://network.vcommission.com/click' },
      { id: 'v_financebuddha', title: 'FinanceBuddha Loan Finder', desc: 'Zero-fee loan comparison form submission', points: 1800, tag: 'Quick Lead', url: 'https://network.vcommission.com/click' }
    ],
    finance: [
      { id: 'v_aubank', title: 'AU Bank Lifetime Free Credit Card', desc: 'Complete paperless digital KYC verification', points: 4900, tag: 'Unlock ₹49 Pack', url: 'https://network.vcommission.com/click' },
      { id: 'v_idfc', title: 'IDFC FIRST WOW Credit Card', desc: 'Zero annual fee instant credit card application', points: 4900, tag: 'Unlock ₹49 Pack', url: 'https://network.vcommission.com/click' },
      { id: 'v_spinny', title: 'Spinny Assured Car Doorstep Test Drive', desc: 'Book a free doorstep inspection test drive', points: 3500, tag: 'Mega Reward', url: 'https://network.vcommission.com/click' }
    ]
  };

  useEffect(() => {
    const user = getLoggedInUser();
    if (!user) {
      router.push('/auth');
    } else {
      setCurrentUser(user);
    }
  }, [router]);

  // Robust Countdown Timer for Daily Ads
  useEffect(() => {
    if (!activeTask) return;

    const endTime = Date.now() + activeTask.duration * 1000;
    setTimer(activeTask.duration);

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setTimer(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        handleCompleteAdTask();
      }
    }, 500);

    return () => clearInterval(interval);
  }, [activeTask]);

  const handleDailyCheckin = async () => {
    if (!currentUser) return;
    setLoading(true);
    const res = await apiRequest('/api/user/daily-checkin', 'POST', { userId: currentUser.id });
    if (res.success) {
      syncWallet(res.user);
      setCurrentUser(res.user);
      setClaimMsg(res.message);
    } else {
      setClaimMsg(`❌ ${res.message}`);
    }
    setLoading(false);
  };

  // Start 15-second Daily Ad Task
  const startDailyAdTask = (task) => {
    if ((currentUser.daily_task_count || 0) >= 130) {
      setClaimMsg('❌ Daily limit (130/130 tasks) completed for today! Midnight reset avthundi.');
      return;
    }
    setActiveTask(task);
    setClaimMsg('');
    if (typeof window !== 'undefined') {
      window.open(task.url, '_blank');
    }
  };

  const handleCompleteAdTask = async () => {
    if (!activeTask || !currentUser) return;
    setLoading(true);

    try {
      const res = await apiRequest('/api/tasks/complete', 'POST', {
        userId: currentUser.id,
        taskId: activeTask.id,
        points: activeTask.points
      });

      if (res.success) {
        syncWallet(res.user);
        setCurrentUser(res.user);
        setClaimMsg(`🎉 +${activeTask.points} Points Credited to Wallet!`);
      } else {
        setClaimMsg(`❌ ${res.message}`);
      }
    } catch (err) {
      setClaimMsg('❌ Verification server issue. Try again.');
    }

    setActiveTask(null);
    setLoading(false);
  };

  // Start High-Ticket Affiliate Task
  const startAffiliateOffer = (offer) => {
    if (!currentUser) return;
    const finalUrl = `${offer.url}?aff_id=133655&sub1=${currentUser.id}&aff_sub=${currentUser.id}`;
    window.open(finalUrl, '_blank');
    setClaimMsg(`🚀 '${offer.title}' opened! S2S verification poorthi ayyaka wallet lo points add avthayi.`);
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-24">
      <Head>
        <title>Earn Points | RewardRush</title>
      </Head>

      {/* Daily Login Streak Card */}
      <div className="p-5 bg-gradient-to-r from-[#101522] via-[#1E1B4B] to-[#101522] border border-[#6366F1]/30 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Flame className="text-amber-400" size={16} /> Daily Login Streak
          </h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">Collect free +25 points every day</p>
        </div>
        <button
          onClick={handleDailyCheckin}
          disabled={loading || !!activeTask}
          className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold text-xs rounded-xl shadow transition"
        >
          Claim 25 pts
        </button>
      </div>

      {claimMsg && (
        <div className={`p-3 text-xs text-center rounded-xl font-medium ${claimMsg.includes('❌') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
          {claimMsg}
        </div>
      )}

      {/* Floating Verification Countdown Timer for Daily Ads */}
      {activeTask && (
        <div className="p-4 bg-[#1E1B4B] border-2 border-[#818CF8] rounded-2xl flex items-center justify-between shadow-2xl animate-pulse">
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin text-[#818CF8]" size={22} />
            <div>
              <p className="text-xs font-bold text-white">Sponsor Ad Verification Active</p>
              <p className="text-[11px] text-[#A5B4FC]">Please wait {timer}s without closing app</p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono text-xl font-black text-[#34D399]">{timer}s</span>
            <span className="block text-[10px] text-[#94A3B8]">+{activeTask.points} pts</span>
          </div>
        </div>
      )}

      {/* ALL CATEGORY NAVIGATION TABS */}
      <div className="grid grid-cols-4 bg-[#101522] p-1.5 rounded-xl border border-[#252C3D] gap-1">
        <button
          onClick={() => setActiveCategory('daily_ads')}
          className={`py-2 text-[11px] font-bold rounded-lg transition flex items-center justify-center gap-1 ${
            activeCategory === 'daily_ads' ? 'bg-[#6366F1] text-white shadow' : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <Sparkles size={13} /> 130 Daily Ads
        </button>

        <button
          onClick={() => setActiveCategory('installs')}
          className={`py-2 text-[11px] font-bold rounded-lg transition flex items-center justify-center gap-1 ${
            activeCategory === 'installs' ? 'bg-[#6366F1] text-white shadow' : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <Smartphone size={13} /> App Installs
        </button>

        <button
          onClick={() => setActiveCategory('leads')}
          className={`py-2 text-[11px] font-bold rounded-lg transition flex items-center justify-center gap-1 ${
            activeCategory === 'leads' ? 'bg-[#6366F1] text-white shadow' : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <FileText size={13} /> Quick Leads
        </button>

        <button
          onClick={() => setActiveCategory('finance')}
          className={`py-2 text-[11px] font-bold rounded-lg transition flex items-center justify-center gap-1 ${
            activeCategory === 'finance' ? 'bg-[#6366F1] text-white shadow' : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <CreditCard size={13} /> Mega Finance
        </button>
      </div>

      {/* TAB CONTENT: 130 DAILY ADS POOL */}
      {activeCategory === 'daily_ads' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Daily 15s Ad Tasks ({currentUser.daily_task_count || 0}/130 Completed)
            </h3>
            <span className="text-xs font-bold text-[#34D399]">
              Goal: 4,900 pts (₹49 Data Pack)
            </span>
          </div>

          <div className="space-y-2.5">
            {dailyAdsList.map((task, idx) => {
              const isCompleted = idx < (currentUser.daily_task_count || 0);

              return (
                <div 
                  key={task.id}
                  className={`p-4 bg-[#101522] border rounded-xl flex items-center justify-between transition ${
                    isCompleted ? 'border-[#1C2231] opacity-50' : 'border-[#252C3D] hover:border-[#6366F1]/50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{task.title}</span>
                      <span className="text-[10px] bg-[#6366F1]/20 text-[#818CF8] px-2 py-0.5 rounded font-mono">
                        15s Stream
                      </span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8]">View sponsor link for 15 seconds to credit points</p>
                  </div>

                  {isCompleted ? (
                    <span className="text-xs font-bold text-[#34D399] flex items-center gap-1">
                      <CheckCircle2 size={16} /> Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => startDailyAdTask(task)}
                      disabled={!!activeTask || loading || (currentUser.daily_task_count || 0) >= 130}
                      className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] disabled:opacity-40 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow"
                    >
                      <Play size={12} fill="white" /> Start <span className="text-[#34D399]">+{task.points}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: HIGH VALUE AFFILIATE OFFERS */}
      {activeCategory !== 'daily_ads' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              {activeCategory === 'installs' && 'Instant App Installs & Survey Registrations'}
              {activeCategory === 'leads' && 'Free Financial Eligibility & Quick CPL Submissions'}
              {activeCategory === 'finance' && 'High Payout Products (Instant 4,900 pts Unlock)'}
            </h3>
            <span className="text-xs font-bold text-[#34D399]">
              Balance: {currentUser.points || 0} pts
            </span>
          </div>

          <div className="space-y-2.5">
            {affiliateOffers[activeCategory].map((offer) => (
              <div 
                key={offer.id}
                className="p-4 bg-[#101522] border border-[#252C3D] hover:border-[#6366F1]/50 rounded-xl flex items-center justify-between transition gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white">{offer.title}</h4>
                    <span className="text-[10px] bg-[#6366F1]/20 text-[#818CF8] px-2 py-0.5 rounded font-mono">
                      {offer.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8]">{offer.desc}</p>
                </div>

                <button
                  onClick={() => startAffiliateOffer(offer)}
                  className="shrink-0 px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow"
                >
                  Claim <span className="text-[#34D399]">+{offer.points} pts</span> <ExternalLink size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
