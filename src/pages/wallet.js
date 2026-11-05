import React from 'react';
import Head from 'next/head';

export default function WalletPage() {
  const transactions = [
    { type: 'DAILY_CHECKIN', title: 'Daily Check-in Bonus', date: 'Today · 00:05 IST', amount: '+10 pts', positive: true },
    { type: 'TASK_APPROVED', title: 'Tata Neu SuperApp Installation', date: 'Nov 4 · 18:22 IST', amount: '+250 pts', positive: true },
    { type: 'REDEMPTION_DEBIT', title: 'Airtel 1GB Data Top-up', date: 'Nov 3 · 14:10 IST', amount: '-190 pts', positive: false },
  ];

  return (
    <div className="space-y-6">
      <Head>
        <title>Wallet Ledger | RewardRush</title>
      </Head>

      <div className="border-b border-[#1C2231] pb-4">
        <h1 className="text-xl font-semibold text-[#F8FAFC]">Wallet & Ledger</h1>
        <p className="text-xs text-[#A1A8B8] mt-0.5">Authoritative balance ledger backed by atomic server transactions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-5 bg-[#101522] border border-[#252C3D] rounded-xl">
          <span className="text-xs text-[#727C91] uppercase tracking-wider">Available Points</span>
          <div className="text-2xl font-semibold text-[#F8FAFC] mt-1 tabular-nums">2,450 pts</div>
          <span className="text-xs text-[#A1A8B8] font-mono mt-0.5 block">≈ ₹245.00</span>
        </div>
        <div className="p-5 bg-[#101522] border border-[#252C3D] rounded-xl">
          <span className="text-xs text-[#727C91] uppercase tracking-wider">Pending Approvals</span>
          <div className="text-2xl font-semibold text-[#A1A8B8] mt-1 tabular-nums">380 pts</div>
          <span className="text-xs text-[#727C91] mt-0.5 block">Locked pending network reconciliation</span>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-[#F8FAFC]">Transaction Ledger</h2>
        <div className="bg-[#101522] border border-[#252C3D] rounded-xl divide-y divide-[#1C2231]">
          {transactions.map((tx, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-medium text-[#F8FAFC]">{tx.title}</h4>
                <span className="text-[11px] text-[#727C91]">{tx.date}</span>
              </div>
              <span className={`text-xs font-semibold tabular-nums ${tx.positive ? 'text-[#34D399]' : 'text-[#FB7185]'}`}>
                {tx.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
