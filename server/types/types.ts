import { Socket } from "socket.io";

export interface Player {
  socket: Socket;
  x: number;
  y: number;
}

export enum ResourceType {
  BASIC = "basic",
}

export interface Resource extends ResourceLocation {
  type: ResourceType;
}

export interface ResourceLocation {
  id: string;
  x: number;
  y: number;
  type: string;
}

export interface Vector2 {
  x: number;
  y: number;
}
