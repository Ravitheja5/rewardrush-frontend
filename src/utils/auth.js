export const getAuthSession = () => {
  if (typeof window === 'undefined') return null;
  try {
    const session = localStorage.getItem('rr_session');
    return session ? JSON.parse(session) : null;
  } catch (e) {
    return null;
  }
};

export const saveAuthSession = (phone) => {
  if (typeof window === 'undefined') return;
  const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
  localStorage.setItem('rr_session', JSON.stringify({ phone: cleanPhone }));
};

export const fetchLiveUserFromDB = async () => {
  const session = getAuthSession();
  const phone = session?.phone || '6300442917';

  try {
    const res = await fetch(`https://rewards-app-backend-lq2v.onrender.com/api/user/me?phone=${phone}`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        return data.user;
      }
    }
  } catch (err) {
    console.error('Fetch DB Error:', err);
  }
  return null;
};

export const getLoggedInUser = () => {
  const session = getAuthSession();
  return { phone: session?.phone || '6300442917', name: 'User' };
};

export const syncWallet = (userData) => {
  if (userData?.phone) saveAuthSession(userData.phone);
};

export const getAllUsers = () => [];

export const logoutUser = () => {
  if (typeof window === 'undefined') return;
  localStorage.clear();
  window.location.href = '/auth';
};
