import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getAuthSession, fetchLiveUserFromDB } from '../utils/auth';
import { Zap, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

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
    setMobileNumber(String(liveUser.phone || '').replace(/\D/g, '').slice(-10));
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

  const handleRedeem = async () => {
    setStatusMsg(null);
    const sanitized = String(mobileNumber || '').trim().replace(/\D/g, '').slice(-10);

    if (sanitized.length !== 10 || !/^[6-9]\d{9}$/.test(sanitized)) {
      setStatusMsg({
        type: 'error',
        text: 'Please enter a valid 10-digit Indian mobile number.'
      });
      return;
    }

    if (!user || user.points < 4900) {
      setStatusMsg({
        type: 'error',
        text: 'Insufficient points balance. You need at least 4,900 points.'
      });
      return;
    }

    setRedeeming(true);
    try {
      const res = await fetch('https://rewards-app-backend-lq2v.onrender.com/api/rewards/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: user.phone,
          targetPhone: sanitized,
          operator: operator,
          pointsCost: 4900,
          rewardType: 'DATA_PACK_49'
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Redemption request failed.');
      }

      setUser(data.user);
      setStatusMsg({
        type: 'success',
        text: 'Recharge order placed successfully! Order ID: #' + (data.redemption?.id || data.orderId || 'REQ-LIVE') + '. Status: PENDING Admin Approval.'
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
        <p className="text-xs text-[#94A3B8]">Loading live balance from database...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-28 px-4 pt-4 text-white">
      <Head>
        <title>Mobile Recharge Store | RewardRush</title>
      </Head>

      <div className="space-y-1">
        <h1 className="text-2xl font-black">Mobile Recharge Store</h1>
        <p className="text-xs text-[#94A3B8]">
          Available Live Balance: <strong className="text-emerald-400">{user.points} pts</strong> (≈ ₹{(user.points / 100).toFixed(2)})
        </p>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-xl text-xs font-medium border flex items-center gap-2 ${
          statusMsg.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 size={16} className="shrink-0" /> : <AlertCircle size={16} className="shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <div className="p-6 bg-[#101522] border border-[#252C3D] rounded-2xl space-y-5 shadow-xl">
        <div className="p-4 bg-[#0B0F17] border border-[#252C3D] rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Zap size={22} />
            </div>
            <div>
              <h3 className="text-sm font-bold">₹49 - 1-Day Unlimited Data Pack</h3>
              <p className="text-[11px] text-[#94A3B8]">High speed 4G/5G data pack for Jio, Airtel, and Vi</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-[#6366F1]/20 border border-[#6366F1]/30 text-[#818CF8] text-xs font-black rounded-lg">
            4,900 pts
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1.5">
              Select Telecom Operator
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Jio', 'Airtel', 'Vi'].map((op) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => setOperator(op)}
                  className={`py-2.5 text-xs font-bold rounded-xl border transition ${
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

          <div>
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1.5">
              Target Recharge Mobile Number
            </label>
            <input
              type="tel"
              maxLength={10}
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 10-digit mobile number"
              className="w-full bg-[#0B0F17] border border-[#252C3D] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366F1]"
            />
          </div>

          <button
            onClick={handleRedeem}
            disabled={redeeming || user.points < 4900}
            className={`w-full py-3.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              user.points < 4900
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
            }`}
          >
            {redeeming ? 'Processing in Database...' : 'Redeem Now (4,900 Pts)'}
          </button>
        </div>
      </div>
    </div>
  );
}
