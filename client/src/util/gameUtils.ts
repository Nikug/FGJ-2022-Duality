import type { Game } from "../../types/types";

export const addPlayer = (scene: Phaser.Scene, player: Game.PlayerState) => {
  const square = scene.add.rectangle(player.x, player.y, 100, 100, 0x00ffff);

  if (square) {
    scene.physics.add.existing(square);
  }
};
