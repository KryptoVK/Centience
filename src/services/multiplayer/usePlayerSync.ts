import { useRef } from 'react';
import { useSocket } from './SocketContext';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

const SYNC_INTERVAL = 33; // ~30fps sync rate

export function usePlayerSync(playerRef: React.RefObject<Group>) {
  const { updatePlayerPosition } = useSocket();
  const lastSyncTime = useRef(0);
  const lastPosition = useRef<[number, number, number]>([0, 0, 0]);
  const lastRotation = useRef<[number, number, number]>([0, 0, 0]);

  useFrame(() => {
    if (!playerRef.current) return;

    const now = Date.now();
    if (now - lastSyncTime.current >= SYNC_INTERVAL) {
      const currentPosition = playerRef.current.position.toArray() as [number, number, number];
      const currentRotation = [0, playerRef.current.rotation.y, 0] as [number, number, number];

      // Only sync if position or rotation has changed
      if (
        currentPosition.some((v, i) => Math.abs(v - lastPosition.current[i]) > 0.001) ||
        currentRotation.some((v, i) => Math.abs(v - lastRotation.current[i]) > 0.001)
      ) {
        updatePlayerPosition(currentPosition, currentRotation);
        lastPosition.current = currentPosition;
        lastRotation.current = currentRotation;
      }

      lastSyncTime.current = now;
    }
  });
}