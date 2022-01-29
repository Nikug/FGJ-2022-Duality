import type { PlayerGameObject, ResourceGameObject } from "../../types/types";

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
