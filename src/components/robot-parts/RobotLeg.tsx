import { Vector3 } from 'three';

interface RobotLegProps {
  position: Vector3;
  rotation?: number;
}

export function RobotLeg({ position, rotation = 0 }: RobotLegProps) {
  return (
    <group position={position}>
      {/* Hip joint */}
      <mesh castShadow position={[0, 0, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#4A4A4A" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Upper leg assembly */}
      <group rotation={[rotation, 0, 0]}>
        {/* Upper leg main */}
        <mesh castShadow position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.15, 0.12, 0.4]} />
          <meshStandardMaterial color="#2C3E50" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Hydraulic piston */}
        <mesh castShadow position={[0.1, -0.2, 0.1]}>
          <cylinderGeometry args={[0.03, 0.03, 0.35]} />
          <meshStandardMaterial color="#B8B8B8" metalness={0.95} roughness={0.05} />
        </mesh>

        {/* Knee joint */}
        <mesh castShadow position={[0, -0.4, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#4A4A4A" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Lower leg assembly */}
        <group position={[0, -0.4, 0]} rotation={[Math.sin(rotation * 0.5) * 0.5, 0, 0]}>
          {/* Lower leg main */}
          <mesh castShadow position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.12, 0.1, 0.5]} />
            <meshStandardMaterial color="#2C3E50" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Ankle joint */}
          <mesh castShadow position={[0, -0.55, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#4A4A4A" metalness={0.9} roughness={0.1} />
          </mesh>

          {/* Foot */}
          <group position={[0, -0.6, 0.1]} rotation={[-0.2, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.2, 0.1, 0.3]} />
              <meshStandardMaterial color="#4A4A4A" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}