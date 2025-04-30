// middlewares/authAdminMiddleware.js
const db = require('../utils/db');

async function authAdminMiddleware(req, res, next) {
  // 1. Read the Authorization header
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: false, message: 'No authorization token provided' }));
  }

  // 2. Extract the token (support "Bearer <token>" or raw token)
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  try {
    // 3. Validate token against the database
    const [rows] = await db.query(
      'SELECT id FROM admins WHERE token = ?',
      [token]
    );

    if (rows.length === 0) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: false, message: 'Invalid or expired token' }));
    }

    // 4. Attach user ID to request for downstream handlers
    req.userId = rows[0].id;

    // 5. Call the next handler
    return next(req, res);
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: false, message: 'Server error in auth' }));
  }
}

module.exports = { authAdminMiddleware };
