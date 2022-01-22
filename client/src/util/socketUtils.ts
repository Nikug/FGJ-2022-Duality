import type { PlayerState } from "../../types/types";
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

const hasStateChanged = (state: PlayerState) => {
  return state.x !== lastState?.x || state.y !== lastState?.y;
};
