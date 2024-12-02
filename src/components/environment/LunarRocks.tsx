import { Instances, Instance } from '@react-three/drei';
import { InteractiveObject } from './InteractiveObject';
import { interactiveConfig } from '../../config/interactiveConfig';

interface LunarRocksProps {
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

export function LunarRocks({ schema }: LunarRocksProps) {
  return (
    <Instances limit={schema.count}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#404040"
        roughness={0.9}
        metalness={0.1}
        envMapIntensity={0.2}
      />
      {schema.positions.map((props, i) => (
        <InteractiveObject
          key={i}
          position={props.position}
          rotation={props.rotation}
          scale={props.scale}
          message={interactiveConfig.rocks[i % interactiveConfig.rocks.length].message}
          link={interactiveConfig.rocks[i % interactiveConfig.rocks.length].link}
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