const db = require('../utils/db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
require('dotenv').config();
const { emitOrderStatus } = require('../socket/socket');

async function registerAdmin() {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL;
  const plainPassword = process.env.ADMIN_PASSWORD;

  if (!name || !email || !plainPassword) {
    console.error('Missing ADMIN credentials in .env file.');
    return;
  }

  try {
    // Check if admin already exists
    const [rows] = await db.query('SELECT id FROM admins WHERE email = ?', [email]);
    if (rows.length > 0) {
      console.log('Admin already exists.');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Insert admin
    await db.query(
      'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    console.log('Admin registered successfully.');
  } catch (err) {
    console.error('Error registering admin:', err);
  }
}

async function loginAdmin(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    try {
      const { email, password } = JSON.parse(body);
      if (!email || !password) {
        res.writeHead(400, {'Content-Type':'application/json'});
        return res.end(JSON.stringify({ success: false, message: 'Email & Password required' }));
      }

      // Fetch admin
      const [rows] = await db.query(
        'SELECT id, password FROM admins WHERE email = ?',
        [email]
      );

      if (rows.length === 0) {
        res.writeHead(401, {'Content-Type':'application/json'});
        return res.end(JSON.stringify({ success: false, message: 'Invalid credentials' }));
      }

      const admin = rows[0];

      // Compare password
      const ok = await bcrypt.compare(password, admin.password);
      if (!ok) {
        res.writeHead(401, {'Content-Type':'application/json'});
        return res.end(JSON.stringify({ success: false, message: 'Invalid credentials' }));
      }

      // Generate token
      const token = crypto.randomBytes(16).toString('hex');
      await db.query('UPDATE admins SET token = ? WHERE id = ?', [token, admin.id]);

      // Respond
      res.writeHead(200, {'Content-Type':'application/json'});
      res.end(JSON.stringify({ success: true, message: 'Admin login successful', token }));

    } catch (err) {
      console.error(err);
      res.writeHead(500, {'Content-Type':'application/json'});
      res.end(JSON.stringify({ success: false, message: 'Server error' }));
    }
  });
}


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
  
  
  module.exports = {loginAdmin, getAllOrders, getAllFeedback ,updateOrderStatus,registerAdmin};
  

