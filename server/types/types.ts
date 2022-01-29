import { Socket } from "socket.io";

export interface Player {
  socket: Socket;
  x: number;
  y: number;
}

export interface Game {
  modifiers: string[]
}

export interface Vector2 {
  x: number;
  y: number;
}

