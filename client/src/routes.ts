import type { APIGameState, ApiPlayerState, GameState } from "../types/types";
import type { GameScene } from "./scenes/main";
import type { Socket } from "socket.io-client";

export const handleRoutes = (socket: Socket, game: Phaser.Game) => {
  socket.on("init", (players: ApiPlayerState[]) => {
    const scene = game.scene.getScene("Game") as GameScene;
    scene.initPlayers(players);
  });

  socket.on("update", (players: ApiPlayerState[]) => {
    const scene = game.scene.getScene("Game") as GameScene;
    scene.updatePlayers(players);
  });

  socket.on("newPlayer", (player: ApiPlayerState) => {
    const scene = game.scene.getScene("Game") as GameScene;
    scene.addPlayer(player);
  });

  socket.on("removePlayer", (id: string) => {
    const scene = game.scene.getScene("Game") as GameScene;
    scene.removePlayer(id);
  });

  socket.on("getPushed", ({ direction }: { direction: Phaser.Math.Vector2 }) => {
    const scene = game.scene.getScene("Game") as GameScene;
    scene.getPushed(direction);
  });

  socket.on("addModifier", (gameState: APIGameState) => {
    const scene = game.scene.getScene("Game") as GameScene;
    scene.events.emit("addTimer", 5);
    console.log("Updating GameState: ", gameState);
  });

  socket.on("removeModifier", (gameState: APIGameState) => {
    const scene = game.scene.getScene("Game") as GameScene;
    console.log("Updating GameState: ", gameState);
  });

  socket.on("giveResourceLocations", () => {
    const scene = game.scene.getScene("Game") as GameScene;
    scene.sendResourceLocations(socket);
  });

  socket.on("updateResources", (resources) => {
    console.log({ resources });
  });

  socket.on("getPushed", ({ direction }: { direction: Phaser.Math.Vector2 }) => {
    const scene = game.scene.getScene("Game") as GameScene;
    scene.getPushed(direction);
  });
};
