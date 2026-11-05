import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { rewardsCatalog } from '../data/rewardsCatalog';

export default function StorePage() {
  const [filter, setFilter] = useState('ALL');
  const [balance, setBalance] = useState(2450);
  const [confirmItem, setConfirmItem] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');

  const filteredItems = filter === 'ALL'
    ? rewardsCatalog
    : rewardsCatalog.filter(i => i.type === filter);

  const handleRedeem = (item) => {
    if (balance < item.cost) {
      setStatusMsg(`Insufficient points. You need ${item.cost - balance} more points.`);
      return;
    }
    setConfirmItem(item);
  };

  const processOrder = async () => {
    const item = confirmItem;
    try {
      const res = await fetch('/api/redeem-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'usr_verified_client',
          productId: item.id,
          brand: item.brand,
          cost: item.cost,
          title: item.title,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBalance(prev => prev - item.cost);
        const existing = JSON.parse(localStorage.getItem('user_vouchers') || '[]');
        localStorage.setItem('user_vouchers', JSON.stringify([data, ...existing]));
        setStatusMsg(`Order confirmed! View your code in the Rewards Vault.`);
      }
    } catch {
      setStatusMsg('Redemption processing error.');
    } finally {
      setConfirmItem(null);
    }
  };

  return (
    <div className="space-y-6">
      <Head>
        <title>Rewards Store | RewardRush</title>
      </Head>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1C2231] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#F8FAFC]">Rewards Marketplace</h1>
          <p className="text-xs text-[#A1A8B8] mt-0.5">Food delivery vouchers and high-speed data booster packs</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#727C91]">Balance:</span>
          <span className="text-xs font-semibold text-[#F5B942] bg-[#101522] border border-[#252C3D] px-2.5 py-1 rounded-lg">
            {balance} pts
          </span>
          <Link href="/vault" className="text-xs text-[#818CF8] hover:underline ml-2">
            My Vault →
          </Link>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3 bg-[#101522] border border-[#252C3D] text-xs text-center rounded-xl text-[#A1A8B8]">
          {statusMsg}
        </div>
      )}

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['ALL', 'swiggy', 'zomato', 'jio', 'airtel'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${
              filter === tab
                ? 'bg-[#818CF8] text-white'
                : 'bg-[#101522] text-[#A1A8B8] border border-[#252C3D] hover:bg-[#151B2B]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-[#101522] border border-[#252C3D] rounded-xl flex flex-col justify-between space-y-4 hover:border-[#1C2335] transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-[#A1A8B8]">{item.brand}</span>
                <h3 className="text-sm font-medium text-[#F8FAFC] mt-0.5">{item.title}</h3>
              </div>
              <span className="text-xl">{item.image}</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#1C2231]">
              <span className="text-xs font-semibold text-[#F5B942] tabular-nums">
                {item.cost} pts
              </span>
              <button
                onClick={() => handleRedeem(item)}
                className="px-3 py-1.5 bg-[#151B2B] hover:bg-[#1C2335] border border-[#252C3D] text-[#F8FAFC] text-xs font-medium rounded-lg transition"
              >
                Claim
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Clean Confirmation Modal */}
      {confirmItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#101522] border border-[#252C3D] rounded-2xl max-w-sm w-full p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#F8FAFC]">Confirm Redemption</h3>
            <p className="text-xs text-[#A1A8B8]">
              Are you sure you want to redeem <strong>{confirmItem.title}</strong> for{' '}
              <span className="text-[#F5B942] font-semibold">{confirmItem.cost} points</span>?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmItem(null)}
                className="px-3 py-1.5 text-xs text-[#A1A8B8] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={processOrder}
                className="px-4 py-1.5 bg-[#818CF8] hover:bg-[#6366F1] text-white text-xs font-medium rounded-lg transition"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
