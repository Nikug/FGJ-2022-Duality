import { RENDERING_ORDER } from "../constants";
import type { GameScene } from "../scenes/main";

export const loadLevel = (scene: GameScene) => {
  if (!scene.player) return;

  const map = scene.make.tilemap({
    key: "map",
    tileWidth: 16,
    tileHeight: 16,
  });

  const tileset = map.addTilesetImage("Project Mute Tileset V3", "tiles");
  const frontTileset = map.addTilesetImage(
    "Project Mute Tileset V1",
    "frontTiles",
  );
  const backTileset = map.addTilesetImage(
    "Project Mute Tileset V2",
    "backTiles",
  );
  const backwallLayer = map.createLayer("Backwall", backTileset);
  const backLayer = map.createLayer("Background", backTileset);
  const worldLayer = map.createLayer("World", tileset);
  const frontLayer = map.createLayer("Foreground", frontTileset);

  backwallLayer.setDepth(RENDERING_ORDER.farBackground);
  backLayer.setDepth(RENDERING_ORDER.background);
  frontLayer.setDepth(RENDERING_ORDER.foreground);

  worldLayer.setCollisionByProperty({ collision: true });
  scene.physics.add.collider(scene.player, worldLayer);
};
