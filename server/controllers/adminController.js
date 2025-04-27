const db = require('../utils/db');
const { emitOrderStatus } = require('../socket/socket');

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

  async function updateOrderStatus(req, res) {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', async () => {
      try {
        const { order_id, status } = JSON.parse(body);
  
        // Validate input
        const validStatuses = ['pending','cancelled','out_for_delivery','delivered'];
        if (!order_id || !status || !validStatuses.includes(status)) {
          res.writeHead(400, {'Content-Type':'application/json'});
          return res.end(JSON.stringify({
            success: false,
            message: 'Invalid order_id or status'
          }));
        }
  
        // Update in DB
        const [result] = await db.query(
          'UPDATE orders SET status = ? WHERE id = ?',
          [status, order_id]
        );
        emitOrderStatus(order_id, status);

        const [[user]] = await db.query(
            'SELECT email, name FROM users WHERE id = (SELECT user_id FROM orders WHERE id = ?)',
            [order_id]
          );
        
          if (user && user.email) {
            const html = `
              <p>Hi ${user.name},</p>
              <p>Your order <strong>#${order_id}</strong> status has been updated to: <strong>${status}</strong>.</p>
              <p>Thank you for choosing our service!</p>
            `;
            sendEmail({ to: user.email, subject: 'Your Order Status Updated', html });
          }
  
        if (result.affectedRows === 0) {
          res.writeHead(404, {'Content-Type':'application/json'});
          return res.end(JSON.stringify({
            success: false,
            message: 'Order not found'
          }));
        }
  
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify({
          success: true,
          message: 'Order status updated successfully'
        }));
      } catch (err) {
        console.error('Update Order Status Error:', err);
        res.writeHead(500, {'Content-Type':'application/json'});
        res.end(JSON.stringify({
          success: false,
          message: 'Failed to update order status'
        }));
      }
    });
  }
  
  
  module.exports = { getAllOrders, getAllFeedback ,updateOrderStatus};
  

