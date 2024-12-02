import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export function FloatingLogo() {
  const texture = useLoader(THREE.TextureLoader, 'https://i.ibb.co/xjDqKCh/header.webp');

  return (
    <mesh position={[0, 30, -100]} rotation={[0, 0, 0]} scale={[23, 10, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial 
        map={texture} 
        transparent={true} 
        side={THREE.DoubleSide}
        depthWrite={false}
        opacity={0.8}
      />
    </mesh>
  );
}