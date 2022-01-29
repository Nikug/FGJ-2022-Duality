import { getGameState, setGameState } from ".";
import { io } from "../..";

export const addModifier = (
  newModifier: string,
  modifierDurationSecond: number,
) => {
  let gameState = getGameState();

  if (!gameState.modifiers.includes(newModifier)) {
    gameState.modifiers.push(newModifier);
    setGameState(gameState);
    io.emit("updateState", gameState);

    setTimeout(() => {
      gameState = getGameState();

      gameState.modifiers = gameState.modifiers.filter(
        (modifier) => modifier !== newModifier,
      );

      setGameState(gameState);
      io.emit("updateState", gameState);
    }, modifierDurationSecond * 1000);
  }
};
