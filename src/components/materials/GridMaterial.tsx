import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

const GridMaterial = shaderMaterial(
  {
    colorA: new THREE.Color('#3a7e3d'),
    colorB: new THREE.Color('#2d6230'),
    scale: 50.0,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform vec3 colorA;
    uniform vec3 colorB;
    uniform float scale;
    varying vec2 vUv;
    
    void main() {
      vec2 scaledUv = vUv * scale;
      vec2 grid = abs(fract(scaledUv - 0.5) - 0.5) / fwidth(scaledUv);
      float line = min(grid.x, grid.y);
      float color = 1.0 - min(line, 1.0);
      vec3 finalColor = mix(colorA, colorB, color);
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

extend({ GridMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    gridMaterial: any;
  }
}