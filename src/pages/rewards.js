import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getLoggedInUser, syncWallet } from '../utils/auth';
import { apiRequest } from '../utils/api';
import { Zap, CheckCircle2, AlertCircle, Clock, ShieldCheck } from 'lucide-react';

export default function RewardsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [phone, setPhone] = useState('');
  const [operator, setOperator] = useState('JIO');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    const user = getLoggedInUser();
    if (!user) {
      router.push('/auth');
    } else {
      setCurrentUser(user);
      setPhone(user.phone || '');
    }
  }, [router]);

  const handleRecharge = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setStatusMsg('❌ Please enter a valid 10-digit mobile number');
      return;
    }

    if ((currentUser.points || 0) < 4900) {
      setStatusMsg('❌ Insufficient balance! 4,900 points required for ₹49 Data Pack.');
      return;
    }

    setLoading(true);
    setStatusMsg('');

    try {
      const res = await apiRequest('/api/store/recharge', 'POST', {
        userId: currentUser.id,
        phone,
        operator
      });

      if (res.success) {
        const updatedPoints = (currentUser.points || 0) - 4900;
        const updatedUser = { ...currentUser, points: updatedPoints };
        syncWallet(updatedUser);
        setCurrentUser(updatedUser);
        setStatusMsg('✅ Recharge request submitted! Manual operator verification completes in 2-6 hours.');
      } else {
        setStatusMsg(`❌ ${res.message}`);
      }
    } catch (err) {
      setStatusMsg('❌ Server connectivity issue. Please try again.');
    }

    setLoading(false);
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-24">
      <Head>
        <title>Rewards Store | RewardRush</title>
      </Head>

      {/* Balance Overview */}
      <div className="p-6 bg-gradient-to-br from-[#101522] via-[#1E1B4B] to-[#101522] border border-[#6366F1]/30 rounded-2xl flex items-center justify-between shadow-lg">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#94A3B8]">Current Balance</span>
          <h2 className="text-2xl font-black text-white mt-1">{currentUser.points || 0} pts</h2>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-[#818CF8]">Goal Status</span>
          <p className="text-xs font-bold text-[#34D399] mt-1">
            {currentUser.points >= 4900 ? 'Eligible for ₹49 Pack' : `${4900 - (currentUser.points || 0)} pts needed`}
          </p>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="p-4 bg-[#101522] border border-[#252C3D] rounded-xl flex items-center gap-3">
        <Clock className="text-[#818CF8] shrink-0" size={20} />
        <p className="text-xs text-[#94A3B8]">
          <strong className="text-white">Manual Verification SLA:</strong> All telecom data pack recharges are manually verified and processed within 2 to 6 hours.
        </p>
      </div>

      {/* Redemption Form */}
      <div className="p-6 bg-[#101522] border border-[#252C3D] rounded-2xl space-y-4">
        <div className="flex items-center gap-2 border-b border-[#252C3D] pb-3">
          <Zap className="text-amber-400" size={18} />
          <h3 className="text-sm font-bold text-white">Redeem ₹49 Telecom Data Pack</h3>
        </div>

        {statusMsg && (
          <div className={`p-3 text-xs text-center rounded-xl font-medium ${statusMsg.includes('❌') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
            {statusMsg}
          </div>
        )}

        <form onSubmit={handleRecharge} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">Mobile Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={10}
              placeholder="Enter 10-digit mobile number"
              className="w-full bg-[#0B0F17] border border-[#252C3D] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366F1]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">Operator</label>
            <select
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="w-full bg-[#0B0F17] border border-[#252C3D] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366F1]"
            >
              <option value="JIO">Jio</option>
              <option value="AIRTEL">Airtel</option>
              <option value="VI">Vodafone Idea (Vi)</option>
              <option value="BSNL">BSNL</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || (currentUser.points || 0) < 4900}
            className="w-full py-3 bg-[#6366F1] hover:bg-[#4F46E5] disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-lg transition"
          >
            {loading ? 'Submitting...' : 'Claim ₹49 Data Pack (4,900 pts)'}
          </button>
        </form>
      </div>
    </div>
  );
}
