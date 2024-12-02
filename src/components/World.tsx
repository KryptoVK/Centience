import { useEffect } from 'react';
import { Plane } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import './materials/LunarMaterial';
import { Earth } from './celestial/Earth';
import { Stars } from './celestial/Stars';
import { LunarRocks } from './environment/LunarRocks';
import { LunarCraters } from './environment/LunarCraters';
import { useWorldGeneration } from '../services/worldGeneration/WorldGenerationContext';

export function World() {
  const { scene } = useThree();
  const { worldSchema, generateNewWorld } = useWorldGeneration();

  useEffect(() => {
    scene.background = new THREE.Color('#000000');
    scene.fog = new THREE.FogExp2('#000000', 0.00125);
    
    // Generate initial world if none exists
    if (!worldSchema) {
      generateNewWorld();
    }
  }, [scene, worldSchema, generateNewWorld]);

  if (!worldSchema) return null;

  return (
    <>
      <Stars schema={worldSchema.environment.stars} />
      <Earth schema={worldSchema.celestial.earth} />

      <Plane
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
        args={[200, 200]}
      >
        <lunarMaterial 
          side={THREE.DoubleSide}
          colorA={new THREE.Color('#1a1a1a')}
          colorB={new THREE.Color('#404040')}
          scale={30}
          craterScale={5}
        />
      </Plane>

      <LunarRocks schema={worldSchema.environment.rocks} />
      <LunarCraters schema={worldSchema.environment.craters} />
    </>
  );
}