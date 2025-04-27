// routes/router.js
const { registerUser, loginUser } = require('../controllers/userController');
const { handleOrderRoutes,getMyOrders } = require('../controllers/orderController');
const { authMiddleware } = require('../middlewares/authMiddleware');

function router(req, res) {
  const { url, method } = req;

  if (url === '/api/users/register' && method === 'POST') {
    return registerUser(req, res);
  }
  if (url === '/api/users/login' && method === 'POST') {
    return loginUser(req, res);
  }
  if (url === '/api/orders' && method === 'GET') {
    return authMiddleware(req, res, getMyOrders);
  }

  // Protected: Create Order
  if (url === '/api/orders' && method === 'POST') {
    // First check token, then proceed to controller
    return authMiddleware(req, res, handleOrderRoutes);
  }

  // ... other routes ...

  // 404 fallback
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: false, message: 'Route Not Found' }));
}

module.exports = { router };
