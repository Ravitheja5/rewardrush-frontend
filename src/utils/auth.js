export const getDeviceId = () => {
  if (typeof window === 'undefined') return '';
  let deviceId = localStorage.getItem('rr_device_id');
  if (!deviceId) {
    deviceId = 'dev_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('rr_device_id', deviceId);
  }
  return deviceId;
};

export const getAllUsers = () => {
  if (typeof window === 'undefined') return {};
  const users = localStorage.getItem('rr_users_db');
  return users ? JSON.parse(users) : {};
};

export const getLoggedInUser = () => {
  if (typeof window === 'undefined') return null;
  const currentPhone = localStorage.getItem('rr_current_session');
  if (!currentPhone) return null;
  const users = getAllUsers();
  return users[currentPhone] || null;
};

export const registerUser = (phone, password) => {
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return { success: false, message: 'Enter a valid 10-digit Indian mobile number.' };
  }
  if (!password || password.length < 4) {
    return { success: false, message: 'Password must be at least 4 characters long.' };
  }

  const deviceId = getDeviceId();
  const users = getAllUsers();

  if (users[phone]) {
    return { success: false, message: 'Account already exists. Please login.' };
  }

  const accountsOnDevice = Object.values(users).filter((u) => u.deviceId === deviceId);
  if (accountsOnDevice.length >= 2) {
    return { success: false, message: 'Device limit reached: Maximum 2 accounts allowed per device.' };
  }

  const newUser = {
    phone,
    password,
    deviceId,
    points: 100,
    createdAt: new Date().toISOString(),
    completedTasks: [],
    lastActiveDate: new Date().toISOString().split('T')[0],
    dailyTaskCount: 0,
    claimedRecharges: []
  };

  users[phone] = newUser;
  localStorage.setItem('rr_users_db', JSON.stringify(users));
  localStorage.setItem('rr_current_session', phone);

  return { success: true, user: newUser };
};

export const loginUser = (phone, password) => {
  const users = getAllUsers();
  const user = users[phone];

  if (!user) {
    return { success: false, message: 'Account not found. Please register first.' };
  }
  if (user.password !== password) {
    return { success: false, message: 'Invalid password. Please try again.' };
  }

  localStorage.setItem('rr_current_session', phone);
  return { success: true, user };
};

export const updateUserWallet = (pointsToAdd, taskId = null) => {
  const phone = localStorage.getItem('rr_current_session');
  if (!phone) return null;

  const users = getAllUsers();
  const user = users[phone];
  if (!user) return null;

  const today = new Date().toISOString().split('T')[0];
  if (user.lastActiveDate !== today) {
    user.lastActiveDate = today;
    user.dailyTaskCount = 0;
  }

  user.points = (user.points || 0) + pointsToAdd;
  user.dailyTaskCount = (user.dailyTaskCount || 0) + 1;

  if (taskId && !user.completedTasks.includes(taskId)) {
    user.completedTasks.push(taskId);
  }

  users[phone] = user;
  localStorage.setItem('rr_users_db', JSON.stringify(users));
  return user;
};

export const logoutUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('rr_current_session');
  }
};
