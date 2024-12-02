import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useMultiplayerStore } from './store';
import { Player } from './types';
import { WorldSchema } from '../worldGeneration/types';

interface SocketContextType {
  isReady: boolean;
  error: Error | null;
  updatePlayerPosition: (position: [number, number, number], rotation: [number, number, number]) => void;
  updateWorldSchema: (schema: WorldSchema) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

// Use the same URL for both development and production
const SOCKET_URL = window.location.origin;

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const {
    updatePlayer,
    removePlayer,
    updateWorldSchema: updateStoreWorldSchema,
  } = useMultiplayerStore();

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsReady(true);
      setError(null);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setError(err);
      setIsReady(false);
    });

    newSocket.on('players', (players: Player[]) => {
      players.forEach(player => {
        if (Date.now() - player.lastUpdate < 5000) {
          updatePlayer(player.id, player);
        }
      });
    });

    newSocket.on('playerUpdate', (player: Player) => {
      if (Date.now() - player.lastUpdate < 5000) {
        updatePlayer(player.id, player);
      }
    });

    newSocket.on('playerDisconnected', (playerId: string) => {
      removePlayer(playerId);
    });

    newSocket.on('worldUpdate', (schema: WorldSchema) => {
      updateStoreWorldSchema(schema);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const updatePlayerPosition = (
    position: [number, number, number],
    rotation: [number, number, number]
  ) => {
    if (!socket?.connected || !isReady) return;

    socket.emit('playerUpdate', {
      position,
      rotation,
      lastUpdate: Date.now(),
    });
  };

  const updateWorldSchema = (schema: WorldSchema) => {
    if (!socket?.connected || !isReady) return;

    socket.emit('worldUpdate', schema);
  };

  return (
    <SocketContext.Provider
      value={{
        isReady,
        error,
        updatePlayerPosition,
        updateWorldSchema,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
