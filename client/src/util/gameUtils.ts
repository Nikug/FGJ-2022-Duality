import type * as Game from "../../types/types";

export const createRectangle = (
  scene: Phaser.Scene,
  position: Phaser.Math.Vector2,
  color: number,
  id: string,
): Game.PlayerGameObject => {
  const rectangle = scene.add.rectangle(
    position.x,
    position.y,
    50,
    50,
    color,
  ) as Game.PlayerGameObject;

  scene.physics.add.existing(rectangle);
  rectangle.id = id;
  return rectangle;
};
