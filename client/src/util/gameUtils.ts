import type { PlayerGameObject, ResourceGameObject, PlayerSpriteObject } from "../../types/types";

export const createRectangle = (scene: Phaser.Scene, position: Phaser.Math.Vector2, color: number, id: string): PlayerGameObject => {
  const rectangle = scene.add.rectangle(position.x, position.y, 12, 12, color) as PlayerGameObject;

  scene.physics.add.existing(rectangle);
  rectangle.id = id;
  return rectangle;
};

export const createResource = (scene: Phaser.Scene, position: Phaser.Math.Vector2, color: number, id: string): ResourceGameObject => {
  const rectangle = scene.add.rectangle(position.x, position.y, 12, 12, color) as ResourceGameObject;

  rectangle.id = id;
  return rectangle;
};

export const createPlayer = (scene: Phaser.Scene, position: Phaser.Math.Vector2, key: string, id: string) => {
  const player = scene.physics.add.sprite(position.x, position.y, key) as PlayerSpriteObject;
  player.id = id;

  return player;
};
