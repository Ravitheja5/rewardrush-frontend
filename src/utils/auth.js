export const getLoggedInUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('rr_user');
  return user ? JSON.parse(user) : null;
};

export const syncWallet = (updatedUser) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('rr_user', JSON.stringify(updatedUser));
  window.dispatchEvent(new Event('walletUpdated'));
};

export const fetchLiveUser = async () => {
  if (typeof window === 'undefined') return null;
  const cached = getLoggedInUser();
  if (!cached || !cached.phone) return null;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://rewards-app-backend-lq2v.onrender.com';
    const res = await fetch(`${apiUrl}/api/user/me?phone=${cached.phone}`);
    const data = await res.json();
    if (data.success && data.user) {
      localStorage.setItem('rr_user', JSON.stringify(data.user));
      return data.user;
    }
  } catch (err) {
    console.error('Failed to fetch live balance:', err);
  }
  return cached;
};

export const logoutUser = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('rr_user');
  window.location.href = '/auth';
};
