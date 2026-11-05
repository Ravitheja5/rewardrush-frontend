// Universal S2S Postback Webhook
app.get('/api/postback/webhook', async (req, res) => {
  const { subid, txid, points, payout, token, network = 'affiliate' } = req.query;

  const WEBHOOK_SECRET = process.env.POSTBACK_SECRET || 'rewardrush_secure_postback_2026';
  if (token !== WEBHOOK_SECRET) {
    return res.status(403).send('UNAUTHORIZED_TOKEN');
  }

  if (!subid || !txid) {
    return res.status(400).send('MISSING_SUBID_OR_TXID');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Duplicate check
    const existingTx = await client.query(
      'SELECT id FROM postback_logs WHERE network_txid = $1',
      [txid]
    );

    if (existingTx.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(200).send('ALREADY_PROCESSED');
    }

    const pointsToCredit = points ? parseInt(points, 10) : Math.round(parseFloat(payout || 0) * 4);

    const userUpdate = await client.query(
      'UPDATE users SET points = points + $1 WHERE id = $2 RETURNING points',
      [pointsToCredit, parseInt(subid, 10)]
    );

    if (userUpdate.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).send('USER_NOT_FOUND');
    }

    await client.query(
      'INSERT INTO points_ledger (user_id, points, type, description) VALUES ($1, $2, $3, $4)',
      [parseInt(subid, 10), pointsToCredit, 'TASK_COMPLETION', `Completed ${network.toUpperCase()} task`]
    );

    await client.query(
      'INSERT INTO postback_logs (network_name, subid, network_txid, payout_usd_inr, points_credited, payload) VALUES ($1, $2, $3, $4, $5, $6)',
      [network, parseInt(subid, 10), txid, parseFloat(payout || 0), pointsToCredit, JSON.stringify(req.query)]
    );

    await client.query('COMMIT');
    res.status(200).send('1');
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).send('INTERNAL_SERVER_ERROR');
  } finally {
    client.release();
  }
});
