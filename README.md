# Centience - Interactive 3D Multiplayer Space Experience

A real-time multiplayer space exploration game built with Three.js, React, and Socket.IO. Players can explore a procedurally generated lunar environment while interacting with other players in real-time.

![Centience Screenshot](https://i.ibb.co/xjDqKCh/header.webp)

## Features

- 🎮 Real-time multiplayer interaction
- 🌍 Procedurally generated lunar environment
- 🚀 Realistic space physics and animations
- 🤖 Custom astronaut character with animations
- 🌎 Dynamic Earth orbit visualization
- ⭐ Immersive space atmosphere with stars
- 📊 Real-time performance monitoring
- 🎯 Interactive objects and environment

## Prerequisites

- Node.js 18 or higher
- npm 9 or higher

## Local Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd centience-threejs-integration
```

2. Install dependencies:
```bash
npm install
```

3. Start the development servers:
```bash
npm run dev
```

This command starts both:
- Frontend (Vite): http://localhost:5173
- Backend (Socket.IO): http://localhost:3000

## Controls

- **W** - Move Forward
- **S** - Move Backward
- **A** - Move Left
- **D** - Move Right
- **Mouse** - Look around
- **Generate World Button** - Create new procedural environment

## Project Structure

```
├── src/
│   ├── components/         # React components
│   │   ├── celestial/     # Space-related components
│   │   ├── environment/   # World environment components
│   │   ├── materials/     # Custom Three.js materials
│   │   ├── performance/   # Performance monitoring
│   │   └── robot-parts/   # Astronaut model parts
│   ├── services/          # Core services
│   │   ├── multiplayer/   # Multiplayer functionality
│   │   └── worldGeneration/ # Procedural generation
│   └── config/            # Configuration files
├── server/                # Socket.IO backend
└── public/               # Static assets
```

## Multiplayer Features

- Real-time player position synchronization
- Shared world state across all players
- Interactive environment elements
- Player join/leave notifications
- Automatic cleanup of inactive players

## Environment Generation

The world is procedurally generated with:
- Dynamic lunar surface
- Realistic craters
- Interactive rock formations
- Orbiting Earth visualization
- Dynamic star field
- Custom shaders for materials

## Performance

The application includes built-in performance monitoring:
- FPS counter
- Automatic optimization of distant objects
- Efficient network synchronization
- WebGL performance tracking

## Deployment

### Backend (Socket.IO Server)
1. Create a new web service on your hosting platform
2. Set environment variables:
```env
NODE_ENV=production
PORT=3000
```
3. Deploy the server code

### Frontend
1. Update the Socket.IO URL in `src/services/multiplayer/SocketContext.tsx`
2. Build the project:
```bash
npm run build
```
3. Deploy the `dist` directory

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Three.js for 3D rendering
- React Three Fiber for React integration
- Socket.IO for real-time communication
- React for UI components
- Vite for development and building
