import { RENDERING_ORDER, TILEMAP } from "../constants";
import type { GameScene } from "../scenes/main";
import { setCloudTargets } from "./gameUtils";

export const loadLevel = (scene: GameScene) => {
  const map = scene.make.tilemap({
    key: TILEMAP.key,
    tileWidth: TILEMAP.tileSize,
    tileHeight: TILEMAP.tileSize,
  });

  const happyCloud = scene.physics.add.image(370, 0, "clouds");
  const sadCloud = scene.physics.add.image(460, -210, "clouds2");
  happyCloud.setDepth(RENDERING_ORDER.farBackground);
  sadCloud.setDepth(RENDERING_ORDER.farBackground);
  scene.clouds.push(happyCloud, sadCloud);
  setCloudTargets(scene);
  setInterval(() => {
    setCloudTargets(scene);
  }, 10000);

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

  return { map, worldLayer };
};
