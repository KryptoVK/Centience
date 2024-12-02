import React from 'react';

export function Crosshair() {
  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
      <div className="relative w-6 h-6">
        {/* Crosshair lines */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/50"></div>
        <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white/50"></div>
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-1 h-1 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full"></div>
      </div>
    </div>
  );
}