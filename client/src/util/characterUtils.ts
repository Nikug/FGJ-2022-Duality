import type { PlayerColors, PlayerSpriteObject } from "../../types/types";
import { ANIMATIONS } from "../constants";
import type { GameScene } from "../scenes/main";

export const createAllAnimations = (scene: GameScene) => {
  createAnimations(scene, "blue");
  createAnimations(scene, "green");
};

const createAnimations = (scene: GameScene, color: PlayerColors) => {
  scene.anims.create({
    key: getAnimationKey(ANIMATIONS.state.idle, color),
    frames: scene.anims.generateFrameNumbers(ANIMATIONS.sheets[color], { start: 9, end: 9 }),
    frameRate: ANIMATIONS.frameRate,
    repeat: -1,
  });
  scene.anims.create({
    key: getAnimationKey(ANIMATIONS.state.left, color),
    frames: scene.anims.generateFrameNumbers(ANIMATIONS.sheets[color], { start: 5, end: 6 }),
    frameRate: ANIMATIONS.frameRate,
    repeat: -1,
  });
  scene.anims.create({
    key: getAnimationKey(ANIMATIONS.state.right, color),
    frames: scene.anims.generateFrameNumbers(ANIMATIONS.sheets[color], { start: 7, end: 8 }),
    frameRate: ANIMATIONS.frameRate,
    repeat: -1,
  });

  scene.anims.create({
    key: getAnimationKey(ANIMATIONS.state.air, color),
    frames: scene.anims.generateFrameNumbers(ANIMATIONS.sheets[color], { start: 0, end: 0 }),
    frameRate: ANIMATIONS.frameRate,
    repeat: -1,
  });
  scene.anims.create({
    key: getAnimationKey(ANIMATIONS.state.airLeft, color),
    frames: scene.anims.generateFrameNumbers(ANIMATIONS.sheets[color], { start: 1, end: 2 }),
    frameRate: ANIMATIONS.frameRate,
    repeat: -1,
  });
  scene.anims.create({
    key: getAnimationKey(ANIMATIONS.state.airRight, color),
    frames: scene.anims.generateFrameNumbers(ANIMATIONS.sheets[color], { start: 3, end: 4 }),
    frameRate: ANIMATIONS.frameRate,
    repeat: -1,
  });
};

const getAnimationKey = (state: string, color: PlayerColors) => `${state}-${color}`;

export const animationController = (scene: GameScene) => {
  if (!scene.player) return;
  setAnimation(scene.player, "blue");
  scene.otherPlayers.map((player) => setAnimation(player, "green"));
};

const setAnimation = (player: PlayerSpriteObject, color: PlayerColors) => {
  const onFloor = player.body.onFloor();
  if (player.body.velocity.x > ANIMATIONS.idleThreshold) {
    onFloor
      ? player.anims.play(getAnimationKey(ANIMATIONS.state.right, color), true)
      : player.anims.play(getAnimationKey(ANIMATIONS.state.airRight, color), true);
  } else if (player.body.velocity.x < -ANIMATIONS.idleThreshold) {
    onFloor
      ? player.anims.play(getAnimationKey(ANIMATIONS.state.left, color), true)
      : player.anims.play(getAnimationKey(ANIMATIONS.state.airLeft, color), true);
  } else {
    onFloor ? player.anims.play(getAnimationKey(ANIMATIONS.state.idle, color), true) : player.anims.play(getAnimationKey(ANIMATIONS.state.air, color), true);
  }
};
