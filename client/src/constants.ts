import type { PlayerSizes } from "../types/types";

export const UPDATES_PER_SECOND = 30;
export const UPDATE_INTERVAL = (1 / UPDATES_PER_SECOND) * 1000;

export const MOVEMENT_SPEED = 200;
export const JUMP_VELOCITY = 400;

export const PLAYER_GRAVITY = 800;
export const PLAYER_PUSH_DISTANCE = 32;
export const PLAYER_PUSH_POWER = 400;
export const PUSH_TIMEOUT_DURATION = 300;
export const CAN_PUSH_TIMEOUT_DURATION = 700;
export const CAN_JUMP_DURATION = 100;
export const CAN_DASH_DURATION = 100;
export const DASH_CANT_MOVE_DURATION = 100;
export const DASH_TIMEOUT_DURATION = 900;
export const DASH_VELOCITY = 900;

export const PLAYER_SIZES: PlayerSizes = {
  normal: {
    movementSpeed: 200,
    sizeScale: 1,
    pushDistance: 32,
    pushTimeout: 300,
    canPushTimeout: 700,
    canDashDuration: 100,
    canJumpDuration: 100,
    dashVelocity: 900,
    pushPower: 400,
    dashCantMoveDuration: 100,
    jumpVelocity: 400,
    dashTimeout: 900,
  },
  big: {
    movementSpeed: 100,
    sizeScale: 2,
    pushDistance: 64,
    pushTimeout: 300,
    canPushTimeout: 700,
    canDashDuration: 200,
    canJumpDuration: 100,
    dashVelocity: 500,
    pushPower: 900,
    dashCantMoveDuration: 100,
    jumpVelocity: 400,
    dashTimeout: 1300,
  },
  small: {
    movementSpeed: 300,
    sizeScale: 0.5,
    pushDistance: 16,
    pushTimeout: 300,
    canPushTimeout: 700,
    canDashDuration: 100,
    canJumpDuration: 100,
    dashVelocity: 900,
    pushPower: 200,
    dashCantMoveDuration: 100,
    jumpVelocity: 300,
    dashTimeout: 700,
  },
};

export const ONLINE_SPEED_SCALE = 10;

export const RENDERING_ORDER = {
  farBackground: -200,
  background: -200,
  player: 0,
  foreground: 100,
};

export const TILEMAP = {
  key: "map",
  tileSize: 16,
  layers: {
    backwall: "Backwall",
    background: "Background",
    world: "World",
    foreground: "Foreground",
  },
  tilesets: {
    purple: { key: "tiles", name: "Project Mute Tileset V3" },
    yellow: { key: "frontTiles", name: "Project Mute Tileset V1" },
    gray: { key: "backTiles", name: "Project Mute Tileset V2" },
  },
  spawns: {
    resource: "ResourceSpawns",
    player: "PlayerSpawns",
  },
};

export const ANIMATIONS = {
  state: {
    left: "left",
    right: "right",
    idle: "idle,",
    airLeft: "airLeft",
    airRight: "airRight",
    air: "air,",
  },
  slap: "slap",
  sheets: {
    ananas: "playerBlue",
    coconut: "playerGreen",
    slaps: {
      coconut: "playerBlueSlap",
      ananas: "playerGreenSlap",
    },
    resources: {
      basic: "resourceBasic",
    },
  },
  frameRate: 12,
  idleThreshold: 1,
};
