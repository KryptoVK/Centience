import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Gun from 'gun';
import { v4 as uuidv4 } from 'uuid';
import { useMultiplayerStore } from './store';
import { Player } from './types';
import { WorldSchema } from '../worldGeneration/types';

interface GunContextType {
  isReady: boolean;
  error: Error | null;
  updatePlayerPosition: (position: [number, number, number], rotation: [number, number, number]) => void;
  updateWorldSchema: (schema: WorldSchema) => void;
}

const GunContext = createContext<GunContextType | null>(null);

const PEERS = [
  'https://gun-manhattan.herokuapp.com/gun',
  'https://gun-us.herokuapp.com/gun',
  'https://gun-eu.herokuapp.com/gun'
];

export function GunProvider({ children }: { children: ReactNode }) {
  const [gun] = useState(() => Gun({ 
    peers: PEERS, 
    localStorage: false,
    radisk: false,
    file: false
  }));
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const {
    setPlayerId,
    updatePlayer,
    removePlayer,
    updateWorldSchema: updateStoreWorldSchema,
  } = useMultiplayerStore();

  useEffect(() => {
    const playerId = uuidv4();
    setPlayerId(playerId);

    // Subscribe to world state
    gun.get('centience-world').on((data) => {
      if (data?.worldSchema) {
        updateStoreWorldSchema(data.worldSchema);
      }
    });

    // Subscribe to player updates with more frequent updates
    gun.get('centience-players').map().on((data: Player, id) => {
      if (!data || id === playerId) return;
      
      if (Date.now() - data.lastUpdate > 5000) {
        removePlayer(id);
      } else {
        updatePlayer(id, data);
      }
    }, { change: true });

    // Cleanup inactive players periodically
    const cleanup = setInterval(() => {
      const players = useMultiplayerStore.getState().players;
      Object.entries(players).forEach(([id, player]) => {
        if (Date.now() - player.lastUpdate > 5000) {
          removePlayer(id);
        }
      });
    }, 1000);

    setIsReady(true);

    return () => {
      gun.get('centience-players').off();
      gun.get('centience-world').off();
      clearInterval(cleanup);
    };
  }, [gun]);

  const updatePlayerPosition = (
    position: [number, number, number],
    rotation: [number, number, number]
  ) => {
    const playerId = useMultiplayerStore.getState().playerId;
    if (!playerId || !isReady) return;

    gun.get('centience-players').get(playerId).put({
      id: playerId,
      position,
      rotation,
      lastUpdate: Date.now(),
    });
  };

  const updateWorldSchema = (schema: WorldSchema) => {
    if (!isReady) return;

    gun.get('centience-world').put({
      worldSchema: schema,
      lastUpdate: Date.now(),
    });
  };

  return (
    <GunContext.Provider
      value={{
        isReady,
        error,
        updatePlayerPosition,
        updateWorldSchema,
      }}
    >
      {children}
    </GunContext.Provider>
  );
}

export function useGun() {
  const context = useContext(GunContext);
  if (!context) {
    throw new Error('useGun must be used within a GunProvider');
  }
  return context;
}