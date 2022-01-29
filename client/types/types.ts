import type { Socket } from "socket.io-client";

export type Team = "coconut" | "ananas";

export type PhysicsRectangle = Phaser.GameObjects.Rectangle & {
  body: Phaser.Physics.Arcade.Body;
};

export interface PlayerGameObject extends PhysicsRectangle {
  id: string;
}

export interface ResourceGameObject extends PhysicsRectangle {
  id: string;
}

export interface PlayerSpriteObject extends Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
  id: string;
  team: Team;
}

export interface PlayerState {
  x?: number;
  y?: number;
  socket?: Socket;
  lastUpdate?: number;
}

export interface GameState {
  modifiers: Modifier[];
}
export interface APIGameState {
  modifiers: string[];
}

export interface Platform {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface ApiPlayerState {
  x: number;
  y: number;
  id: string;
  team: Team;
}

export interface Resource {
  id: string;
  x: number;
  y: number;
  type: string;
}

export type PlayerColors = "blue" | "green";

export interface Modifier {
  type: string;
  team: Team;
  duration: number;
}
