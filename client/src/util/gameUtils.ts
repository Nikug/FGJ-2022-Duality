import type { Game } from "phaser";
import type { PlayerGameObject, ResourceGameObject, PlayerSpriteObject, ApiPlayerState, Modifier, Team } from "../../types/types";
import { PLAYER_GRAVITY } from "../constants";
import type { GameScene } from "../scenes/main";
import { getSheet } from "./characterUtils";

export const createRectangle = (scene: Phaser.Scene, position: Phaser.Math.Vector2, color: number, id: string): PlayerGameObject => {
  const rectangle = scene.add.rectangle(position.x, position.y, 12, 12, color) as PlayerGameObject;

  scene.physics.add.existing(rectangle);
  rectangle.id = id;
  return rectangle;
};

export const createResource = (scene: Phaser.Scene, position: Phaser.Math.Vector2, color: number, id: string): ResourceGameObject => {
  const rectangle = scene.add.rectangle(position.x, position.y, 12, 12, color) as ResourceGameObject;
  scene.physics.add.existing(rectangle, true);
  rectangle.id = id;
  return rectangle;
};

export const createPlayer = (scene: Phaser.Scene, apiPlayer: ApiPlayerState) => {
  const player = scene.physics.add.sprite(apiPlayer.x, apiPlayer.y, getSheet(apiPlayer.team)) as PlayerSpriteObject;
  player.id = apiPlayer.id;
  player.team = apiPlayer.team;

  return player;
};

export const oppositeTeam = (team: Team) => (team === "coconut" ? "ananas" : "coconut");

export const applyModifiers = (scene: GameScene, newModifiers: Modifier[], oldModifiers: Modifier[]) => {
  const removedModifiers = oldModifiers.filter((modifier) => newModifiers.every((newModifier) => newModifier.type !== modifier.type));
  for (const modifier of newModifiers) {
    if (modifier.type === "gravity") {
      applyGravity(scene, modifier.team);
      setTimeout(() => {
        applyGravity(scene, oppositeTeam(modifier.team));
        scene.reverseModifierTeam(modifier.type);
      }, modifier.duration / 2);
    }
  }

  for (const modifier of removedModifiers) {
    if (modifier.type === "gravity") {
      removeGravity(scene);
    }
  }
};

const applyGravity = (scene: GameScene, team: Team) => {
  if (scene.player?.team === team) {
    scene.player.physicSprite.setGravityY(-PLAYER_GRAVITY);
  } else {
    scene.player?.physicSprite.setGravityY(PLAYER_GRAVITY);
  }

  scene.otherPlayers.map((player) => player.setGravityY(player.team === team ? -PLAYER_GRAVITY : PLAYER_GRAVITY));
};

const removeGravity = (scene: GameScene) => {
  scene.player?.physicSprite.setGravityY(PLAYER_GRAVITY);
  scene.otherPlayers.map((player) => player.setGravityY(PLAYER_GRAVITY));
};
