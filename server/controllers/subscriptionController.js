// controllers/subscriptionController.js
const db = require('../utils/db');

async function createSubscription(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    try {
      const { plan_type, start_date, end_date } = JSON.parse(body);
      const userId = req.userId;

      // Basic validation
      if (!plan_type || !start_date || !end_date) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
          success: false,
          message: 'plan_type, start_date and end_date are required'
        }));
      }

      // Insert into subscriptions
      await db.query(
        `INSERT INTO subscriptions (user_id, plan_type, start_date, end_date)
         VALUES (?, ?, ?, ?)`,
        [userId, plan_type, start_date, end_date]
      );

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Subscription created successfully'
      }));
    } catch (err) {
      console.error('Create Subscription Error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        message: 'Failed to create subscription'
      }));
    }
  });
}

async function getSubscription(req, res) {
  try {
    const userId = req.userId;
    const [rows] = await db.query(
      `SELECT id, plan_type, start_date, end_date, created_at
       FROM subscriptions
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId]
    );

    if (rows.length === 0) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        success: false,
        message: 'No active subscription found'
      }));
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      data: rows[0]
    }));
  } catch (err) {
    console.error('Get Subscription Error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      message: 'Failed to fetch subscription'
    }));
  }
}
async function cancelSubscription(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const userId = req.userId;
        // get latest subscription
        const [subs] = await db.query(
          `SELECT id, end_date FROM subscriptions 
           WHERE user_id = ? 
           ORDER BY created_at DESC 
           LIMIT 1`,
          [userId]
        );
  
        if (subs.length === 0) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({
            success: false,
            message: 'No active subscription to cancel'
          }));
        }
  
        const subscriptionId = subs[0].id;
  
        // cancel by setting end_date = TODAY
        const [result] = await db.query(
          `UPDATE subscriptions 
           SET end_date = CURRENT_DATE 
           WHERE id = ?`,
          [subscriptionId]
        );
  
        if (result.affectedRows === 0) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({
            success: false,
            message: 'Failed to cancel subscription'
          }));
        }
  
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
          success: true,
          message: 'Subscription cancelled successfully'
        }));
  
      } catch (err) {
        console.error('Cancel Subscription Error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
          success: false,
          message: 'Error in cancelling subscription'
        }));
      }
    });
  }
  
  

module.exports = { createSubscription, getSubscription,cancelSubscription };
