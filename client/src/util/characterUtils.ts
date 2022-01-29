import type { PlayerSpriteObject, Team } from "../../types/types";
import type { PlayerObject } from "../classes/Player";
import { ANIMATIONS } from "../constants";
import type { GameScene } from "../scenes/main";

export const createAllAnimations = (scene: GameScene) => {
  createAnimations(scene, "ananas");
  createAnimations(scene, "coconut");

  scene.anims.create({
    key: ANIMATIONS.sheets.resources.basic,
    frames: scene.anims.generateFrameNumbers(ANIMATIONS.sheets.resources.basic, { start: 0, end: 19 }),
    frameRate: ANIMATIONS.frameRate,
    repeat: -1,
  });
};

const createAnimations = (scene: GameScene, team: Team) => {
  scene.anims.create({
    key: getAnimationKey(ANIMATIONS.state.idle, team),
    frames: scene.anims.generateFrameNumbers(ANIMATIONS.sheets[team], { start: 9, end: 9 }),
    frameRate: ANIMATIONS.frameRate,
    repeat: -1,
  });
  scene.anims.create({
    key: getAnimationKey(ANIMATIONS.state.left, team),
    frames: scene.anims.generateFrameNumbers(ANIMATIONS.sheets[team], { start: 5, end: 6 }),
    frameRate: ANIMATIONS.frameRate,
    repeat: -1,
  });
  scene.anims.create({
    key: getAnimationKey(ANIMATIONS.state.right, team),
    frames: scene.anims.generateFrameNumbers(ANIMATIONS.sheets[team], { start: 7, end: 8 }),
    frameRate: ANIMATIONS.frameRate,
    repeat: -1,
  });

  scene.anims.create({
    key: getAnimationKey(ANIMATIONS.state.air, team),
    frames: scene.anims.generateFrameNumbers(ANIMATIONS.sheets[team], { start: 0, end: 0 }),
    frameRate: ANIMATIONS.frameRate,
    repeat: -1,
  });
  scene.anims.create({
    key: getAnimationKey(ANIMATIONS.state.airLeft, team),
    frames: scene.anims.generateFrameNumbers(ANIMATIONS.sheets[team], { start: 1, end: 2 }),
    frameRate: ANIMATIONS.frameRate,
    repeat: -1,
  });
  scene.anims.create({
    key: getAnimationKey(ANIMATIONS.state.airRight, team),
    frames: scene.anims.generateFrameNumbers(ANIMATIONS.sheets[team], { start: 3, end: 4 }),
    frameRate: ANIMATIONS.frameRate,
    repeat: -1,
  });
  scene.anims.create({
    key: getAnimationKey(ANIMATIONS.slap, team),
    frames: scene.anims.generateFrameNumbers(ANIMATIONS.sheets.slaps[team], { start: 8, end: 0 }),
    frameRate: ANIMATIONS.frameRate * 3,
    repeat: 0,
  });
};

export const getAnimationKey = (state: string, team: Team) => `${state}-${team}`;
export const getSheet = (team: Team) => ANIMATIONS.sheets[team];
export const getSlapSheet = (team: Team) => ANIMATIONS.sheets.slaps[team];

export const animationController = (scene: GameScene) => {
  if (!scene.player) return;
  setPlayerAnimation(scene.player);
  scene.otherPlayers.map((player) => setOtherPlayerAnimation(player));
};
const setOtherPlayerAnimation = (player: PlayerSpriteObject) => {
  const onFloor = player.body.onFloor();
  if (player.body.velocity.x > ANIMATIONS.idleThreshold) {
    onFloor
      ? player.anims.play(getAnimationKey(ANIMATIONS.state.right, player.team), true)
      : player.anims.play(getAnimationKey(ANIMATIONS.state.airRight, player.team), true);
  } else if (player.body.velocity.x < -ANIMATIONS.idleThreshold) {
    onFloor
      ? player.anims.play(getAnimationKey(ANIMATIONS.state.left, player.team), true)
      : player.anims.play(getAnimationKey(ANIMATIONS.state.airLeft, player.team), true);
  } else {
    onFloor
      ? player.anims.play(getAnimationKey(ANIMATIONS.state.idle, player.team), true)
      : player.anims.play(getAnimationKey(ANIMATIONS.state.air, player.team), true);
  }
};

const setPlayerAnimation = (player: PlayerObject) => {
  const team = player.team;
  const onFloor = player.physicSprite.body.onFloor();
  if (player.physicSprite.body.velocity.x > ANIMATIONS.idleThreshold) {
    onFloor
      ? player.physicSprite.anims.play(getAnimationKey(ANIMATIONS.state.right, team), true)
      : player.physicSprite.anims.play(getAnimationKey(ANIMATIONS.state.airRight, team), true);
  } else if (player.physicSprite.body.velocity.x < -ANIMATIONS.idleThreshold) {
    onFloor
      ? player.physicSprite.anims.play(getAnimationKey(ANIMATIONS.state.left, team), true)
      : player.physicSprite.anims.play(getAnimationKey(ANIMATIONS.state.airLeft, team), true);
  } else {
    onFloor
      ? player.physicSprite.anims.play(getAnimationKey(ANIMATIONS.state.idle, team), true)
      : player.physicSprite.anims.play(getAnimationKey(ANIMATIONS.state.air, team), true);
  }
};
