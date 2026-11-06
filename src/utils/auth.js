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

// లైవ్ డేటాబేస్ నుండి ప్రతిసారీ ఫ్రెష్ పాయింట్లను లాగే ఫంక్షన్
export const fetchFreshUserData = async () => {
  if (typeof window === 'undefined') return null;
  const local = getLoggedInUser();
  if (!local || !local.phone) return null;

  try {
    const backendUrl = 'https://rewards-app-backend-lq2v.onrender.com';
    const res = await fetch(`${backendUrl}/api/user/me?phone=${local.phone}`, {
      headers: { 'Cache-Control': 'no-cache' }
    });
    const data = await res.json();
    if (data.success && data.user) {
      localStorage.setItem('rr_user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('walletUpdated'));
      return data.user;
    }
  } catch (err) {
    console.error('Live sync error:', err);
  }
  return local;
};

export const logoutUser = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('rr_user');
  window.location.href = '/auth';
};
