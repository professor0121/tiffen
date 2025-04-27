const db = require('../utils/db');

async function giveFeedback(req, res) {
  try {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      const { rating, comments } = JSON.parse(body);
      const userId = req.userId;

      if (!rating || rating < 1 || rating > 5) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, message: 'Rating must be between 1 and 5' }));
      }

      await db.query('INSERT INTO feedback (user_id, rating, comments, created_at) VALUES (?, ?, ?, NOW())', [userId, rating, comments || '']);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Feedback submitted successfully' }));
    });

  } catch (err) {
    console.error('Feedback Error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Failed to submit feedback' }));
  }
}

module.exports = { giveFeedback };
