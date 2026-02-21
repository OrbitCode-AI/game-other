import { useEffect, useRef } from 'preact/hooks';
import './GameWorld.css';

interface GameWorldProps {
  paused: boolean;
  onScore: (points: number) => void;
}

function GameWorld({ paused, onScore }: GameWorldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    canvas.width = 600;
    canvas.height = 400;
    const W = canvas.width;
    const H = canvas.height;

    // Game state
    const player = { x: W / 2, y: H / 2, size: 30 };
    const collectibles: { x: number; y: number; collected: boolean }[] = [];
    const keys = { up: false, down: false, left: false, right: false };

    // Spawn initial collectibles
    for (let i = 0; i < 5; i++) {
      collectibles.push({
        x: 50 + Math.random() * (W - 100),
        y: 50 + Math.random() * (H - 100),
        collected: false,
      });
    }

    let animationId: number;
    let running = true;

    const update = () => {
      if (paused) return;

      // Player movement
      const speed = 4;
      if (keys.up) player.y -= speed;
      if (keys.down) player.y += speed;
      if (keys.left) player.x -= speed;
      if (keys.right) player.x += speed;

      // Bounds
      player.x = Math.max(player.size / 2, Math.min(W - player.size / 2, player.x));
      player.y = Math.max(player.size / 2, Math.min(H - player.size / 2, player.y));

      // Collectibles
      for (const c of collectibles) {
        if (c.collected) continue;
        const dist = Math.hypot(c.x - player.x, c.y - player.y);
        if (dist < player.size / 2 + 10) {
          c.collected = true;
          onScore(10);

          // Respawn
          setTimeout(() => {
            c.x = 50 + Math.random() * (W - 100);
            c.y = 50 + Math.random() * (H - 100);
            c.collected = false;
          }, 1000);
        }
      }
    };

    const draw = () => {
      // Clear
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Collectibles
      ctx.fillStyle = '#ffd93d';
      for (const c of collectibles) {
        if (c.collected) continue;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      // Player
      ctx.fillStyle = '#4fc3f7';
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.size / 2, 0, Math.PI * 2);
      ctx.fill();

      // Player eye (indicates direction)
      ctx.fillStyle = '#1a1a2e';
      ctx.beginPath();
      ctx.arc(player.x + 5, player.y - 3, 5, 0, Math.PI * 2);
      ctx.fill();

      // Pause overlay
      if (paused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 32px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', W / 2, H / 2);
      }
    };

    const gameLoop = () => {
      if (!running) return;
      update();
      draw();
      animationId = requestAnimationFrame(gameLoop);
    };
    gameLoop();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.up = true;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') keys.down = true;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.up = false;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') keys.down = false;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      running = false;
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [paused, onScore]);

  return <canvas ref={canvasRef} className="game-world" />;
}

// Default export renders component in isolation for preview
export default function GameWorldPreview() {
  return (
    <div className="preview-container">
      <GameWorld paused={false} onScore={(p) => console.log('Score:', p)} />
      <p className="preview-hint">Use arrow keys or WASD to move. Collect the yellow dots!</p>
    </div>
  );
}

export { GameWorld };
