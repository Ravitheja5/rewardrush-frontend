import bcrypt from 'bcryptjs';

let usersDb = global.usersDb || {};
global.usersDb = usersDb;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { phone, password } = req.body;

  const user = usersDb[phone];
  if (!user) {
    return res.status(404).json({ success: false, message: 'Account not found. Please register.' });
  }

  // Verify password hash
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
  }

  const { password: _, ...userSafe } = user;
  return res.status(200).json({ success: true, user: userSafe });
}
