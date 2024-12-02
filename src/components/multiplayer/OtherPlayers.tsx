import { useMultiplayerStore } from '../../services/multiplayer/store';
import { RobotModel } from '../RobotModel';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export function OtherPlayers() {
  const { players, playerId } = useMultiplayerStore();
  const lastUpdate = useRef<Record<string, number>>({});

  useFrame(() => {
    // Clean up inactive players
    Object.entries(players).forEach(([id, player]) => {
      if (Date.now() - player.lastUpdate > 5000) {
        delete lastUpdate.current[id];
      }
    });
  });

  return (
    <>
      {Object.entries(players).map(([id, player]) => {
        if (id === playerId) return null;
        
        // Skip rendering if player data is too old
        if (Date.now() - player.lastUpdate > 5000) return null;

        return (
          <group
            key={id}
            position={new THREE.Vector3(...player.position)}
            rotation={new THREE.Euler(0, player.rotation[1], 0)}
          >
            <RobotModel isMoving={false} />
          </group>
        );
      })}
    </>
  );
}