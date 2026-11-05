import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getLoggedInUser, getAllUsers } from '../utils/auth';
import { Zap, ArrowRight } from 'lucide-react';

export default function StorePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [operator, setOperator] = useState('JIO');
  const [rechargeNumber, setRechargeNumber] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    const user = getLoggedInUser();
    if (!user) {
      router.push('/auth');
    } else {
      setCurrentUser(user);
      setRechargeNumber(user.phone || '');
    }
  }, [router]);

  const handleRedeem = (e) => {
    e.preventDefault();
    setStatusMsg('');

    if (!currentUser) return;
    if ((currentUser.points || 0) < 4900) {
      setStatusMsg('❌ Insufficient Points! You need 4,900 points (₹49.00) to redeem this pack.');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(rechargeNumber)) {
      setStatusMsg('❌ Enter a valid 10-digit mobile number.');
      return;
    }

    const users = getAllUsers();
    users[currentUser.phone].points -= 4900;
    users[currentUser.phone].claimedRecharges = users[currentUser.phone].claimedRecharges || [];
    users[currentUser.phone].claimedRecharges.push({
      amount: 49,
      operator,
      number: rechargeNumber,
      date: new Date().toISOString(),
      status: 'Processing'
    });

    localStorage.setItem('rr_users_db', JSON.stringify(users));
    setCurrentUser({ ...users[currentUser.phone] });
    setStatusMsg('🎉 Recharge request submitted! Your ₹49 pack will be activated within 15 minutes.');
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-12">
      <Head>
        <title>Data Recharge Store | Finora Rewards</title>
      </Head>

      <div className="border-b border-[#1C2231] pb-4">
        <h1 className="text-xl font-semibold text-[#F8FAFC]">Data Recharge Store</h1>
        <p className="text-xs text-[#A1A8B8] mt-0.5">
          Redeem your points directly for 1-Day Unlimited High-Speed Data Packs
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-3.5 border text-xs text-center rounded-xl font-medium ${
            statusMsg.includes('❌')
              ? 'bg-[#FB7185]/10 border-[#FB7185]/30 text-[#FB7185]'
              : 'bg-[#34D399]/10 border-[#34D399]/30 text-[#34D399]'
          }`}
        >
          {statusMsg}
        </div>
      )}

      <div className="p-5 bg-[#101522] border border-[#818CF8]/40 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#818CF8]/20 text-[#818CF8] rounded-xl">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">₹49 Unlimited Data Pack</h3>
              <p className="text-xs text-[#34D399]">Valid for 24 Hours • High Speed 4G/5G</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-[#818CF8] text-white font-mono font-bold text-xs rounded-lg">
            4,900 pts
          </span>
        </div>

        <form onSubmit={handleRedeem} className="space-y-3 pt-2 border-t border-[#1C2231]">
          <div className="space-y-1">
            <label className="text-xs font-medium text-[#A1A8B8]">Select Telecom Operator</label>
            <div className="grid grid-cols-3 gap-2">
              {['JIO', 'AIRTEL', 'VI'].map((op) => (
                <button
                  type="button"
                  key={op}
                  onClick={() => setOperator(op)}
                  className={`py-2 text-xs font-bold rounded-lg border transition ${
                    operator === op
                      ? 'bg-[#818CF8] text-white border-[#818CF8]'
                      : 'bg-[#0B0E17] text-[#A1A8B8] border-[#252C3D] hover:bg-[#151B2B]'
                  }`}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[#A1A8B8]">Recharge Mobile Number</label>
            <input
              type="tel"
              maxLength={10}
              value={rechargeNumber}
              onChange={(e) => setRechargeNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 10-digit number"
              className="w-full px-3.5 py-2.5 bg-[#0B0E17] border border-[#252C3D] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#818CF8]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#34D399] hover:bg-[#10B981] text-[#0A0D14] font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-[#34D399]/20"
          >
            Claim ₹49 Instant Recharge <ArrowRight size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
