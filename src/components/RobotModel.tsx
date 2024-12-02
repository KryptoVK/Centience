import { useRef } from 'react';
import { Group } from 'three';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { RobotArm } from './robot-parts/RobotArm';
import { RobotLeg } from './robot-parts/RobotLeg';
import { useWalkingAnimation } from './animations/useWalkingAnimation';
import { logoConfig } from '../config/logoConfig';

interface RobotModelProps {
  isMoving: boolean;
}

export function RobotModel({ isMoving }: RobotModelProps) {
  const robotRef = useRef<Group>(null);
  const { legRotation, armRotation, bodyOffset } = useWalkingAnimation(isMoving);

  // Only load logo texture if enabled and URL is provided
  const logoTexture = logoConfig.enabled && logoConfig.url ? 
    useLoader(THREE.TextureLoader, logoConfig.url) : null;

  if (logoTexture) {
    logoTexture.encoding = THREE.sRGBEncoding;
  }

  return (
    <group ref={robotRef} position={[0, bodyOffset + 1, 0]}>
      {/* Spacesuit Backpack */}
      <mesh position={[0, 0.7, -0.3]} castShadow>
        <boxGeometry args={[0.7, 0.9, 0.4]} />
        <meshStandardMaterial color="#FFFFFF" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Life Support System */}
      <mesh position={[0, 0.7, -0.4]} castShadow>
        <boxGeometry args={[0.5, 0.6, 0.2]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Main Body (Spacesuit) */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[0.8, 1.2, 0.5]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          metalness={0.5} 
          roughness={0.5}
          map={logoTexture || null}
        />
      </mesh>

      {/* Logo Overlay (only if enabled) */}
      {logoConfig.enabled && logoTexture && (
        <mesh 
          position={[
            logoConfig.position.x,
            logoConfig.position.y,
            logoConfig.position.z
          ]} 
          castShadow
        >
          <planeGeometry args={[logoConfig.scale.width, logoConfig.scale.height]} />
          <meshBasicMaterial
            map={logoTexture}
            transparent={true}
            opacity={logoConfig.opacity}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Helmet */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color="#B0C4DE"
          metalness={0.3}
          roughness={0.4}
          transparent={true}
          opacity={0.8}
        />
      </mesh>

      {/* Helmet Visor */}
      <mesh position={[0, 1.5, 0.2]} castShadow>
        <sphereGeometry args={[0.35, 32, 16]} />
        <meshStandardMaterial
          color="#4A90E2"
          metalness={0.9}
          roughness={0.1}
          transparent={true}
          opacity={0.4}
        />
      </mesh>

      {/* Suit Connectors */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.25, 0.1]} />
        <meshStandardMaterial color="#A0A0A0" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Arms with space suit material */}
      <RobotArm position={[0.6, 0.7, 0]} rotation={armRotation.right} />
      <RobotArm position={[-0.6, 0.7, 0]} rotation={armRotation.left} />

      {/* Legs with space suit material */}
      <RobotLeg position={[0.25, 0, 0]} rotation={legRotation.right} />
      <RobotLeg position={[-0.25, 0, 0]} rotation={legRotation.left} />

      {/* Communication Antenna */}
      <mesh position={[0.2, 1.9, -0.1]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.3]} />
        <meshStandardMaterial color="#A0A0A0" />
      </mesh>
      <mesh position={[0.2, 2.1, -0.1]} castShadow>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}