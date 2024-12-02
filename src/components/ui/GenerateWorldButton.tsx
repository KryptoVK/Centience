import { useWorldGeneration } from '../../services/worldGeneration/WorldGenerationContext';
import { useSocket } from '../../services/multiplayer/SocketContext';

export function GenerateWorldButton() {
  const { generateNewWorld } = useWorldGeneration();
  const { updateWorldSchema } = useSocket();

  const handleGenerateWorld = () => {
    const newSchema = generateNewWorld();
    updateWorldSchema(newSchema);
  };

  return (
    <button
      onClick={handleGenerateWorld}
      className="fixed bottom-4 right-4 bg-white/80 hover:bg-white/90 px-4 py-2 rounded-lg shadow-lg font-semibold transition-colors"
    >
      Generate World
    </button>
  );
}