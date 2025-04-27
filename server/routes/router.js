// routes/router.js
const { registerUser, loginUser } = require('../controllers/userController');
const { handleOrderRoutes,getMyOrders,placeOrder,cancelOrder     } = require('../controllers/orderController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { createMenu, getMenu } = require('../controllers/menuController');
const { giveFeedback } = require('../controllers/feedbackController');


function router(req, res) {
  const { url, method } = req;
    console.log(`Request URL: ${url}, Method: ${method}`);

  if (url === '/api/users/register' && method === 'POST') {
    return registerUser(req, res);
  }
  if (url === '/api/users/login' && method === 'POST') {
    return loginUser(req, res);
  }

  // Get Today's Menu
  if (url === '/api/menu' && method === 'GET') {
    return getMenu(req, res);
  }

  if (url === '/api/menu' && method === 'POST') {
    return authMiddleware(req, res, createMenu); // Later add admin check
  }
  
  if (req.method === 'POST' && req.url === '/api/order') {
    return authMiddleware(req, res, placeOrder);
  }
  

  if (url === '/api/orders' && method === 'GET') {
    return authMiddleware(req, res, getMyOrders);
  }

  // Protected: Create Order
  if (url === '/api/orders' && method === 'POST') {
    // First check token, then proceed to controller
    return authMiddleware(req, res, handleOrderRoutes);
  }

  //for cancel order
  // This function is called when the user wants to cancel their order
  if (req.method === 'PATCH' && req.url === '/api/order/cancel') {
    return authMiddleware(req, res, cancelOrder);
  }


  //for feedback
  // This function is called when the user wants to give feedback
  if (req.method === 'POST' && req.url === '/api/feedback') {
    return authMiddleware(req, res, giveFeedback);
  }
  
  

  // ... other routes ...

  // 404 fallback
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: false, message: 'Route Not Found' }));
}

module.exports = { router };
