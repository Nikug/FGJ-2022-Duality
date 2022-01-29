import { RENDERING_ORDER, TILEMAP } from "../constants";
import type { GameScene } from "../scenes/main";

export const loadLevel = (scene: GameScene) => {
  if (!scene.player) return;

  const map = scene.make.tilemap({
    key: TILEMAP.key,
    tileWidth: TILEMAP.tileSize,
    tileHeight: TILEMAP.tileSize,
  });

  const happyCloud = scene.add.image(370, 0, "clouds");
  const sadCloud = scene.add.image(460, -210, "clouds2");
  happyCloud.setDepth(RENDERING_ORDER.farBackground);
  sadCloud.setDepth(RENDERING_ORDER.farBackground);

  const tileset = map.addTilesetImage(TILEMAP.tilesets.purple.name, TILEMAP.tilesets.purple.key);
  const frontTileset = map.addTilesetImage(TILEMAP.tilesets.yellow.name, TILEMAP.tilesets.yellow.key);
  const backTileset = map.addTilesetImage(TILEMAP.tilesets.gray.name, TILEMAP.tilesets.gray.key);

  const backwallLayer = map.createLayer(TILEMAP.layers.backwall, backTileset);
  const backLayer = map.createLayer(TILEMAP.layers.background, backTileset);
  const worldLayer = map.createLayer(TILEMAP.layers.world, tileset);
  const frontLayer = map.createLayer(TILEMAP.layers.foreground, frontTileset);

  backwallLayer.setDepth(RENDERING_ORDER.farBackground);
  backLayer.setDepth(RENDERING_ORDER.background);
  frontLayer.setDepth(RENDERING_ORDER.foreground);

  worldLayer.setCollisionByProperty({ collision: true });
  scene.physics.add.collider(scene.player.physicSprite, worldLayer);

  return map;
};
