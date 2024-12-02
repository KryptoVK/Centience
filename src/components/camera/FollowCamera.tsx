import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import * as THREE from 'three';

const CAMERA_DISTANCE = 8; // Increased from 5 for better view
const CAMERA_HEIGHT = 3; // Increased from 2 for better perspective
const LERP_FACTOR = 0.05; // Reduced from 0.1 for smoother camera movement

export function FollowCamera({ target }: { target: THREE.Group }) {
  const cameraPositionRef = useRef(new Vector3());
  const cameraTargetRef = useRef(new Vector3());

  useFrame(({ camera }) => {
    if (!target) return;

    // Calculate ideal camera position behind the player
    const idealOffset = new Vector3(
      0,
      CAMERA_HEIGHT,
      CAMERA_DISTANCE
    );
    
    // Apply target's rotation to the offset
    const targetRotation = new THREE.Quaternion();
    target.getWorldQuaternion(targetRotation);
    idealOffset.applyQuaternion(targetRotation);
    idealOffset.add(target.position);

    // Calculate ideal look-at position in front of the player
    const idealLookAt = target.position.clone().add(new Vector3(0, 1.5, 0));

    // Smoothly interpolate camera position and look-at
    cameraPositionRef.current.lerp(idealOffset, LERP_FACTOR);
    cameraTargetRef.current.lerp(idealLookAt, LERP_FACTOR);

    // Update camera
    camera.position.copy(cameraPositionRef.current);
    camera.lookAt(cameraTargetRef.current);
  });

  return null;
}