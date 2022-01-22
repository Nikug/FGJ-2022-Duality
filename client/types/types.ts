import type { Socket } from "socket.io-client";

export namespace Game {
  export type PhysicsRectangle = Phaser.GameObjects.Rectangle & {
    body: Phaser.Physics.Arcade.Body;
  };

  export interface PlayerGameObject extends PhysicsRectangle {
    id: string;
  }

  export interface PlayerState {
    x?: number;
    y?: number;
    socket?: Socket;
    lastUpdate?: number;
  }

  export interface ApiPlayerState {
    x: number;
    y: number;
    id: string;
  }
}
