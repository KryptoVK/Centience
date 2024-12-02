import { Vector3 } from 'three';

interface RobotArmProps {
  position: Vector3;
  rotation?: number;
}

export function RobotArm({ position, rotation = 0 }: RobotArmProps) {
  return (
    <group position={position}>
      {/* Shoulder joint */}
      <mesh castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#4A4A4A" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Upper arm assembly */}
      <group rotation={[rotation, 0, 0]}>
        {/* Upper arm */}
        <mesh castShadow position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.12, 0.1, 0.6]} />
          <meshStandardMaterial color="#2C3E50" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Hydraulic detail */}
        <mesh castShadow position={[0.1, -0.3, 0.1]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5]} />
          <meshStandardMaterial color="#B8B8B8" metalness={0.95} roughness={0.05} />
        </mesh>

        {/* Elbow joint */}
        <mesh castShadow position={[0, -0.6, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#4A4A4A" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Forearm assembly */}
        <group position={[0, -0.6, 0]} rotation={[Math.sin(rotation * 0.5) * 0.3, 0, 0]}>
          {/* Forearm */}
          <mesh castShadow position={[0, -0.25, 0]}>
            <cylinderGeometry args={[0.08, 0.06, 0.5]} />
            <meshStandardMaterial color="#2C3E50" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Hand */}
          <group position={[0, -0.5, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.15, 0.2, 0.1]} />
              <meshStandardMaterial color="#4A4A4A" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}