import type * as Game from "../../types/types";
import { UPDATE_INTERVAL } from "../constants";

let lastState: Game.PlayerState | undefined = undefined;

export const throttleUpdate = async (state: Game.PlayerState) => {
  if (!lastState?.lastUpdate) {
    updatePlayer(state);
    return;
  }

  const durationFromLastState = Date.now() - lastState.lastUpdate;
  if (durationFromLastState > UPDATE_INTERVAL && hasStateChanged(state)) {
    updatePlayer(state);
  }
};

const updatePlayer = (state: Game.PlayerState) => {
  state.socket?.emit("move", { x: state.x, y: state.y });
  lastState = { ...state, lastUpdate: Date.now() };
};

const hasStateChanged = (state: Game.PlayerState) => {
  return state.x !== lastState?.x || state.y !== lastState?.y;
};
