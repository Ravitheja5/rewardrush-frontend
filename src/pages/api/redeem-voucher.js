export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, productId, brand, cost, title } = req.body;

  if (!userId || !productId || !cost) {
    return res.status(400).json({ error: 'Missing required redemption parameters.' });
  }

  try {
    const redemptionId = `RDM_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Dummy voucher generation for client demonstration
    const voucherCode = `${brand.toUpperCase().slice(0, 3)}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    return res.status(200).json({
      success: true,
      redemptionId,
      voucherCode,
      brand,
      title,
      cost,
      status: 'FULFILLED',
      message: `${title} successfully redeemed!`
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Redemption failed' });
  }
}
