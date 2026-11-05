import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function VaultPage() {
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('user_vouchers');
    if (saved) setVouchers(JSON.parse(saved));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 pb-24">
      <Head>
        <title>My Rewards Vault | RewardRush</title>
      </Head>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-2">
          My Claimed Rewards
        </h1>
        <p className="text-xs text-slate-400 mb-6">మీరు క్లెయిమ్ చేసుకున్న కూపన్లు మరియు వోచర్ కోడ్స్</p>

        {vouchers.length === 0 ? (
          <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-xl">
            <span className="text-4xl block mb-2">🎟️</span>
            <p className="text-slate-400 text-sm">ఇంకా ఎటువంటి వోచర్లు క్లెయిమ్ చేసుకోలేదు.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {vouchers.map((v, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-100">{v.title}</h3>
                  <p className="text-xs text-slate-400">Order ID: {v.redemptionId}</p>
                  <span className="inline-block mt-2 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs rounded">
                    {v.voucherCode}
                  </span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(v.voucherCode);
                    alert('Voucher Code Copied!');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-lg transition"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
