import { MOCK_TASKS, MOCK_REWARDS, MOCK_TICKER, MOCK_LEDGER } from './mock';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://rewards-app-backend-1q2v.onrender.com';

export const api = {
  // PostgreSQL లైవ్ యూజర్ ప్రొఫైల్ (ఫోన్ నంబర్ ద్వారా)
  async getUser(phone = '9876543210') {
    try {
      const res = await fetch(`${API_BASE}/api/user/${phone}`);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      return {
        uid: data.id,
        phone: data.phone,
        maskedPhone: '+91 ••••• ' + data.phone.slice(-4),
        name: 'Ravitheja K.',
        memberSince: 'Nov 2026',
        points: data.points || 0,
        pendingPoints: 80,
        lifetimeEarned: data.points + 200,
        lifetimeRedeemed: 200,
        longestStreak: 5,
        streakDays: 4,
        streakClaimedToday: false,
        mysteryScratchedToday: false,
        referralCode: data.referral_code,
      };
    } catch (e) {
      console.warn("Using fallback profile:", e.message);
      return {
        uid: 'usr_local',
        phone: '9876543210',
        maskedPhone: '+91 ••••• 43210',
        name: 'Ravitheja K.',
        points: 250,
        pendingPoints: 80,
        lifetimeEarned: 450,
        streakDays: 4,
        referralCode: 'RR500',
      };
    }
  },

  async getTicker() {
    return [...MOCK_TICKER];
  },

  async claimStreak() {
    return { success: true, pointsAwarded: 15, nextStreakDay: 5 };
  },

  async scratchCard() {
    return { success: true, pointsAwarded: 25 };
  },

  async getTasks() {
    return [...MOCK_TASKS];
  },

  async watchVideoAd() {
    return { success: true, pointsAwarded: 15, currentCount: 4, dailyCap: 10 };
  },

  async getRewards() {
    return [...MOCK_REWARDS];
  },

  // PostgreSQL Atomic Voucher Redemption
  async redeemReward(payload) {
    const res = await fetch(`${API_BASE}/api/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: payload.userId || 'usr_local',
        brand: payload.brand || 'Swiggy',
        costPoints: payload.costPoints || 200,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Redemption failed');

    return {
      success: true,
      voucher: data.voucher,
    };
  },

  // PostgreSQL లైవ్ యూజర్ Vault రికార్డులు
  async getVault(userId) {
    try {
      const res = await fetch(`${API_BASE}/api/vault/${userId}`);
      if (!res.ok) throw new Error('Vault fetch failed');
      const items = await res.json();
      return items.map((item, idx) => ({
        id: `vlt_${idx}`,
        brand: item.brand,
        title: `₹${item.amount} ${item.brand} Voucher`,
        type: 'voucher',
        cardNumber: item.card_number,
        pin: item.pin,
        claimedAt: new Date(item.redeemed_at).toLocaleString(),
        expiresAt: '31 Dec 2027',
        status: 'delivered',
        amount: `₹${item.amount}`,
      }));
    } catch (e) {
      return [];
    }
  },

  async getLedger() {
    return [...MOCK_LEDGER];
  },
};
