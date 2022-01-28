import { Socket } from "socket.io";

export interface Player {
  socket: Socket;
  x: number;
  y: number;
}

export interface Vector2 {
  x: number;
  y: number;
}
