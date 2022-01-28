import { Socket } from "socket.io";

export interface Player {
  socket: Socket;
  x: number;
  y: number;
}

export interface Resource {
  type: string;
  x: number;
  y: number;
}