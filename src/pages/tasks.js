import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getLoggedInUser, syncWallet } from '../utils/auth';
import { apiRequest } from '../utils/api';
import { Flame, Play, ShieldCheck, CheckCircle2, Smartphone, FileText, CreditCard, ExternalLink } from 'lucide-react';

export default function TasksPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('installs');
  const [loading, setLoading] = useState(false);
  const [claimMsg, setClaimMsg] = useState('');

  useEffect(() => {
    const user = getLoggedInUser();
    if (!user) {
      router.push('/auth');
    } else {
      setCurrentUser(user);
    }
  }, [router]);

  // Verified Campaigns Categorized
  const campaigns = {
    installs: [
      {
        id: 'vcomm_happyyou',
        title: 'HappyYou App Download & Sign-up',
        desc: 'Install Android app and register for instant bonus points',
        points: 1500,
        badge: 'Easy Install',
        base_url: 'https://network.vcommission.com/click'
      },
      {
        id: 'vcomm_xcel',
        title: 'Xcelviewpoint Quick Opinion Survey',
        desc: 'Complete simple profile registration to qualify',
        points: 1200,
        badge: 'Survey CPR',
        base_url: 'https://network.vcommission.com/click'
      },
      {
        id: 'vcomm_mcdonalds',
        title: 'McDonalds Official App Install',
        desc: 'Install McDonalds Android app from PlayStore and open',
        points: 1000,
        badge: 'Top Brand',
        base_url: 'https://network.vcommission.com/click'
      }
    ],
    leads: [
      {
        id: 'vcomm_fatakpaisa',
        title: 'FatakPaisa Free Credit Score Check',
        desc: 'Enter mobile number and verify basic credit score eligibility',
        points: 2000,
        badge: 'Quick Lead',
        base_url: 'https://network.vcommission.com/click'
      },
      {
        id: 'vcomm_fibe',
        title: 'Fibe Quick Eligibility Verification',
        desc: 'Fill basic salary/employment details form',
        points: 2200,
        badge: 'Instant CPL',
        base_url: 'https://network.vcommission.com/click'
      },
      {
        id: 'vcomm_fundsbull',
        title: 'FundsBull Financial Profile Setup',
        desc: 'Check free financial advisory quotes online',
        points: 1800,
        badge: 'Free Lead',
        base_url: 'https://network.vcommission.com/click'
      },
      {
        id: 'vcomm_financebuddha',
        title: 'FinanceBuddha Loan Comparison',
        desc: 'Compare personal finance options with zero fees',
        points: 1800,
        badge: 'Instant CPL',
        base_url: 'https://network.vcommission.com/click'
      }
    ],
    finance: [
      {
        id: 'vcomm_aubank',
        title: 'AU Small Finance Bank Lifetime Credit Card',
        desc: 'Apply online with basic KYC documents',
        points: 4900,
        badge: '1-Click Data Pack',
        base_url: 'https://network.vcommission.com/click'
      },
      {
        id: 'vcomm_idfc',
        title: 'IDFC FIRST WOW Credit Card',
        desc: 'Instant approval zero-fee digital card application',
        points: 4900,
        badge: '1-Click Data Pack',
        base_url: 'https://network.vcommission.com/click'
      },
      {
        id: 'vcomm_spinny',
        title: 'Spinny Assured Car Free Doorstep Test Drive',
        desc: 'Book a free inspection test drive in your city',
        points: 3500,
        badge: 'High Value',
        base_url: 'https://network.vcommission.com/click'
      }
    ]
  };

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

  const handleStartTask = (task) => {
    if (!currentUser) return;
    // Embed user id in tracking parameter for S2S Postback
    const trackingUrl = `${task.base_url}?aff_id=133655&sub1=${currentUser.id}&aff_sub=${currentUser.id}`;
    window.open(trackingUrl, '_blank');
    setClaimMsg(`🚀 Task launched! Complete instructions on the sponsor page. Points will be auto-credited upon verification.`);
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-24">
      <Head>
        <title>Tasks & Offers | RewardRush</title>
      </Head>

      {/* Daily Bonus */}
      <div className="p-5 bg-gradient-to-r from-[#101522] via-[#1E1B4B] to-[#101522] border border-[#6366F1]/30 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Flame className="text-amber-400" size={16} /> Daily Streak Reward
          </h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">Collect +25 points free everyday</p>
        </div>
        <button
          onClick={handleDailyCheckin}
          disabled={loading}
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

      {/* CATEGORY TABS */}
      <div className="flex bg-[#101522] p-1.5 rounded-xl border border-[#252C3D] gap-1">
        <button
          onClick={() => setActiveTab('installs')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
            activeTab === 'installs' ? 'bg-[#6366F1] text-white shadow' : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <Smartphone size={14} /> Easy Installs
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
            activeTab === 'leads' ? 'bg-[#6366F1] text-white shadow' : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <FileText size={14} /> Quick Leads
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
            activeTab === 'finance' ? 'bg-[#6366F1] text-white shadow' : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <CreditCard size={14} /> Mega Finance
        </button>
      </div>

      {/* TASKS LIST ACCORDING TO TAB */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
            {activeTab === 'installs' && 'Mobile Apps & Surveys (Instant Install)'}
            {activeTab === 'leads' && 'Free Eligibility & Form Submissions'}
            {activeTab === 'finance' && 'High Payout Products (Instant ₹49 Data Pack Unlock)'}
          </span>
          <span className="text-xs font-bold text-[#34D399]">
            Wallet: {currentUser.points || 0} pts
          </span>
        </div>

        <div className="space-y-2.5">
          {campaigns[activeTab].map((task) => (
            <div 
              key={task.id}
              className="p-4 bg-[#101522] border border-[#252C3D] hover:border-[#6366F1]/50 rounded-xl flex items-center justify-between transition gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white">{task.title}</h4>
                  <span className="text-[10px] bg-[#6366F1]/20 text-[#818CF8] px-2 py-0.5 rounded font-mono">
                    {task.badge}
                  </span>
                </div>
                <p className="text-[11px] text-[#94A3B8]">{task.desc}</p>
              </div>

              <button
                onClick={() => handleStartTask(task)}
                className="shrink-0 px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow"
              >
                Claim <span className="text-[#34D399]">+{task.points} pts</span> <ExternalLink size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
