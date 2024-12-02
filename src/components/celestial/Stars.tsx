import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sceneConfig } from '../../config/sceneConfig';

export function Stars() {
  const starsRef = useRef<THREE.Points>(null);
  const { count, minSize, maxSize, sphereRadius } = sceneConfig.environment.stars;
  
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count * 3; i += 3) {
    const r = sphereRadius.min + Math.random() * (sphereRadius.max - sphereRadius.min);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i] = r * Math.sin(phi) * Math.cos(theta);
    positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i + 2] = r * Math.cos(phi);

    const colorChoice = Math.random();
    if (colorChoice > 0.95) {
      colors[i] = 0.6;
      colors[i + 1] = 0.8;
      colors[i + 2] = 1;
    } else if (colorChoice > 0.9) {
      colors[i] = 1;
      colors[i + 1] = 0.8;
      colors[i + 2] = 0.4;
    } else if (colorChoice > 0.85) {
      colors[i] = 1;
      colors[i + 1] = 0.4;
      colors[i + 2] = 0.4;
    } else {
      colors[i] = 1;
      colors[i + 1] = 1;
      colors[i + 2] = 1;
    }

    sizes[i / 3] = minSize + Math.random() * (maxSize - minSize);
  }

  useFrame(({ clock }) => {
    if (!starsRef.current) return;
    starsRef.current.rotation.y = clock.getElapsedTime() * 0.005;
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.5}
        sizeAttenuation={true}
        vertexColors={true}
        transparent
        opacity={1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}