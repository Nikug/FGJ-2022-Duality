import type * as Game from "../types/types";
import type { GameScene } from "./scenes/main";
import type { Socket } from "socket.io-client";

export const handleRoutes = (socket: Socket, game: Phaser.Game) => {
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
};
