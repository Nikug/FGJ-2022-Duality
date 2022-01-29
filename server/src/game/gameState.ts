import { getGameState, setGameState } from ".";

export const setRunning = () => {
  const gameState = getGameState();

  if (!gameState.running) {
    gameState.running = true;
    setGameState(gameState);
  }
};

export const setNotRunning = () => {
  const gameState = getGameState();

  if (gameState.running) {
    gameState.running = false;
    setGameState(gameState);
  }
};
