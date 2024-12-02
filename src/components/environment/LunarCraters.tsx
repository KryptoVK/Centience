import { Instances, Instance } from '@react-three/drei';
import { InteractiveObject } from './InteractiveObject';
import { interactiveConfig } from '../../config/interactiveConfig';

interface LunarCratersProps {
  schema: {
    count: number;
    minScale: number;
    maxScale: number;
    spreadRadius: number;
    positions: Array<{
      position: [number, number, number];
      rotation: [number, number, number];
      scale: number;
    }>;
  };
}

export function LunarCraters({ schema }: LunarCratersProps) {
  return (
    <Instances limit={schema.count}>
      <cylinderGeometry args={[1, 1.2, 0.2, 32]} />
      <meshStandardMaterial
        color="#2a2a2a"
        roughness={1}
        metalness={0}
        envMapIntensity={0.1}
      />
      {schema.positions.map((props, i) => (
        <InteractiveObject
          key={i}
          position={props.position}
          rotation={props.rotation}
          scale={props.scale}
          message={interactiveConfig.craters[i % interactiveConfig.craters.length].message}
          link={interactiveConfig.craters[i % interactiveConfig.craters.length].link}
        >
          <Instance
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
          />
        </InteractiveObject>
      ))}
    </Instances>
  );
}