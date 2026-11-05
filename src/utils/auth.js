import { apiRequest } from './api';

export const getDeviceId = () => {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('rr_device_id');
  if (!id) {
    id = 'dev_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    localStorage.setItem('rr_device_id', id);
  }
  return id;
};

export const getLoggedInUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('rr_user_session');
  return user ? JSON.parse(user) : null;
};

export const registerUser = async (phone, password) => {
  const deviceId = getDeviceId();
  try {
    const res = await apiRequest('/api/auth/register', 'POST', { phone, password, deviceId });
    if (res.success) {
      localStorage.setItem('rr_user_session', JSON.stringify(res.user));
    }
    return res;
  } catch (err) {
    return { success: false, message: 'Server connection error' };
  }
};

export const loginUser = async (phone, password) => {
  try {
    const res = await apiRequest('/api/auth/login', 'POST', { phone, password });
    if (res.success) {
      localStorage.setItem('rr_user_session', JSON.stringify(res.user));
    }
    return res;
  } catch (err) {
    return { success: false, message: 'Server connection error' };
  }
};

export const syncWallet = (updatedUser) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('rr_user_session', JSON.stringify(updatedUser));
  }
};

export const logoutUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('rr_user_session');
  }
};
