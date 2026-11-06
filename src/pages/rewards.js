import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getLoggedInUser, syncWallet } from '../utils/auth';
import { Smartphone, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RewardsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [targetPhone, setTargetPhone] = useState('');
  const [operator, setOperator] = useState('Jio');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const u = getLoggedInUser();
    if (!u) {
      router.push('/auth');
      return;
    }
    setUser(u);
    setTargetPhone(u.phone || '');
  }, [router]);

  const handleRedeem = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!/^[6-9]\d{9}$/.test(targetPhone)) {
      setStatus({ type: 'error', text: 'Dayachesi valid 10-digit mobile number ivvandi (6, 7, 8, 9 tho start avvali).' });
      return;
    }

    if (!operator) {
      setStatus({ type: 'error', text: 'Dayachesi telecom operator select cheyandi.' });
      return;
    }

    if ((user.points || 0) < 4900) {
      setStatus({ type: 'error', text: '₹49 Recharge kosam minimum 4,900 points undali.' });
      return;
    }

    setLoading(true);
    try {
      const backendUrl = 'https://rewards-app-backend-lq2v.onrender.com';
      const res = await fetch(`${backendUrl}/api/rewards/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: user.phone,
          targetPhone,
          operator,
          planAmount: 49,
          pointsRequired: 4900
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Redemption failed');
      }

      syncWallet(data.user);
      setUser(data.user);
      setStatus({ type: 'success', text: data.message });
    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto space-y-6 pb-24">
      <Head>
        <title>Claim Rewards | RewardRush</title>
      </Head>

      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-black text-white">Redeem Instant Recharge</h1>
        <p className="text-xs text-[#94A3B8]">Exchange your hard-earned points for 1-Day Unlimited Data Packs.</p>
      </div>

      <div className="p-5 bg-gradient-to-br from-[#101522] to-[#1E1B4B] border border-[#6366F1]/30 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Available Balance</span>
          <h3 className="text-2xl font-black text-white">{user.points || 0} <span className="text-xs text-[#818CF8]">pts</span></h3>
        </div>
        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg">
          ₹{((user.points || 0) / 100).toFixed(2)}
        </div>
      </div>

      {status && (
        <div className={`p-4 rounded-2xl text-xs flex items-center gap-2 border ${
          status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{status.text}</span>
        </div>
      )}

      <form onSubmit={handleRedeem} className="p-6 bg-[#101522] border border-[#252C3D] rounded-3xl space-y-4">
        <div>
          <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">Recharge Mobile Number</label>
          <div className="relative">
            <Smartphone size={16} className="absolute left-3.5 top-3.5 text-[#94A3B8]" />
            <input
              type="tel"
              required
              maxLength={10}
              value={targetPhone}
              onChange={(e) => setTargetPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="10-digit number"
              className="w-full bg-[#0B0F17] border border-[#252C3D] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366F1]"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">Select Operator</label>
          <div className="grid grid-cols-4 gap-2">
            {['Jio', 'Airtel', 'Vi', 'BSNL'].map((op) => (
              <button
                type="button"
                key={op}
                onClick={() => setOperator(op)}
                className={`py-2 text-xs font-bold rounded-xl border transition ${
                  operator === op
                    ? 'bg-[#6366F1] border-[#6366F1] text-white shadow-md'
                    : 'bg-[#0B0F17] border-[#252C3D] text-[#94A3B8] hover:border-gray-600'
                }`}
              >
                {op}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-[#0B0F17] border border-[#252C3D] rounded-xl flex items-center justify-between text-xs">
          <span className="text-white font-bold flex items-center gap-1.5">
            <Zap size={14} className="text-amber-400" /> ₹49 Unlimited Data Pack
          </span>
          <span className="text-[#818CF8] font-bold">4,900 pts</span>
        </div>

        <button
          type="submit"
          disabled={loading || (user.points || 0) < 4900}
          className={`w-full py-3 text-xs font-bold rounded-xl transition shadow-lg ${
            (user.points || 0) >= 4900
              ? 'bg-[#6366F1] hover:bg-[#4F46E5] text-white'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          {loading ? 'Processing Recharge...' : 'Confirm & Claim ₹49 Pack'}
        </button>
      </form>
    </div>
  );
}
