import { WorldSchema } from '../worldGeneration/types';

export interface Player {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  lastUpdate: number;
}

export interface MultiplayerState {
  players: Record<string, Player>;
  worldSchema: WorldSchema | null;
}

export interface MultiplayerStore {
  players: Record<string, Player>;
  worldSchema: WorldSchema | null;
  playerId: string | null;
  updatePlayerPosition: (position: [number, number, number], rotation: [number, number, number]) => void;
  updateWorldSchema: (schema: WorldSchema) => void;
  setPlayerId: (id: string) => void;
  updatePlayer: (playerId: string, player: Player) => void;
  removePlayer: (playerId: string) => void;
}