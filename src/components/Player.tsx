import { forwardRef, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { RobotModel } from './RobotModel';
import { usePlayerSync } from '../services/multiplayer/usePlayerSync';
import { Controls } from './KeyboardControls';

interface PlayerProps {
  cameraRef: React.RefObject<THREE.PerspectiveCamera>;
  controlsRef: React.RefObject<any>;
}

export const Player = forwardRef<THREE.Group, PlayerProps>(({ cameraRef, controlsRef }, ref) => {
  const velocity = useRef(new THREE.Vector3());
  const rotation = useRef(new THREE.Euler(0, 0, 0));
  const targetPosition = useRef(new THREE.Vector3());
  
  // Sync player position with multiplayer
  usePlayerSync(ref as React.RefObject<THREE.Group>);
  
  // Constants
  const WALK_SPEED = 0.09;
  const GROUND_HEIGHT = 0;
  const DAMPING = 0.95;
  const MAP_BOUNDS = 95;
  const CAMERA_LERP = 0.05;

  const [, getKeys] = useKeyboardControls();

  // Helper function to keep player within bounds
  const clampPosition = (position: THREE.Vector3) => {
    position.x = THREE.MathUtils.clamp(position.x, -MAP_BOUNDS, MAP_BOUNDS);
    position.z = THREE.MathUtils.clamp(position.z, -MAP_BOUNDS, MAP_BOUNDS);
    return position;
  };

  useFrame((state, delta) => {
    if (!ref || !('current' in ref) || !ref.current || !cameraRef.current || !controlsRef.current) return;

    const keys = getKeys();
    const isMoving = keys[Controls.forward] || keys[Controls.backward] || keys[Controls.left] || keys[Controls.right];

    // Get camera direction
    const cameraDirection = new THREE.Vector3();
    cameraRef.current.getWorldDirection(cameraDirection);
    cameraDirection.y = 0;
    cameraDirection.normalize();

    // Calculate right vector
    const rightVector = new THREE.Vector3();
    rightVector.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0));

    // Reset velocity when no keys are pressed
    if (!isMoving) {
      velocity.current.multiplyScalar(DAMPING);
      if (velocity.current.lengthSq() < 0.001) {
        velocity.current.set(0, 0, 0);
      }
    } else {
      // Calculate movement direction relative to camera
      const moveDirection = new THREE.Vector3();
      
      if (keys[Controls.forward]) moveDirection.add(cameraDirection);
      if (keys[Controls.backward]) moveDirection.sub(cameraDirection);
      if (keys[Controls.left]) moveDirection.sub(rightVector);
      if (keys[Controls.right]) moveDirection.add(rightVector);

      if (moveDirection.lengthSq() > 0) {
        moveDirection.normalize();
        velocity.current.lerp(moveDirection.multiplyScalar(WALK_SPEED), 0.15);
      }
    }

    // Calculate new position with bounds checking
    const newPosition = ref.current.position.clone().add(
      velocity.current.clone().multiplyScalar(delta * 60)
    );
    
    // Apply clamped position
    ref.current.position.copy(clampPosition(newPosition));
    
    // Update player rotation to face movement direction
    if (velocity.current.lengthSq() > 0.001) {
      rotation.current.y = Math.atan2(velocity.current.x, velocity.current.z);
    }
    
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      rotation.current.y,
      0.1
    );

    // Keep player grounded
    ref.current.position.y = GROUND_HEIGHT;

    // Update camera target to follow player smoothly
    targetPosition.current.set(
      ref.current.position.x,
      2,
      ref.current.position.z
    );
    controlsRef.current.target.lerp(targetPosition.current, CAMERA_LERP);
  });

  return (
    <group ref={ref} position={[0, GROUND_HEIGHT, 0]}>
      <RobotModel isMoving={
        getKeys()[Controls.forward] || 
        getKeys()[Controls.backward] || 
        getKeys()[Controls.left] || 
        getKeys()[Controls.right]
      } />
    </group>
  );
});

Player.displayName = 'Player';