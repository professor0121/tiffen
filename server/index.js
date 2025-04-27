const http = require('http');
const { router } = require('./routes/router');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create the server and pass the request to the router
const server = http.createServer((req, res) => {
  router(req, res);
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
