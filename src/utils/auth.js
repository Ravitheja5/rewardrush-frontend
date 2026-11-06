export const getAuthSession = () => {
  if (typeof window === 'undefined') return null;
  const session = localStorage.getItem('rr_session');
  return session ? JSON.parse(session) : null;
};

export const saveAuthSession = (phone) => {
  if (typeof window === 'undefined') return;
  // Kevalam phone number matrame browser lo untundhi, points DB lone untayi
  localStorage.setItem('rr_session', JSON.stringify({ phone }));
};

export const fetchLiveUserFromDB = async () => {
  const session = getAuthSession();
  if (!session || !session.phone) return null;

  try {
    const backendUrl = 'https://rewards-app-backend-lq2v.onrender.com';
    const res = await fetch(`${backendUrl}/api/user/me?phone=${session.phone}`, {
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

export const logoutUser = () => {
  if (typeof window === 'undefined') return;
  localStorage.clear();
  window.location.href = '/auth';
};
