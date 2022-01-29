import { Socket } from "socket.io";

export type Team = "coconut" | "ananas";

export interface Player {
  socket: Socket;
  x: number;
  y: number;
  team: Team;
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

export interface Score {
  coconut: number;
  ananas: number;
}

export interface GameState {
  running: boolean;
  modifiers: Modifier[];
  score: Score;
}

export interface Modifier {
  type: string;
  team: Team;
  duration: number;
}
