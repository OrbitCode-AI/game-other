import './UI.css';

interface UIProps {
  score: number;
  paused: boolean;
  onPause: () => void;
}

function UI({ score, paused, onPause }: UIProps) {
  return (
    <div className="ui">
      <div className="ui-score">
        <span className="ui-label">Score</span>
        <span className="ui-value">{score}</span>
      </div>
      <button className="ui-pause" onClick={onPause}>
        {paused ? '▶ Resume' : '⏸ Pause'}
      </button>
    </div>
  );
}

// Default export renders component in isolation for preview
export default function UIPreview() {
  return (
    <div className="preview-container">
      <UI score={150} paused={false} onPause={() => alert('Toggle pause')} />
    </div>
  );
}

export { UI };
