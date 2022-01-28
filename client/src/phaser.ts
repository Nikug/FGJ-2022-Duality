import { GameScene } from "./scenes/main";
import Phaser from "phaser";
import { MainMenu } from "./scenes/mainmenu";

export const gameConfig: Phaser.Types.Core.GameConfig = {
  title: "FGJ",
  type: Phaser.AUTO,

  scale: {
    width: window.innerWidth - 100,
    height: window.innerHeight - 100,
  },
  pixelArt: true,

  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },

      debug: false,
    },
  },

  parent: "game",
  backgroundColor: "#e3cfe8",
  scene: [MainMenu, GameScene],
};
