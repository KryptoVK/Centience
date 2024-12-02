import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { World } from './World';
import { Player } from './Player';
import { OtherPlayers } from './multiplayer/OtherPlayers';
import { FloatingLogo } from './FloatingLogo';
import { useRef } from 'react';
import * as THREE from 'three';

export function Scene() {
  const playerRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);

  return (
    <Canvas shadows>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 8, 12]}
        fov={60}
        near={0.1}
        far={2000}
      />
      
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
        maxDistance={15}
        minDistance={8}
        target={[0, 2, 0]}
        enableDamping={true}
        dampingFactor={0.05}
      />
      
      {/* Enhanced Space Lighting */}
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[50, 50, 50]}
        intensity={2}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      
      {/* Rim light for astronaut definition */}
      <pointLight
        position={[-30, 20, -30]}
        intensity={0.5}
        color="#b0c4de"
        distance={100}
        decay={2}
      />
      
      {/* Environment */}
      <World />
      
      {/* Floating Logo */}
      <FloatingLogo />
      
      {/* Players */}
      <Player ref={playerRef} cameraRef={cameraRef} controlsRef={controlsRef} />
      <OtherPlayers />

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
        />
        <Vignette darkness={0.5} />
      </EffectComposer>
    </Canvas>
  );
}