import { getGameState, setGameState } from ".";
import { Socket } from "socket.io";

export const addModifier = (
  socket: Socket,
  newModifier: string,
  modifierDurationSecond: number,
) => {
  let gameState = getGameState();
  gameState.modifiers.push(newModifier);
  setGameState(gameState);

  socket.broadcast.emit("updateState", gameState);

  setTimeout(() => {
    gameState = getGameState();
    gameState.modifiers.filter((modifier) => modifier === newModifier);
    setGameState(gameState);
    socket.broadcast.emit("updateState", gameState);
  }, modifierDurationSecond * 1000);
};
