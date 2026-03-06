# Game Other (General Game Starter) - Agent Guide

## Architecture

- **App.tsx** — Entry point. Manages game state machine (`start | playing | paused`) and score via `useVar` from `orbitcode`. Conditionally renders `StartScreen` or `GameWorld` + `UI`.
- **GameWorld.tsx** — Canvas-based game world (600x400). Runs a `requestAnimationFrame` loop with a player (circle) that collects yellow dots. Handles WASD/arrow-key input via `keydown`/`keyup` listeners. Calls `onScore` when collectibles are picked up; collectibles respawn after 1 second.
- **UI.tsx** — HUD overlay displaying the current score and a pause/resume button.
- **StartScreen.tsx** — Landing screen with a "Start Game" button and feature list.
- **styles.css** — Global styles (body, layout). Each component also imports its own CSS file.

Data flow: `App` owns state (`gameState`, `score`) via `useVar` and passes callbacks (`onStart`, `onPause`, `onScore`) down to children. `GameWorld` manages its own internal game loop state (player position, collectibles, key presses) inside a `useEffect`.

## Styling

- Separate `.css` files per component: `GameWorld.css`, `UI.css`, `StartScreen.css`, plus `styles.css` for globals.
- Plain CSS class selectors (e.g., `.game-app`, `.ui-score`). Not CSS modules.
- Dark theme with color palette: `#1a1a2e` background, `#4fc3f7` player, `#ffd93d` collectibles.

## Extension Points

- Add new game entities (enemies, power-ups) inside the `GameWorld.tsx` `useEffect` — follow the collectibles pattern: define array, update in loop, draw, check collisions.
- Add new HUD elements (lives, timer, level) by extending the `UI` component props and rendering additional stat blocks.
- Replace the canvas game entirely by swapping `GameWorld.tsx` while keeping the same `{ paused, onScore }` interface.

## Constraints

- All game logic runs inside a single `useEffect` in `GameWorld.tsx`; the effect re-runs when `paused` or `onScore` changes, so avoid unstable callback references.
