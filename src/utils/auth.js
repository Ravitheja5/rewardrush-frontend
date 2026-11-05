export const getDeviceId = () => {
  if (typeof window === 'undefined') return '';
  let deviceId = localStorage.getItem('rr_device_id');
  if (!deviceId) {
    deviceId = 'dev_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('rr_device_id', deviceId);
  }
  return deviceId;
};

export const getLoggedInUser = () => {
  if (typeof window === 'undefined') return null;
  const session = localStorage.getItem('rr_user_session');
  return session ? JSON.parse(session) : null;
};

export const registerUser = async (phone, password) => {
  const deviceId = getDeviceId();
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password, deviceId })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('rr_user_session', JSON.stringify(data.user));
    }
    return data;
  } catch (err) {
    return { success: false, message: 'Network error. Try again.' };
  }
};

export const loginUser = async (phone, password) => {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('rr_user_session', JSON.stringify(data.user));
    }
    return data;
  } catch (err) {
    return { success: false, message: 'Network error. Try again.' };
  }
};

export const updateUserWallet = (pointsToAdd, taskId = null) => {
  if (typeof window === 'undefined') return null;
  const user = getLoggedInUser();
  if (!user) return null;

  user.points = (user.points || 0) + pointsToAdd;
  user.dailyTaskCount = (user.dailyTaskCount || 0) + 1;
  if (taskId && !user.completedTasks.includes(taskId)) {
    user.completedTasks.push(taskId);
  }

  localStorage.setItem('rr_user_session', JSON.stringify(user));
  return user;
};

export const logoutUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('rr_user_session');
  }
};
