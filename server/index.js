const http = require('http');
const { router } = require('./routes/router');
const dotenv = require('dotenv');
const cors=require('cors');
const {initSocket} = require('./socket/socket');

// Load environment variables from .env file
dotenv.config();
 
// Create the server and pass the request to the router
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.writeHead(204); // No Content
    return res.end();
  }
  router(req, res);
});
 
initSocket(server);
// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
 