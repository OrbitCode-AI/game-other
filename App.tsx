import { useVar } from 'orbitcode';
import { GameWorld } from './GameWorld';
import { UI } from './UI';
import { StartScreen } from './StartScreen';
import './styles.css';

export default function App() {
  const [gameState, setGameState] = useVar<'start' | 'playing' | 'paused'>('gameOtherState', 'start');
  const [score, setScore] = useVar('gameOtherScore', 0);

  const handleStart = () => {
    setScore(0);
    setGameState('playing');
  };

  const handlePause = () => {
    setGameState((s) => (s === 'playing' ? 'paused' : 'playing'));
  };

  const handleScore = (points: number) => {
    setScore((s) => s + points);
  };

  return (
    <div className="game-app">
      {gameState === 'start' && <StartScreen onStart={handleStart} />}
      {(gameState === 'playing' || gameState === 'paused') && (
        <>
          <GameWorld paused={gameState === 'paused'} onScore={handleScore} />
          <UI score={score} paused={gameState === 'paused'} onPause={handlePause} />
        </>
      )}
    </div>
  );
}
