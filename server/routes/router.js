// routes/router.js
const { URL } = require('url');
const { registerUser, loginUser } = require('../controllers/userController');
const { handleOrderRoutes,getMyOrders,placeOrder,cancelOrder,trackOrder     } = require('../controllers/orderController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { createMenu, getMenu } = require('../controllers/menuController');
const { giveFeedback } = require('../controllers/feedbackController');
const { getAllOrders,getAllFeedback,updateOrderStatus } = require('../controllers/adminController');
const { createSubscription, getSubscription,cancelSubscription } = require('../controllers/subscriptionController');
const { getStats } = require('../controllers/statsController');

function router(req, res) {
  const { url, method } = req;
    console.log(`Request URL: ${url}, Method: ${method}`);
    const fullUrl = `http://${req.headers.host}${req.url}`;
    const parsed = new URL(fullUrl);
    const pathname = parsed.pathname;

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

  if (req.method === 'GET' && req.url === '/api/admin/orders') {
    return authMiddleware(req, res, getAllOrders);
  }

  if (req.method === 'GET' && req.url === '/api/admin/feedback') {
    return authMiddleware(req, res, getAllFeedback);
  }
  
   // Create a subscription
   if (url === '/api/subscription' && method === 'POST') {
    return authMiddleware(req, res, createSubscription);
  }

  // Get current user's latest subscription
  if (url === '/api/subscription' && method === 'GET') {
    return authMiddleware(req, res, getSubscription);
  }
  
  // Cancel Subscription
if (url === '/api/subscription/cancel' && method === 'POST') {
    return authMiddleware(req, res, cancelSubscription);
  }
  
  if (pathname === '/api/order/status' && method === 'GET') {
    req.orderId = parsed.searchParams.get('order_id');
    return authMiddleware(req, res, trackOrder);
  }

  if (pathname === '/api/admin/order/status' && method === 'PATCH') {
    return authMiddleware(req, res, updateOrderStatus);
  }
  
    // Admin Analytics
    if (pathname === '/api/admin/stats' && method === 'GET') {
        return authMiddleware(req, res, getStats);
      }
  // ... other routes ...

  // 404 fallback
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: false, message: 'Route Not Found' }));
}

module.exports = { router };
