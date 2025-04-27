// // socket.js
// // Professional Socket.IO setup separated from your main server file

// const { Server } = require('socket.io');
// let io;

// /**
//  * Initialize Socket.IO on the given HTTP server
//  * @param {http.Server} server - The Node.js HTTP server instance
//  */
// function initSocket(server) {
//   io = new Server(server, {
//     cors: {
//       origin: '*',                 // adjust origin as needed for production
//       methods: ['GET', 'POST']
//     }
//   });

//   io.on('connection', (socket) => {
//     console.log(`Client connected [id=${socket.id}]`);

//     // Listen for clients requesting to track an order
//     socket.on('track-order', (orderId) => {
//       console.log(`Socket ${socket.id} tracking order ${orderId}`);
//       // Optionally, fetch current status from DB and emit back
//       // e.g., fetchOrderStatus(orderId).then(status => {
//       //   socket.emit('order-status-updated', { orderId, status });
//       // });
//     });

//     socket.on('disconnect', () => {
//       console.log(`Client disconnected [id=${socket.id}]`);
//     });
//   });
// }

// /**
//  * Emit order status updates to all connected clients or a specific room
//  * @param {number} orderId - The order ID
//  * @param {string} status - The new order status
//  */
// function emitOrderStatus(orderId, status) {
//   if (!io) {
//     console.warn('Socket.IO not initialized. Call initSocket(server) first.');
//     return;
//   }
//   io.emit('order-status-updated', { orderId, status });
// }

// module.exports = { initSocket, emitOrderStatus };

// socket.js
// Professional Socket.IO setup separated from your main server file

const { Server } = require('socket.io');
const db = require('../utils/db'); // Import DB to fetch order status
let io;

/**
 * Initialize Socket.IO on the given HTTP server
 * @param {http.Server} server - The Node.js HTTP server instance
 */
function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*',                 // adjust origin as needed for production
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`Client connected [id=${socket.id}]`);

    // Listen for clients requesting to track an order
    socket.on('track-order', async (orderId) => {
      console.log(`Socket ${socket.id} tracking order ${orderId}`);
      try {
        // Fetch current order status from DB
        const [rows] = await db.query(
          'SELECT status FROM orders WHERE id = ?',
          [orderId]
        );
        if (rows.length > 0) {
          const status = rows[0].status;
          // Emit status back to requesting client
          socket.emit('order-status-updated', { orderId, status });
        } else {
          socket.emit('order-status-updated', { orderId, status: 'not_found' });
        }
      } catch (err) {
        console.error(`Error fetching status for order ${orderId}:`, err);
        socket.emit('order-status-updated', { orderId, status: 'error' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected [id=${socket.id}]`);
    });
  });
}

/**
 * Emit order status updates to all connected clients or a specific room
 * @param {number} orderId - The order ID
 * @param {string} status - The new order status
 */
function emitOrderStatus(orderId, status) {
  if (!io) {
    console.warn('Socket.IO not initialized. Call initSocket(server) first.');
    return;
  }
  io.emit('order-status-updated', { orderId, status });
}

module.exports = { initSocket, emitOrderStatus };
