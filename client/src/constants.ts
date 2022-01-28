export const UPDATES_PER_SECOND = 30;
export const UPDATE_INTERVAL = (1 / UPDATES_PER_SECOND) * 1000;

export const MOVEMENT_SPEED = 200;
export const JUMP_VELOCITY = 400;

export const PLAYER_GRAVITY = 500;
export const PLAYER_PUSH_DISTANCE = 100;
export const PLAYER_PUSH_POWER = 400;
export const PUSH_TIMEOUT_DURATION = 300;
export const CAN_PUSH_TIMEOUT_DURATION = 700;

export const ONLINE_SPEED_SCALE = 10;

export const RENDERING_ORDER = {
  farBackground: -200,
  background: -200,
  player: 0,
  foreground: 100,
};
