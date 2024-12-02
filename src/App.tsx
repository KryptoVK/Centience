import React from 'react';
import { Scene } from './components/Scene';
import { KeyboardControls } from './components/KeyboardControls';
import { Stats } from './components/performance/Stats';
import { GenerateWorldButton } from './components/ui/GenerateWorldButton';
import { WorldGenerationProvider } from './services/worldGeneration/WorldGenerationContext';
import { SocketProvider } from './services/multiplayer/SocketContext';

function App() {
  return (
    <SocketProvider>
      <WorldGenerationProvider>
        <div className="w-full h-screen">
          <KeyboardControls>
            <Scene />
          </KeyboardControls>
          <Stats />
          <div className="fixed bottom-4 left-4 bg-white/80 p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-2">Controls</h2>
            <ul className="space-y-1">
              <li>W - Move Forward</li>
              <li>S - Move Backward</li>
              <li>A - Move Left</li>
              <li>D - Move Right</li>
              <li>Mouse - Look around</li>
            </ul>
          </div>
          <GenerateWorldButton />
        </div>
      </WorldGenerationProvider>
    </SocketProvider>
  );
}

export default App;