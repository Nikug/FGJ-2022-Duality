import Phaser from "phaser";
import { gameConfig } from "./phaser";
import { io } from "socket.io-client";

const backendUrl = "http://localhost:3000";
export const socket = io(backendUrl);

socket.on("update", (players: { x: number; y: number; id: string }[]) => {
  console.log(players);
});

const game = new Phaser.Game(gameConfig);
