import { GameScene } from "./scenes/main";
import Phaser from "phaser";
import { MainMenu } from "./scenes/mainmenu";
import { UIScene } from "./scenes/uiScene";

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
      debug: false,
    },
  },

  parent: "game",
  backgroundColor: "#e3cfe8",
  scene: [MainMenu, GameScene, UIScene],
};
