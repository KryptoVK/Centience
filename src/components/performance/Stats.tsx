import { useEffect, useState } from 'react';
import { addEffect } from '@react-three/fiber';

export function Stats() {
  const [fps, setFps] = useState(0);
  const [frameCount, setFrameCount] = useState(0);
  const [lastTime, setLastTime] = useState(performance.now());

  useEffect(() => {
    // Use R3F's addEffect for consistent frame timing
    const unsubscribe = addEffect(() => {
      setFrameCount(count => count + 1);
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        setFps(frameCount);
        setFrameCount(0);
        setLastTime(currentTime);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [frameCount, lastTime]);

  return (
    <div className="fixed top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 font-mono text-sm text-white shadow-lg border border-white/10">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span>{fps} FPS</span>
      </div>
    </div>
  );
}