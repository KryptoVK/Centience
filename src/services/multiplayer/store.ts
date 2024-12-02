import { create } from 'zustand';
import { MultiplayerStore } from './types';

export const useMultiplayerStore = create<MultiplayerStore>((set) => ({
  players: {},
  worldSchema: null,
  playerId: null,
  
  updatePlayerPosition: (position, rotation) => {
    set((state) => {
      if (!state.playerId) return state;
      
      const updatedPlayers = {
        ...state.players,
        [state.playerId]: {
          id: state.playerId,
          position,
          rotation,
          lastUpdate: Date.now(),
        },
      };
      
      return { players: updatedPlayers };
    });
  },
  
  updateWorldSchema: (schema) => {
    set({ worldSchema: schema });
  },
  
  setPlayerId: (id) => {
    set({ playerId: id });
  },
  
  updatePlayer: (playerId, player) => {
    set((state) => ({
      players: {
        ...state.players,
        [playerId]: player,
      },
    }));
  },
  
  removePlayer: (playerId) => {
    set((state) => {
      const { [playerId]: _, ...remainingPlayers } = state.players;
      return { players: remainingPlayers };
    });
  },
}));