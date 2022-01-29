import { ANIMATIONS } from "../constants";
import type { GameScene } from "../scenes/main";

export const createAnimations = (scene: GameScene) => {
  scene.anims.create({
    key: ANIMATIONS.state.idle,
    frames: scene.anims.generateFrameNumbers(ANIMATIONS.sheets.blue, { start: 9, end: 9 }),
    frameRate: ANIMATIONS.frameRate,
    repeat: -1,
  });
  scene.anims.create({
    key: ANIMATIONS.state.left,
    frames: scene.anims.generateFrameNumbers(ANIMATIONS.sheets.blue, { start: 5, end: 6 }),
    frameRate: ANIMATIONS.frameRate,
    repeat: -1,
  });
  scene.anims.create({
    key: ANIMATIONS.state.right,
    frames: scene.anims.generateFrameNumbers(ANIMATIONS.sheets.blue, { start: 7, end: 8 }),
    frameRate: ANIMATIONS.frameRate,
    repeat: -1,
  });

  scene.anims.create({
    key: ANIMATIONS.state.air,
    frames: scene.anims.generateFrameNumbers(ANIMATIONS.sheets.blue, { start: 0, end: 0 }),
    frameRate: ANIMATIONS.frameRate,
    repeat: -1,
  });
  scene.anims.create({
    key: ANIMATIONS.state.airLeft,
    frames: scene.anims.generateFrameNumbers(ANIMATIONS.sheets.blue, { start: 1, end: 2 }),
    frameRate: ANIMATIONS.frameRate,
    repeat: -1,
  });
  scene.anims.create({
    key: ANIMATIONS.state.airRight,
    frames: scene.anims.generateFrameNumbers(ANIMATIONS.sheets.blue, { start: 3, end: 4 }),
    frameRate: ANIMATIONS.frameRate,
    repeat: -1,
  });
};

export const animationController = (scene: GameScene) => {
  if (!scene.player) return;
  const onFloor = scene.player.body.onFloor();
  if (scene.player.body.velocity.x === 0) {
    onFloor ? scene.player.anims.play(ANIMATIONS.state.idle, true) : scene.player.anims.play(ANIMATIONS.state.air, true);
  } else if (scene.player.body.velocity.x > 0) {
    onFloor ? scene.player.anims.play(ANIMATIONS.state.right, true) : scene.player.anims.play(ANIMATIONS.state.airRight, true);
  } else {
    onFloor ? scene.player.anims.play(ANIMATIONS.state.left, true) : scene.player.anims.play(ANIMATIONS.state.airLeft, true);
  }
};
