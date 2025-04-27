// controllers/statsController.js
const db = require('../utils/db');

async function getStats(req, res) {
  try {
    // 1) Order counts by status
    const [[orderStats]] = await db.query(`
      SELECT
        COUNT(*) AS totalOrders,
        SUM(status = 'pending') AS pendingOrders,
        SUM(status = 'out_for_delivery') AS inTransitOrders,
        SUM(status = 'delivered') AS deliveredOrders,
        SUM(status = 'cancelled') AS cancelledOrders
      FROM orders
    `);

    // 2) User count
    const [[userStats]] = await db.query(`
      SELECT COUNT(*) AS totalUsers FROM users
    `);

    // 3) Active subscriptions
    const today = new Date().toISOString().slice(0,10);
    const [[subStats]] = await db.query(`
      SELECT
        COUNT(*) AS totalSubscriptions,
        SUM(end_date >= ?) AS activeSubscriptions
      FROM subscriptions
    `, [today]);

    // 4) Average feedback rating
    const [[feedbackStats]] = await db.query(`
      SELECT
        COUNT(*) AS totalFeedback,
        ROUND(AVG(rating),2) AS avgRating
      FROM feedback
    `);

    const data = {
      orders: orderStats,
      users: userStats.totalUsers,
      subscriptions: subStats,
      feedback: feedbackStats
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: true, data }));
  } catch (err) {
    console.error('Get Stats Error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: false, message: 'Failed to fetch analytics' }));
  }
}

module.exports = { getStats };
