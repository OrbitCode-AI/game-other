import './StartScreen.css';

interface StartScreenProps {
  onStart: () => void;
}

function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="start-screen">
      <div className="start-content">
        <span className="start-icon">🎮</span>
        <h1 className="start-title">Game Starter</h1>
        <p className="start-subtitle">A template for building your own game</p>
        <button className="start-button" onClick={onStart}>
          Start Game
        </button>
        <div className="start-features">
          <h4>Included:</h4>
          <ul>
            <li>Canvas-based game loop</li>
            <li>Keyboard input handling</li>
            <li>Pause/resume functionality</li>
            <li>Score tracking with useVar</li>
            <li>Modular component structure</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Default export renders component in isolation for preview
export default function StartScreenPreview() {
  return <StartScreen onStart={() => alert('Game starting!')} />;
}

export { StartScreen };
