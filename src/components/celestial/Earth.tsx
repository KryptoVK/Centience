import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface EarthProps {
  schema: {
    orbitRadius: number;
    height: number;
    size: number;
    orbitSpeed: number;
    rotationSpeed: number;
    initialPosition: [number, number, number];
  };
}

export function Earth({ schema }: EarthProps) {
  const earthRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  const [earthMap, earthNormal, earthSpec, cloudsMap] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png'
  ]);

  useFrame(({ clock }) => {
    if (!earthRef.current || !cloudsRef.current) return;
    
    const t = clock.getElapsedTime() * schema.orbitSpeed;
    const x = Math.cos(t) * schema.orbitRadius;
    const z = Math.sin(t) * schema.orbitRadius;
    
    earthRef.current.position.set(x, schema.height, z);
    earthRef.current.lookAt(0, schema.height, 0);
    earthRef.current.rotateY(schema.rotationSpeed);
    cloudsRef.current.rotateY(schema.rotationSpeed * 1.1);
  });

  return (
    <group ref={earthRef} position={schema.initialPosition}>
      <Sphere args={[schema.size, 64, 64]} castShadow receiveShadow>
        <meshPhongMaterial
          map={earthMap}
          bumpMap={earthNormal}
          bumpScale={0.8}
          specularMap={earthSpec}
          specular={new THREE.Color('grey')}
          shininess={10}
          emissive={new THREE.Color('#112244')}
          emissiveIntensity={0.1}
        />
      </Sphere>

      <Sphere ref={cloudsRef} args={[schema.size * 1.01, 64, 64]}>
        <meshPhongMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.4}
          depthWrite={false}
          emissive={new THREE.Color('white')}
          emissiveIntensity={0.1}
        />
      </Sphere>

      <Sphere args={[schema.size * 1.02, 64, 64]}>
        <meshPhongMaterial
          color={new THREE.Color('#4ca6ff')}
          transparent={true}
          opacity={0.15}
          depthWrite={false}
          side={THREE.BackSide}
          emissive={new THREE.Color('#4ca6ff')}
          emissiveIntensity={0.2}
        />
      </Sphere>
    </group>
  );
}