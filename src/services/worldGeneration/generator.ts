import * as THREE from 'three';
import { WorldSchema } from './types';

export function generateWorldSchema(): WorldSchema {
  const schema: WorldSchema = {
    environment: {
      rocks: {
        count: 10,
        minScale: 0.3,
        maxScale: 1.0,
        spreadRadius: 50,
        positions: Array.from({ length: 10 }, () => ({
          position: [
            Math.random() * 100 - 50,
            Math.random() * 0.3,
            Math.random() * 100 - 50
          ],
          rotation: [
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
          ],
          scale: 0.3 + Math.random() * 0.7
        }))
      },
      craters: {
        count: 5,
        minScale: 1.0,
        maxScale: 5.0,
        spreadRadius: 50,
        positions: Array.from({ length: 5 }, () => ({
          position: [
            Math.random() * 100 - 50,
            -0.49,
            Math.random() * 100 - 50
          ],
          rotation: [
            -Math.PI / 2,
            0,
            Math.random() * Math.PI
          ],
          scale: 1.0 + Math.random() * 4.0
        }))
      },
      stars: {
        count: 625,
        minSize: 1,
        maxSize: 4,
        sphereRadius: {
          min: 300,
          max: 1000
        },
        positions: Array.from({ length: 625 }, () => {
          const r = 300 + Math.random() * 700;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          
          return {
            position: [
              r * Math.sin(phi) * Math.cos(theta),
              r * Math.sin(phi) * Math.sin(theta),
              r * Math.cos(phi)
            ],
            color: Math.random() > 0.9 
              ? [1, 0.8, 0.4] 
              : [1, 1, 1],
            size: 1 + Math.random() * 3
          };
        })
      }
    },
    celestial: {
      earth: {
        orbitRadius: 150,
        height: 50,
        size: 20,
        orbitSpeed: 0.1,
        rotationSpeed: 0.001,
        initialPosition: [150, 50, 0]
      }
    }
  };

  return schema;
}