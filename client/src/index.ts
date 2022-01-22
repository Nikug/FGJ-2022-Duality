import type { Game } from "../types/types";
import type { GameScene } from "./scenes/main";
import Phaser from "phaser";
import { gameConfig } from "./phaser";
import { io } from "socket.io-client";

const backendUrl = "http://localhost:3000";
export const socket = io(backendUrl);

socket.on("init", (players: Game.ApiPlayerState[]) => {
  const scene = game.scene.getScene("Game") as GameScene;
  scene.initPlayers(players);
});

socket.on("update", (players: Game.ApiPlayerState[]) => {
  const scene = game.scene.getScene("Game") as GameScene;
  scene.updatePlayers(players);
});

socket.on("newPlayer", (player: Game.ApiPlayerState) => {
  const scene = game.scene.getScene("Game") as GameScene;
  scene.addPlayer(player);
});

socket.on("removePlayer", (id: string) => {
  const scene = game.scene.getScene("Game") as GameScene;
  scene.removePlayer(id);
});

const game = new Phaser.Game(gameConfig);
