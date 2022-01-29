import { io } from "../..";
import { GameState, Player } from "../../types/types";
import { UPDATE_INTERVAL, UPDATE_MODIFIERS } from "../constants";
import { playersToUpdate } from "../game/player";
import { flipCoin } from "../utils/getRandomNumber";

let globalPlayers: Player[] = [];

export const getPlayers = () => [...globalPlayers];
export const setPlayers = (newPlayers: Player[]) =>
  (globalPlayers = newPlayers);

let globalGameState: GameState = { modifiers: [] };
export const getGameState = () => globalGameState;
export const setGameState = (newGameState: GameState) =>
  (globalGameState = newGameState);

export const startGameLoop = async () => {
  console.log("Started game loop!");

  setInterval(() => {
    const state = getGameState();
    if (state.modifiers.length) {
      state.modifiers = [];
    } else {
      state.modifiers = [
        {
          type: "gravity",
          team: flipCoin() ? "coconut" : "ananas",
          duration: UPDATE_MODIFIERS,
        },
      ];
    }

    io.emit("updateModifiers", state.modifiers);
    console.log("current modifiers", state.modifiers);
    setGameState(state);
  }, UPDATE_MODIFIERS);

  for (;;) {
    const players = getPlayers();
    const update = playersToUpdate(players);
    players.map((player) => player.socket.emit("update", update));
    await new Promise((resolve) => setTimeout(resolve, UPDATE_INTERVAL));
  }
};

export const getPlayerById = (id: string) =>
  globalPlayers.find((player) => player.socket.id === id);
