export interface WorldSchema {
  environment: {
    rocks: {
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
    craters: {
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
    stars: {
      count: number;
      minSize: number;
      maxSize: number;
      sphereRadius: {
        min: number;
        max: number;
      };
      positions: Array<{
        position: [number, number, number];
        color: [number, number, number];
        size: number;
      }>;
    };
  };
  celestial: {
    earth: {
      orbitRadius: number;
      height: number;
      size: number;
      orbitSpeed: number;
      rotationSpeed: number;
      initialPosition: [number, number, number];
    };
  };
}