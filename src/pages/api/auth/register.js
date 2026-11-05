import bcrypt from 'bcryptjs';

// In-memory or centralized backend store placeholder (connect with your DB)
// Production lo mee Firebase / MongoDB collection tho replace avthundhi
let usersDb = global.usersDb || {};
global.usersDb = usersDb;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { phone, password, deviceId } = req.body;

  if (!/^[6-9]\d{9}$/.test(phone)) {
    return res.status(400).json({ success: false, message: 'Invalid 10-digit mobile number' });
  }
  if (!password || password.length < 4) {
    return res.status(400).json({ success: false, message: 'Password must be at least 4 characters' });
  }

  if (usersDb[phone]) {
    return res.status(400).json({ success: false, message: 'Account already exists. Please login.' });
  }

  // Device check: Max 2 numbers per device on backend
  const deviceAccounts = Object.values(usersDb).filter((u) => u.deviceId === deviceId);
  if (deviceAccounts.length >= 2) {
    return res.status(403).json({
      success: false,
      message: 'Device Limit Exceeded: Maximum 2 accounts allowed per device.'
    });
  }

  // Hash password before saving (Never store plain text passwords)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = {
    phone,
    password: hashedPassword, // SECURE HASH STORED ON BACKEND
    deviceId,
    points: 100, // 100 pts welcome bonus
    createdAt: new Date().toISOString(),
    completedTasks: [],
    lastActiveDate: new Date().toISOString().split('T')[0],
    dailyTaskCount: 0
  };

  usersDb[phone] = newUser;

  // Client ki hashed password return cheyyamu (Safe response)
  const { password: _, ...userSafe } = newUser;
  return res.status(201).json({ success: true, user: userSafe });
}
