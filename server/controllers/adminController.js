const db = require('../utils/db');

async function getAllOrders(req, res) {
  try {
    const [orders] = await db.query(`
      SELECT orders.*, users.name AS user_name, users.phone AS user_phone 
      FROM orders 
      JOIN users ON orders.user_id = users.id
      ORDER BY orders.created_at DESC
    `);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, data: orders }));

  } catch (err) {
    console.error('Get All Orders Error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Failed to fetch orders' }));
  }
}

async function getAllFeedback(req, res) {
    try {
      const [feedbacks] = await db.query(`
        SELECT feedback.*, users.name AS user_name 
        FROM feedback 
        JOIN users ON feedback.user_id = users.id
        ORDER BY feedback.created_at DESC
      `);
  
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: feedbacks }));
  
    } catch (err) {
      console.error('Get All Feedback Error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to fetch feedback' }));
    }
  }
  
  module.exports = { getAllOrders, getAllFeedback };
  

