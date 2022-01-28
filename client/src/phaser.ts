import { GameScene } from "./scenes/main";
import Phaser from "phaser";
import { MainMenu } from "./scenes/mainmenu";

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
  scene: [MainMenu, GameScene],
};
