import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

const LunarMaterial = shaderMaterial(
  {
    colorA: new THREE.Color('#1a1a1a'),
    colorB: new THREE.Color('#404040'),
    scale: 30.0,
    craterScale: 5.0,
    time: 0,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform vec3 colorA;
    uniform vec3 colorB;
    uniform float scale;
    uniform float craterScale;
    uniform float time;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }
    
    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }
    
    float crater(vec2 uv, vec2 center, float size) {
      float d = length(uv - center);
      float rim = smoothstep(size * 0.8, size, d) * smoothstep(size * 1.2, size, d);
      float crater = 1.0 - smoothstep(size * 0.8, size * 1.2, d);
      return rim * 0.5 + crater * 0.2;
    }
    
    void main() {
      vec2 scaledUv = vUv * scale;
      float n = noise(scaledUv * craterScale);
      
      // Create multiple craters
      float c = 0.0;
      for(float i = 0.0; i < 5.0; i++) {
        vec2 center = vec2(random(vec2(i, 0.0)), random(vec2(0.0, i)));
        float size = random(vec2(i, i)) * 0.3;
        c += crater(vUv, center, size);
      }
      
      vec3 color = mix(colorA, colorB, n + c);
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ LunarMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    lunarMaterial: any;
  }
}