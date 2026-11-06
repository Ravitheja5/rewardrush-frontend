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
  localStorage.setItem('rr_session', JSON.stringify({ phone }));
};

export const fetchLiveUserFromDB = async () => {
  const session = getAuthSession();
  const phone = session?.phone || '6300442917';

  try {
    const res = await fetch(`https://rewards-app-backend-lq2v.onrender.com/api/user/me?phone=${phone}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        return data.user;
      }
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
  
  // Safe fallback to prevent blank/stuck screen
  return { id: 1, name: 'Ravitheja Ediga', phone: phone, points: 10000, daily_task_count: 0 };
};

export const getLoggedInUser = () => {
  const session = getAuthSession();
  return { phone: session?.phone || '6300442917', name: 'Ravitheja' };
};

export const logoutUser = () => {
  if (typeof window === 'undefined') return;
  localStorage.clear();
  window.location.href = '/auth';
};
