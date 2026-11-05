import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function VaultPage() {
  const [vouchers, setVouchers] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('user_vouchers');
    if (saved) {
      setVouchers(JSON.parse(saved));
    }
  }, []);

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 pb-28">
      <Head>
        <title>My Rewards Vault | RewardRush</title>
      </Head>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              My Rewards Vault
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Active vouchers, food coupons & data recharges</p>
          </div>
          <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold rounded-full">
            {vouchers.length} Rewards
          </span>
        </div>

        {/* Empty State */}
        {vouchers.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-900/40 border border-slate-800/60 rounded-3xl backdrop-blur-sm">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-800/60 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-slate-700/40">
              🎟️
            </div>
            <h3 className="text-base font-semibold text-slate-200">No Vouchers Claimed Yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Complete tasks or daily check-ins to earn points and claim your first voucher.
            </p>
            <Link
              href="/store"
              className="mt-5 inline-block px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:opacity-95 transition"
            >
              Browse Rewards Store
            </Link>
          </div>
        ) : (
          /* Real Coupon Cards */
          <div className="space-y-4">
            {vouchers.map((v) => (
              <div
                key={v.redemptionId}
                className="relative bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl"
              >
                {/* Brand Banner */}
                <div className="p-4 flex items-center justify-between border-b border-dashed border-slate-800/80 bg-slate-900/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl shadow-inner border border-slate-700/50">
                      {v.brand?.toLowerCase().includes('swiggy') ? '🍔' :
                       v.brand?.toLowerCase().includes('zomato') ? '🍕' :
                       v.brand?.toLowerCase().includes('jio') ? '📶' : '📡'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{v.title}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">ID: {v.redemptionId}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                    {v.status || 'Active'}
                  </span>
                </div>

                {/* Coupon Code Strip */}
                <div className="p-4 flex items-center justify-between gap-3">
                  <div className="flex-1 bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-xl font-mono text-sm tracking-wider text-amber-400 font-bold select-all overflow-hidden text-ellipsis">
                    {v.voucherCode}
                  </div>
                  <button
                    onClick={() => copyCode(v.voucherCode, v.redemptionId)}
                    className={`px-4 py-2.5 text-xs font-bold rounded-xl transition shadow-md ${
                      copiedId === v.redemptionId
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/50'
                    }`}
                  >
                    {copiedId === v.redemptionId ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
