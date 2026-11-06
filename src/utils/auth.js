// SESSION MANAGEMENT (Database is source-of-truth)
export const getAuthSession = () => {
  if (typeof window === 'undefined') return null;
  const session = localStorage.getItem('rr_session');
  return session ? JSON.parse(session) : null;
};

export const saveAuthSession = (phone) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('rr_session', JSON.stringify({ phone }));
};

// DIRECT DATABASE FETCH
export const fetchLiveUserFromDB = async () => {
  const session = getAuthSession();
  const phone = session?.phone || (typeof window !== 'undefined' ? localStorage.getItem('rr_phone') : null);
  if (!phone) return null;

  try {
    const backendUrl = 'https://rewards-app-backend-lq2v.onrender.com';
    const res = await fetch(`${backendUrl}/api/user/me?phone=${phone}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
    });
    const data = await res.json();
    if (data.success && data.user) {
      return data.user;
    }
  } catch (err) {
    console.error('DB fetch error:', err);
  }
  return null;
};

// COMPATIBILITY HELPERS FOR OLD PAGES (profile, rewards, store, wallet)
export const getLoggedInUser = () => {
  if (typeof window === 'undefined') return null;
  const session = getAuthSession();
  if (!session || !session.phone) return null;
  return { phone: session.phone, name: 'User' };
};

export const syncWallet = (userData) => {
  // Pure DB sync: Keep session reference alive
  if (userData && userData.phone) {
    saveAuthSession(userData.phone);
  }
};

export const getAllUsers = () => {
  return [];
};

export const logoutUser = () => {
  if (typeof window === 'undefined') return;
  localStorage.clear();
  window.location.href = '/auth';
};
