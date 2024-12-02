import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

export function useWalkingAnimation(isMoving: boolean) {
  const time = useRef(0);
  const legRotation = useRef({ left: 0, right: 0 });
  const armRotation = useRef({ left: 0, right: 0 });
  const bodyOffset = useRef(0);

  useFrame((_, delta) => {
    if (isMoving) {
      // Even slower animation speed for more realistic lunar movement
      time.current += delta * 3;
      
      // Reduced range of motion for more realistic lunar movement
      const legAmplitude = 0.3; // Reduced from 0.4
      const armAmplitude = 0.2; // Reduced from 0.3
      
      // Smooth sine wave for leg movement
      legRotation.current.left = Math.sin(time.current) * legAmplitude;
      legRotation.current.right = Math.sin(time.current + Math.PI) * legAmplitude;
      
      // Subtle arm movements with slight delay
      armRotation.current.left = Math.sin(time.current * 0.8 + Math.PI) * armAmplitude;
      armRotation.current.right = Math.sin(time.current * 0.8) * armAmplitude;
      
      // Very subtle body bob with reduced amplitude
      bodyOffset.current = Math.abs(Math.sin(time.current * 1.5)) * 0.02;
    } else {
      // Slower return to idle position
      const dampingFactor = 0.97; // Increased from 0.95 for smoother transition
      legRotation.current.left *= dampingFactor;
      legRotation.current.right *= dampingFactor;
      armRotation.current.left *= dampingFactor;
      armRotation.current.right *= dampingFactor;
      bodyOffset.current *= dampingFactor;
    }
  });

  return {
    legRotation: legRotation.current,
    armRotation: armRotation.current,
    bodyOffset: bodyOffset.current,
  };
}