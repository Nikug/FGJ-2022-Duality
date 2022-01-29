import type { Socket } from "socket.io-client";
import { socket } from "..";
import type { GameState, PlayerState } from "../../types/types";
import { UPDATE_INTERVAL } from "../constants";

let lastState: PlayerState | undefined = undefined;

export const throttleUpdate = async (state: PlayerState) => {
  if (!lastState?.lastUpdate) {
    updatePlayer(state);
    return;
  }

  const durationFromLastState = Date.now() - lastState.lastUpdate;
  if (durationFromLastState > UPDATE_INTERVAL && hasStateChanged(state)) {
    updatePlayer(state);
  }
};

const updatePlayer = (state: PlayerState) => {
  state.socket?.emit("move", { x: state.x, y: state.y });
  lastState = { ...state, lastUpdate: Date.now() };
};

export const pushPlayer = (id: string, direction: Phaser.Math.Vector2, socket?: Socket) => {
  socket?.emit("push", { id, direction });
};

const hasStateChanged = (state: PlayerState) => {
  return state.x !== lastState?.x || state.y !== lastState?.y;
};

export const addModifier = (modifier: string, duration: number, socket: Socket) => {
  socket?.emit("addModifier", modifier, duration);
};

export const playerCount = () => {
  socket.emit("getPlayerCount");
};

export const startGame = () => {
  socket.emit("startGame");
};
