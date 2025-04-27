const db = require('../utils/db');

// Create Today's Menu
async function createMenu(req, res) {
  try {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      const { meal_type, items, date } = JSON.parse(body);

      const [result] = await db.query(
        'INSERT INTO menus (meal_type, items, date) VALUES (?, ?, ?)',
        [meal_type, JSON.stringify(items), date]
      );

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          success: true,
          message: 'Menu created successfully',
          data: { id: result.insertId }
        })
      );
    });
  } catch (err) {
    console.error('Create Menu Error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({ success: false, message: 'Failed to create menu' })
    );
  }
}

// Get Today's Menu
async function getMenu(req, res) {
  try {
    const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
    const [menus] = await db.query(
      'SELECT id, meal_type, items, date FROM menus WHERE date = ?',
      [today]
    );

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        success: true,
        message: 'Menu fetched successfully',
        data: menus,
      })
    );
  } catch (err) {
    console.error('Get Menu Error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({ success: false, message: 'Failed to fetch menu' })
    );
  }
}

module.exports = {
  createMenu,
  getMenu,
};
