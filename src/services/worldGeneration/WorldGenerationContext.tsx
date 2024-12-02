import { createContext, useContext, useState, ReactNode } from 'react';
import { WorldSchema } from './types';
import { generateWorldSchema } from './generator';

interface WorldGenerationContextType {
  worldSchema: WorldSchema | null;
  generateNewWorld: () => WorldSchema;
}

const WorldGenerationContext = createContext<WorldGenerationContextType | null>(null);

export function WorldGenerationProvider({ children }: { children: ReactNode }) {
  const [worldSchema, setWorldSchema] = useState<WorldSchema | null>(null);

  const generateNewWorld = () => {
    const newSchema = generateWorldSchema();
    setWorldSchema(newSchema);
    return newSchema;
  };

  return (
    <WorldGenerationContext.Provider value={{ worldSchema, generateNewWorld }}>
      {children}
    </WorldGenerationContext.Provider>
  );
}

export function useWorldGeneration() {
  const context = useContext(WorldGenerationContext);
  if (!context) {
    throw new Error('useWorldGeneration must be used within a WorldGenerationProvider');
  }
  return context;
}