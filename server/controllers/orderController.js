// controllers/orderController.js
const db = require('../utils/db');

async function handleOrderRoutes(req, res) {
  let body = '';
  req.on('data', chunk => (body += chunk));
  req.on('end', async () => {
    const { meal_type, quantity, delivery_time } = JSON.parse(body);

    // Use the authenticated userId
    const user_id = req.userId;

    if (!meal_type || !quantity || !delivery_time) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(
        JSON.stringify({
          success: false,
          message: 'Meal Type, Quantity, and Delivery Time are required!',
        })
      );
    }

    try {
      const [result] = await db.query(
        'INSERT INTO orders (user_id, meal_type, quantity, delivery_time) VALUES (?, ?, ?, ?)',
        [user_id, meal_type, quantity, delivery_time]
      );
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          success: true,
          message: 'Order created successfully!',
          orderId: result.insertId,
        })
      );
    } catch (err) {
      console.error(err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ success: false, message: 'Server Error!' })
      );
    }
  });
}


// Existing POST /api/orders stays same 
//get order of the logged in user
// This function is called when the user wants to fetch their orders

async function getMyOrders(req, res) {
    try {
      const [orders] = await db.query(
        'SELECT id, meal_type, quantity, delivery_time, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC',
        [req.userId]
      );
  
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          success: true,
          message: 'Orders fetched successfully!',
          data: orders,
        })
      );
    } catch (err) {
      console.error('Get Orders Error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ success: false, message: 'Failed to fetch orders' })
      );
    }
  }
module.exports = { handleOrderRoutes,getMyOrders };
