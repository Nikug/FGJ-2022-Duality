import { GameScene } from "./scenes/main";
import Phaser from "phaser";

export const gameConfig: Phaser.Types.Core.GameConfig = {
  title: "FGJ",
  type: Phaser.AUTO,

  scale: {
    width: window.innerWidth - 100,
    height: window.innerHeight - 100,
  },

  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },

  parent: "game",
  backgroundColor: "#e3cfe8",
  scene: GameScene,
};
