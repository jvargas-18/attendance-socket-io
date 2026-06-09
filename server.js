import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'https://attendance-socket-io.onrender.com',
    methods: ['GET', 'POST'],
  },
  // Start with polling, then upgrade to WebSocket
  transports: ['polling', 'websocket'],
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', connections: io.engine.clientsCount });
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('message', (data) => {
    // Broadcast to all other clients
    socket.broadcast.emit('message', data);
  });

  socket.on('disconnect', (reason) => {
    console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
  });
});

const port = process.env.PORT || 3000;
httpServer.listen(port, '0.0.0.0', () => {
  console.log(`Socket.IO server running on port ${port}`);
});