// controllers/userController.js
const db = require('../utils/db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

async function  registerUser(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk);
  console.log("this is body sended by client",body)
  req.on('end', async () => {
    try {
      const { name, email, phone, password, address } = JSON.parse(body);
      console.log(name, email,phone,password,address)
      if (!name || !email || !password) {
        res.writeHead(400, {'Content-Type':'application/json'});
        return res.end(JSON.stringify({ success:false, message:'Name, Email & Password required' }));
      }
      // hash password
      const hashed = await bcrypt.hash(password, 10);
      const [result] = await db.query(
        'INSERT INTO users (name,email,phone,password,address) VALUES (?,?,?,?,?)',
        [name,email,phone,hashed,address]
      );
      res.writeHead(201, {'Content-Type':'application/json'});
      res.end(JSON.stringify({ success:true, message:'User registered', userId: result.insertId }));
    } catch (err) {
      console.error(err);
      res.writeHead(500, {'Content-Type':'application/json'});
      res.end(JSON.stringify({ success:false, message:'Server error' }));
    }
  });
}

async function loginUser(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    try {
      const { email, password } = JSON.parse(body);
      if (!email || !password) {
        res.writeHead(400, {'Content-Type':'application/json'});
        return res.end(JSON.stringify({ success:false, message:'Email & Password required' }));
      }
      // fetch user
      const [rows] = await db.query(
        'SELECT id, password FROM users WHERE email = ?',
        [email]
      );
      if (rows.length === 0) {
        res.writeHead(401, {'Content-Type':'application/json'});
        return res.end(JSON.stringify({ success:false, message:'Invalid credentials' }));
      }
      const user = rows[0];
      // compare password
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) {
        res.writeHead(401, {'Content-Type':'application/json'});
        return res.end(JSON.stringify({ success:false, message:'Invalid credentials' }));
      }
      // generate token
      const token = crypto.randomBytes(16).toString('hex');
      await db.query('UPDATE users SET token = ? WHERE id = ?', [token, user.id]);
      // respond
      res.writeHead(200, {'Content-Type':'application/json'});
      res.end(JSON.stringify({ success:true, message:'Login successful', token }));
    } catch (err) {
      console.error(err);
      res.writeHead(500, {'Content-Type':'application/json'});
      res.end(JSON.stringify({ success:false, message:'Server error' }));
    }
  });
}

module.exports = { registerUser, loginUser };
