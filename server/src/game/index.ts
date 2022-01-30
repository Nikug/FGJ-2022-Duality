import { io } from "../..";
import { GameState, Modifier, ModifierTypes, Player } from "../../types/types";
import { UPDATE_INTERVAL, UPDATE_MODIFIERS } from "../constants";
import { playersToUpdate } from "../game/player";
import { flipCoin } from "../utils/getRandomNumber";
import {
  fillEmptyResourceLocations,
  getResourceLocations,
  getResources,
} from "./resource";

let globalPlayers: Player[] = [];

const getMod = (type: string) => {};

export const getPlayers = () => [...globalPlayers];
export const setPlayers = (newPlayers: Player[]) =>
  (globalPlayers = newPlayers);

let globalGameState: GameState = {
  running: false,
  modifiers: [],
  score: { coconut: 0, ananas: 0 },
  round: 0,
};
export const getGameState = () => globalGameState;
export const setGameState = (newGameState: GameState) =>
  (globalGameState = newGameState);

export const createDefaultMod = (type: ModifierTypes): Modifier => {
  return {
    type: type,
    team: flipCoin() ? "coconut" : "ananas",
    duration: UPDATE_MODIFIERS,
  };
};

export const startGameLoop = async () => {
  console.log("Started game loop!");

  setInterval(() => {
    const state = getGameState();
    if (state.round === 0) {
      state.modifiers = [];
    } else if (state.round === 1) {
      state.modifiers = [createDefaultMod("gravity")];
    } else if (state.round === 2) {
      state.modifiers = [];
    } else if (state.round === 3) {
      state.modifiers = [createDefaultMod("bigsmall")];
    } else if (state.round === 4) {
      state.modifiers = [];
    } else if (state.round === 5) {
      state.modifiers = [createDefaultMod("hunt")];
    } else if (state.round === 6) {
      state.modifiers = [];
    } else if (state.round === 7) {
      state.modifiers = [
        createDefaultMod("bigsmall"),
        createDefaultMod("gravity"),
      ];
    }
    state.round++;
    io.emit("updateModifiers", state.modifiers);
    if (getResources().length < getResourceLocations().length / 2) {
      fillEmptyResourceLocations();
    }
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
