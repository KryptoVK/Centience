import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import IPFS from 'ipfs-core';
import OrbitDB from 'orbit-db';
import { v4 as uuidv4 } from 'uuid';
import { useMultiplayerStore } from './store';
import { Player, MultiplayerState } from './types';
import { WorldSchema } from '../worldGeneration/types';

interface OrbitDBContextType {
  isReady: boolean;
  error: Error | null;
  updatePlayerPosition: (position: [number, number, number], rotation: [number, number, number]) => void;
  updateWorldSchema: (schema: WorldSchema) => void;
}

const OrbitDBContext = createContext<OrbitDBContextType | null>(null);

const WORLD_ADDRESS = '/orbitdb/centience-world/world';
const UPDATE_INTERVAL = 50; // ms

export function OrbitDBProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [db, setDb] = useState<OrbitDB.DocumentStore<MultiplayerState> | null>(null);
  
  const {
    setPlayerId,
    updatePlayer,
    removePlayer,
    updateWorldSchema: updateStoreWorldSchema,
  } = useMultiplayerStore();

  useEffect(() => {
    let cleanup = false;
    
    const initialize = async () => {
      try {
        const ipfs = await IPFS.create();
        const orbitdb = await OrbitDB.createInstance(ipfs);
        
        const worldDb = await orbitdb.docs<MultiplayerState>(WORLD_ADDRESS, {
          indexBy: 'id',
          replicate: true,
        });

        await worldDb.load();
        
        const playerId = uuidv4();
        setPlayerId(playerId);
        
        // Subscribe to database changes
        worldDb.events.on('write', (address, entry) => {
          const state = entry.payload.value as MultiplayerState;
          
          // Update world schema if changed
          if (state.worldSchema) {
            updateStoreWorldSchema(state.worldSchema);
          }
          
          // Update players
          Object.entries(state.players).forEach(([id, player]) => {
            if (id !== playerId) {
              if (Date.now() - player.lastUpdate > 5000) {
                removePlayer(id);
              } else {
                updatePlayer(id, player);
              }
            }
          });
        });

        setDb(worldDb);
        setIsReady(true);
      } catch (err) {
        setError(err as Error);
      }
    };

    if (!cleanup) {
      initialize();
    }

    return () => {
      cleanup = true;
      db?.close();
    };
  }, []);

  const updatePlayerPosition = async (
    position: [number, number, number],
    rotation: [number, number, number]
  ) => {
    if (!db || !isReady) return;

    const state = db.get('state');
    const playerId = useMultiplayerStore.getState().playerId;
    
    if (!playerId) return;

    const updatedState: MultiplayerState = {
      players: {
        ...state.players,
        [playerId]: {
          id: playerId,
          position,
          rotation,
          lastUpdate: Date.now(),
        },
      },
      worldSchema: state.worldSchema,
    };

    await db.put('state', updatedState);
  };

  const updateWorldSchema = async (schema: WorldSchema) => {
    if (!db || !isReady) return;

    const state = db.get('state');
    
    const updatedState: MultiplayerState = {
      players: state.players,
      worldSchema: schema,
    };

    await db.put('state', updatedState);
  };

  return (
    <OrbitDBContext.Provider
      value={{
        isReady,
        error,
        updatePlayerPosition,
        updateWorldSchema,
      }}
    >
      {children}
    </OrbitDBContext.Provider>
  );
}

export function useOrbitDB() {
  const context = useContext(OrbitDBContext);
  if (!context) {
    throw new Error('useOrbitDB must be used within an OrbitDBProvider');
  }
  return context;
}