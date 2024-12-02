import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Enable CORS for all origins in development
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://playful-cranachan-6f5609.netlify.app'
      : '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

const players = new Map();
let worldSchema = null;

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  // Send current state to new player
  if (worldSchema) {
    socket.emit('worldUpdate', worldSchema);
  }
  
  socket.emit('players', Array.from(players.values()));

  // Handle player updates
  socket.on('playerUpdate', (data) => {
    const playerData = {
      ...data,
      id: socket.id,
      lastUpdate: Date.now()
    };
    players.set(socket.id, playerData);
    socket.broadcast.emit('playerUpdate', playerData);
  });

  // Handle world updates
  socket.on('worldUpdate', (schema) => {
    worldSchema = schema;
    socket.broadcast.emit('worldUpdate', schema);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    players.delete(socket.id);
    io.emit('playerDisconnected', socket.id);
  });
});

// Clean up inactive players
setInterval(() => {
  const now = Date.now();
  for (const [id, player] of players.entries()) {
    if (now - player.lastUpdate > 5000) {
      players.delete(id);
      io.emit('playerDisconnected', id);
    }
  }
}, 1000);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});