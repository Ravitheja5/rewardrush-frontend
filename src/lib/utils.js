export function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function detectIndianOperator(number) {
  const clean = (number || '').replace(/\D/g, '');
  if (clean.length < 2) return null;
  const prefix = parseInt(clean.substring(0, 2), 10);
  if ([63, 70, 79, 92, 93, 98].includes(prefix)) return 'Airtel';
  if ([62, 74, 75, 76, 77, 88].includes(prefix)) return 'Jio';
  if ([90, 91, 97, 86].includes(prefix)) return 'Vi';
  return 'Jio';
}
