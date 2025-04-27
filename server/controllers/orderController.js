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

  async function placeOrder(req, res) {
    try {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
  
      req.on('end', async () => {
        const { meal_type, quantity, delivery_time } = JSON.parse(body);
  
        if (!meal_type || !quantity || !delivery_time) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({ success: false, message: 'All fields are required' })
          );
          return;
        }
  
        // Assuming you have userId from auth middleware
        const userId = req.userId; 
  
        const [result] = await db.query(
          'INSERT INTO orders (user_id, meal_type, quantity, delivery_time, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
          [userId, meal_type, quantity, delivery_time, 'pending']
        );
  
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ success: true, message: 'Order placed successfully' })
        );
      });
    } catch (err) {
      console.error('Order Error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ success: false, message: 'Failed to place order' })
      );
    }
  }

  async function cancelOrder(req, res) {
    try {
      let body = '';
  
      req.on('data', (chunk) => {
        body += chunk;
      });
  
      req.on('end', async () => {
        const { order_id } = JSON.parse(body);
        const userId = req.userId;
  
        if (!order_id) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, message: 'Order ID is required' }));
        }
  
        const [orderCheck] = await db.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [order_id, userId]);
  
        if (orderCheck.length === 0) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, message: 'Order not found or not yours' }));
        }
  
        if (orderCheck[0].status !== 'pending') {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, message: 'Only pending orders can be cancelled' }));
        }
  
        await db.query('UPDATE orders SET status = ? WHERE id = ?', ['cancelled', order_id]);
  
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Order cancelled successfully' }));
      });
  
    } catch (err) {
      console.error('Cancel Order Error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to cancel order' }));
    }
  }
  
  async function trackOrder(req, res) {
    try {
      // req.orderId will be set by the router
      const orderId = req.orderId;
      const userId  = req.userId;
  
      if (!orderId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
          success: false,
          message: 'order_id query parameter is required'
        }));
      }
  
      // Fetch the order, ensure it belongs to this user
      const [rows] = await db.query(
        `SELECT id, meal_type, quantity, delivery_time, status, created_at
           FROM orders
          WHERE id = ? AND user_id = ?`,
        [orderId, userId]
      );
  
      if (rows.length === 0) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
          success: false,
          message: 'Order not found'
        }));
      }
  
      // Return the order’s status and metadata
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        data: rows[0]
      }));
    } catch (err) {
      console.error('Track Order Error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        message: 'Failed to track order'
      }));
    }
  }
  
  
module.exports = { handleOrderRoutes,getMyOrders,placeOrder,cancelOrder,trackOrder };
