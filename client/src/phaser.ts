import { GameScene } from "./scenes/main";
import Phaser from "phaser";

export const gameConfig: Phaser.Types.Core.GameConfig = {
  title: "FGJ",
  type: Phaser.AUTO,

  scale: {
    width: window.innerWidth,
    height: window.innerHeight,
  },

  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },

  parent: "game",
  backgroundColor: "#000000",
  scene: GameScene,
};
