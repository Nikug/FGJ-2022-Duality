import type { PlayerColors, PlayerSpriteObject, Team } from "../../types/types";
import type { PlayerObject } from "../classes/Player";
import { ANIMATIONS } from "../constants";
import type { GameScene } from "../scenes/main";

export const createAllAnimations = (scene: GameScene) => {
  createAnimations(scene, "blue");
  createAnimations(scene, "green");

  scene.anims.create({
    key: ANIMATIONS.sheets.resources.basic,
    frames: scene.anims.generateFrameNumbers(ANIMATIONS.sheets.resources.basic, { start: 1, end: 1 }),
    frameRate: ANIMATIONS.frameRate,
    repeat: -1,
  });
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
export const getSheet = (team: Team) => (team === "coconut" ? ANIMATIONS.sheets.blue : ANIMATIONS.sheets.green);
const getColor = (team: Team) => (team === "coconut" ? "blue" : "green");

export const animationController = (scene: GameScene) => {
  if (!scene.player) return;
  setPlayerAnimation(scene.player);
  scene.otherPlayers.map((player) => setOtherPlayerAnimation(player));
};
const setOtherPlayerAnimation = (player: PlayerSpriteObject) => {
  const color = getColor(player.team);
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

const setPlayerAnimation = (player: PlayerObject) => {
  const color = getColor(player.team);
  const onFloor = player.physicSprite.body.onFloor();
  if (player.physicSprite.body.velocity.x > ANIMATIONS.idleThreshold) {
    onFloor
      ? player.physicSprite.anims.play(getAnimationKey(ANIMATIONS.state.right, color), true)
      : player.physicSprite.anims.play(getAnimationKey(ANIMATIONS.state.airRight, color), true);
  } else if (player.physicSprite.body.velocity.x < -ANIMATIONS.idleThreshold) {
    onFloor
      ? player.physicSprite.anims.play(getAnimationKey(ANIMATIONS.state.left, color), true)
      : player.physicSprite.anims.play(getAnimationKey(ANIMATIONS.state.airLeft, color), true);
  } else {
    onFloor
      ? player.physicSprite.anims.play(getAnimationKey(ANIMATIONS.state.idle, color), true)
      : player.physicSprite.anims.play(getAnimationKey(ANIMATIONS.state.air, color), true);
  }
};
