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
  x: number;
  y: number;
}
