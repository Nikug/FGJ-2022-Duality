import { RENDERING_ORDER, TILEMAP } from "../constants";
import type { GameScene } from "../scenes/main";

export const loadLevel = (scene: GameScene) => {
  if (!scene.player) return;

  const map = scene.make.tilemap({
    key: TILEMAP.key,
    tileWidth: TILEMAP.tileSize,
    tileHeight: TILEMAP.tileSize,
  });

  const tileset = map.addTilesetImage(
    TILEMAP.tilesets.purple.key,
    TILEMAP.tilesets.purple.name,
  );
  const frontTileset = map.addTilesetImage(
    TILEMAP.tilesets.yellow.key,
    TILEMAP.tilesets.yellow.name,
  );
  const backTileset = map.addTilesetImage(
    TILEMAP.tilesets.gray.key,
    TILEMAP.tilesets.gray.name,
  );
  const backwallLayer = map.createLayer(TILEMAP.layers.backwall, backTileset);
  const backLayer = map.createLayer(TILEMAP.layers.background, backTileset);
  const worldLayer = map.createLayer(TILEMAP.layers.world, tileset);
  const frontLayer = map.createLayer(TILEMAP.layers.foreground, frontTileset);

  backwallLayer.setDepth(RENDERING_ORDER.farBackground);
  backLayer.setDepth(RENDERING_ORDER.background);
  frontLayer.setDepth(RENDERING_ORDER.foreground);

  worldLayer.setCollisionByProperty({ collision: true });
  scene.physics.add.collider(scene.player, worldLayer);

  return map;
};
