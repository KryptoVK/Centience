export const sceneConfig = {
  environment: {
    rocks: {
      count: 10,
      minScale: 0.3,
      maxScale: 1.0,
      spreadRadius: 50,
    },
    craters: {
      count: 5,
      minScale: 1.0,
      maxScale: 5.0,
      spreadRadius: 50,
    },
    stars: {
      count: 2500, // Reduced from 10000 to 2500 stars
      minSize: 1,
      maxSize: 4,
      sphereRadius: {
        min: 300,
        max: 1000,
      },
    },
  },
  earth: {
    orbitRadius: 150,
    height: 50,
    size: 20,
    orbitSpeed: 0.1,
    rotationSpeed: 0.001,
  },
};