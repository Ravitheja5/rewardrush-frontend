import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getAuthSession, fetchLiveUserFromDB } from '../utils/auth';
import { Smartphone, Zap, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function RewardsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [operator, setOperator] = useState('Jio');
  const [mobileNumber, setMobileNumber] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const loadUserData = async () => {
    setLoading(true);
    const liveUser = await fetchLiveUserFromDB();
    if (!liveUser) {
      router.push('/auth');
      return;
    }
    setUser(liveUser);
    setMobileNumber(liveUser.phone || '');
    setLoading(false);
  };

  useEffect(() => {
    const session = getAuthSession();
    if (!session) {
      router.push('/auth');
      return;
    }
    loadUserData();
  }, [router]);

  const handleRedeemRecharge = async () => {
    if (!user) return;
    setStatusMsg(null);

    if (!mobileNumber || mobileNumber.length !== 10) {
      setStatusMsg({ type: 'error', text: 'Correct 10-digit mobile number enter cheyandi!' });
      return;
    }

    if (user.points < 4900) {
      setStatusMsg({ type: 'error', text: 'Chaalina points levu! Kaniisam 4900 points kavali.' });
      return;
    }

    setRedeeming(true);
    try {
      const backendUrl = 'https://rewards-app-backend-lq2v.onrender.com';
      const res = await fetch(`${backendUrl}/api/rewards/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: user.phone,
          rewardType: 'DATA_PACK_49',
          targetPhone: mobileNumber,
          operator: operator,
          pointsCost: 4900
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Redemption failed');
      }

      // Live DB nundi updated points set avthayi
      setUser(data.user);
      setStatusMsg({
        type: 'success',
        text: `🎉 ₹49 Data Pack Recharge Request Submitted! Reference ID: ${data.orderId || 'RR-REQ-LIVE'}`
      });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setRedeeming(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
        <RefreshCw className="animate-spin text-[#6366F1] mb-2" size={32} />
        <p className="text-xs text-[#94A3B8]">Loading live balance from DB...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      <Head>
        <title>Redeem Rewards | RewardRush</title>
      </Head>

      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-black text-white">Mobile Recharge Store</h1>
        <p className="text-xs text-[#94A3B8]">
          Available Live Balance: <strong className="text-emerald-400">{user.points} pts</strong> (≈ ₹{(user.points / 100).toFixed(2)})
        </p>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-xl text-xs text-center border font-medium ${
          statusMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          {statusMsg.text}
        </div>
      )}

      <div className="p-6 bg-[#101522] border border-[#252C3D] rounded-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Zap size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">₹49 - 1-Day Unlimited Data Pack</h3>
            <p className="text-xs text-[#94A3B8]">Jio / Airtel / Vi high speed data booster pack</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1">Target Mobile Number</label>
            <input
              type="tel"
              maxLength={10}
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="10-digit mobile number"
              className="w-full bg-[#0B0F17] border border-[#252C3D] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366F1]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1">Telecom Operator</label>
            <div className="grid grid-cols-3 gap-2">
              {['Jio', 'Airtel', 'Vi'].map((op) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => setOperator(op)}
                  className={`py-2 text-xs font-bold rounded-xl border transition ${
                    operator === op ? 'bg-[#6366F1] border-[#6366F1] text-white' : 'bg-[#0B0F17] border-[#252C3D] text-[#94A3B8]'
                  }`}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleRedeemRecharge}
            disabled={redeeming || user.points < 4900}
            className={`w-full py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              user.points < 4900
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
            }`}
          >
            {redeeming ? 'Processing in Database...' : 'Redeem Now (4900 Pts)'}
          </button>
        </div>
      </div>
    </div>
  );
}
