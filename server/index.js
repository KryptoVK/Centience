import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Serve static files in production
app.use(express.static(join(__dirname, '../dist')));

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://centience.onrender.com', 'https://centience.onrender.com/']
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

  if (worldSchema) {
    socket.emit('worldUpdate', worldSchema);
  }
  
  socket.emit('players', Array.from(players.values()));

  socket.on('playerUpdate', (data) => {
    const playerData = {
      ...data,
      id: socket.id,
      lastUpdate: Date.now()
    };
    players.set(socket.id, playerData);
    socket.broadcast.emit('playerUpdate', playerData);
  });

  socket.on('worldUpdate', (schema) => {
    worldSchema = schema;
    socket.broadcast.emit('worldUpdate', schema);
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    players.delete(socket.id);
    io.emit('playerDisconnected', socket.id);
  });
});

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
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
