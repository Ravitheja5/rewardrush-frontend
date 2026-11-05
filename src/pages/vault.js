import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Copy, Check, Ticket } from 'lucide-react';

export default function VaultPage() {
  const [vouchers, setVouchers] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('user_vouchers');
    if (saved) setVouchers(JSON.parse(saved));
  }, []);

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <Head>
        <title>Rewards Vault | RewardRush</title>
      </Head>

      <div className="border-b border-[#1C2231] pb-4">
        <h1 className="text-xl font-semibold text-[#F8FAFC]">Rewards Vault</h1>
        <p className="text-xs text-[#A1A8B8] mt-0.5">Your claimed gift codes and active telecom recharge packs</p>
      </div>

      {vouchers.length === 0 ? (
        <div className="text-center py-16 bg-[#101522] border border-[#252C3D] rounded-2xl p-6">
          <Ticket className="mx-auto text-[#727C91] mb-2" size={28} />
          <h3 className="text-sm font-medium text-[#F8FAFC]">No Vouchers Claimed</h3>
          <p className="text-xs text-[#727C91] mt-1 max-w-xs mx-auto">
            Points earned from completed tasks can be redeemed for vouchers in the marketplace.
          </p>
          <Link
            href="/store"
            className="mt-4 inline-block px-4 py-2 bg-[#818CF8] hover:bg-[#6366F1] text-white text-xs font-medium rounded-lg transition"
          >
            Explore Store
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {vouchers.map((v) => (
            <div
              key={v.redemptionId}
              className="p-4 bg-[#101522] border border-[#252C3D] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <span className="text-xs font-semibold text-[#818CF8]">{v.brand}</span>
                <h4 className="text-sm font-medium text-[#F8FAFC]">{v.title}</h4>
                <span className="text-[11px] text-[#727C91] font-mono">ID: {v.redemptionId}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-[#080B14] border border-[#252C3D] px-3 py-1.5 rounded-lg font-mono text-xs text-[#F5B942] font-semibold tracking-wider select-all">
                  {v.voucherCode}
                </div>
                <button
                  onClick={() => handleCopy(v.voucherCode, v.redemptionId)}
                  className="p-2 bg-[#151B2B] hover:bg-[#1C2335] border border-[#252C3D] rounded-lg text-[#A1A8B8] hover:text-white transition"
                  title="Copy code"
                >
                  {copiedId === v.redemptionId ? <Check size={14} className="text-[#34D399]" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
