import { ANIMATIONS } from "../constants";
import type { GameScene } from "../scenes/main";

export const createAnimations = (scene: GameScene) => {
  scene.anims.create({
    key: ANIMATIONS.state.idle,
    frames: scene.anims.generateFrameNumbers(ANIMATIONS.sheets.blue, { start: 9 }),
    frameRate: 10,
    repeat: -1,
  });
  scene.anims.create({
    key: ANIMATIONS.state.left,
    frames: scene.anims.generateFrameNumbers(ANIMATIONS.sheets.blue, { start: 5, end: 6 }),
    frameRate: 10,
    repeat: -1,
  });
  scene.anims.create({
    key: ANIMATIONS.state.right,
    frames: scene.anims.generateFrameNumbers(ANIMATIONS.sheets.blue, { start: 7, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: ANIMATIONS.state.air,
    frames: scene.anims.generateFrameNumbers(ANIMATIONS.sheets.blue, { start: 0 }),
    frameRate: 10,
    repeat: -1,
  });
  scene.anims.create({
    key: ANIMATIONS.state.airLeft,
    frames: scene.anims.generateFrameNumbers(ANIMATIONS.sheets.blue, { start: 1, end: 2 }),
    frameRate: 10,
    repeat: -1,
  });
  scene.anims.create({
    key: ANIMATIONS.state.airRight,
    frames: scene.anims.generateFrameNumbers(ANIMATIONS.sheets.blue, { start: 3, end: 4 }),
    frameRate: 10,
    repeat: -1,
  });
};
