import type { Game } from "../../types/types";

const UPDATES_PER_SECOND = 30;
const UPDATE_INTERVAL = (1 / UPDATES_PER_SECOND) * 1000;

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
