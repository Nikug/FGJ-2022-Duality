import type { PlayerGameObject, ResourceGameObject, PlayerSpriteObject, ApiPlayerState, Modifier, Team } from "../../types/types";
import { ANIMATIONS, PLAYER_GRAVITY, PLAYER_SIZES } from "../constants";
import type { GameScene } from "../scenes/main";
import { getSheet } from "./characterUtils";

export const createRectangle = (scene: Phaser.Scene, position: Phaser.Math.Vector2, color: number, id: string): PlayerGameObject => {
  const rectangle = scene.add.rectangle(position.x, position.y, 12, 12, color) as PlayerGameObject;

  scene.physics.add.existing(rectangle);
  rectangle.id = id;
  return rectangle;
};

export const createResource = (scene: Phaser.Scene, position: Phaser.Math.Vector2, color: number, id: string): ResourceGameObject => {
  const coin = scene.physics.add.sprite(position.x, position.y, ANIMATIONS.sheets.resources.basic) as ResourceGameObject;

  coin.id = id;
  return coin;
};

export const createPlayer = (scene: Phaser.Scene, apiPlayer: ApiPlayerState) => {
  const player = scene.physics.add.sprite(apiPlayer.x, apiPlayer.y, getSheet(apiPlayer.team)) as PlayerSpriteObject;
  player.id = apiPlayer.id;
  player.team = apiPlayer.team;
  player.body.syncBounds = true;

  return player;
};

export const oppositeTeam = (team: Team) => (team === "coconut" ? "ananas" : "coconut");

export const applyModifiers = (scene: GameScene, newModifiers: Modifier[], oldModifiers: Modifier[]) => {
  const removedModifiers = oldModifiers.filter((modifier) => newModifiers.every((newModifier) => newModifier.type !== modifier.type));
  const addedModifiers = newModifiers.filter((modifier) => oldModifiers.every((newModifier) => newModifier.type !== modifier.type));

  for (const modifier of addedModifiers) {
    if (modifier.type === "gravity") {
      applyGravity(scene, modifier.team);
      scene.events.emit("addTimer", modifier.duration / 1000, modifier.team, modifier.type);
      setTimeout(() => {
        applyGravity(scene, oppositeTeam(modifier.team));
        scene.reverseModifierTeam(modifier.type);
      }, modifier.duration / 2);
    } else if (modifier.type === "bigsmall") {
      applyBigSmall(scene, modifier.team);
      scene.events.emit("addTimer", modifier.duration / 1000, modifier.team, modifier.type);
      setTimeout(() => {
        applyBigSmall(scene, oppositeTeam(modifier.team));
        scene.reverseModifierTeam(modifier.type);
      }, modifier.duration / 2);
    } else if (modifier.type === "hunt") {
      scene.events.emit("addTimer", modifier.duration / 1000, modifier.team, modifier.type);
      applyHunt(scene, modifier.team);
      setTimeout(() => {
        applyHunt(scene, oppositeTeam(modifier.team));
        scene.reverseModifierTeam(modifier.type);
      }, modifier.duration / 2);
    }
  }

  for (const modifier of removedModifiers) {
    if (modifier.type === "gravity") {
      removeGravity(scene);
    } else if (modifier.type === "bigsmall") {
      removeBigSmall(scene);
    } else if (modifier.type === "hunt") {
      removeHunt(scene);
    }
  }
};

const applyBigSmall = (scene: GameScene, team: Team) => {
  if (scene.player?.team === team) {
    scene.player?.setStats(PLAYER_SIZES.big);
  } else {
    scene.player?.setStats(PLAYER_SIZES.small);
  }

  scene.otherPlayers.map((player) => player.setScale(player.team === team ? PLAYER_SIZES.big.sizeScale : PLAYER_SIZES.small.sizeScale));
};

const applyGravity = (scene: GameScene, team: Team) => {
  if (scene.player?.team === team) {
    scene.player.physicSprite.setGravityY(-PLAYER_GRAVITY);
    scene.player.physicSprite.setFlipY(true);
  } else {
    scene.player?.physicSprite.setGravityY(PLAYER_GRAVITY);
    scene.player?.physicSprite.setFlipY(false);
  }

  scene.otherPlayers.map((player) => {
    player.setGravityY(player.team === team ? -PLAYER_GRAVITY : PLAYER_GRAVITY);
    player.setFlipY(player.team === team);
  });
};

const applyHunt = (scene: GameScene, team: Team) => {
  const redTint = 0xff0000;
  const targetTint = 0xff55ff;
  if (scene.player?.team === team) {
    scene.resources.map((resource) => resource.setTint(redTint));
    scene.otherPlayers.map((player) => {
      if (player.team !== team) {
        player.setTint(targetTint);
      }
    });
  } else {
    scene.resources.map((resource) => resource.setTint(0xffffff));
    scene.otherPlayers.map((player) => {
      if (player.team === team) {
        player.setTint(redTint);
      }
    });
  }
};

const removeGravity = (scene: GameScene) => {
  scene.player?.physicSprite.setGravityY(PLAYER_GRAVITY);
  scene.player?.physicSprite.resetFlip();
  scene.otherPlayers.map((player) => {
    player.setGravityY(PLAYER_GRAVITY);
    player.resetFlip();
  });
};

const removeBigSmall = (scene: GameScene) => {
  scene.player?.setStats(PLAYER_SIZES.normal);
  scene.otherPlayers.map((player) => player.setScale(PLAYER_SIZES.normal.sizeScale));
};

const removeHunt = (scene: GameScene) => {
  scene.resources.map((resource) => resource.setTint(0xffffff));
  scene.otherPlayers.map((player) => player.setTint(0xffffff));
};
