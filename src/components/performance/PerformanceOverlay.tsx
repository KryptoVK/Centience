import { useEffect, useState } from 'react';

export function PerformanceOverlay() {
  const [fps, setFps] = useState(0);
  const [frameCount, setFrameCount] = useState(0);
  const [lastTime, setLastTime] = useState(performance.now());

  useEffect(() => {
    let animationFrameId: number;

    const updateFPS = () => {
      setFrameCount(count => count + 1);
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        setFps(frameCount);
        setFrameCount(0);
        setLastTime(currentTime);
      }

      animationFrameId = requestAnimationFrame(updateFPS);
    };

    animationFrameId = requestAnimationFrame(updateFPS);

    return () => {
      cancelAnimationFrame(animationFrameId);
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