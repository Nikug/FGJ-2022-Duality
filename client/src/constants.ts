export const UPDATES_PER_SECOND = 30;
export const UPDATE_INTERVAL = (1 / UPDATES_PER_SECOND) * 1000;

export const MOVEMENT_SPEED = 200;
export const JUMP_VELOCITY = 400;

export const PLAYER_GRAVITY = 500;
export const PLAYER_PUSH_DISTANCE = 100;
export const PLAYER_PUSH_POWER = 400;
export const PUSH_TIMEOUT_DURATION = 300;
export const CAN_PUSH_TIMEOUT_DURATION = 700;
export const CAN_JUMP_DURATION = 100;

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
    resource: "ResourceSpawn",
    player: "PlayerSpawn",
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
  sheets: {
    blue: "playerBlue",
    green: "playerGreen",
  },
  frameRate: 12,
};
