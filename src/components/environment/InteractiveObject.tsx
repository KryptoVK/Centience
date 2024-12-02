import { useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface InteractiveObjectProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  message?: string;
  link?: string;
  children: React.ReactNode;
}

export function InteractiveObject({ 
  position, 
  rotation = [0, 0, 0], 
  scale = 1, 
  message,
  link,
  children 
}: InteractiveObjectProps) {
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    if (message) {
      alert(message);
    }
    if (link) {
      window.open(link, '_blank');
    }
  };

  return (
    <group
      position={position}
      rotation={rotation as [number, number, number]}
      scale={scale}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {children}
    </group>
  );
}