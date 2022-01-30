import type { ApiPlayerState, Modifier, PoorMansVector2, Resource, Score, Team } from "../types/types";
import type { GameScene } from "./scenes/main";
import type { Socket } from "socket.io-client";
import type { MainMenu } from "./scenes/mainmenu";

export const handleRoutes = (socket: Socket, game: Phaser.Game) => {
  socket.on("init", (players: ApiPlayerState[], resources: Resource[]) => {
    const scene = game.scene.getScene("Game") as GameScene;
    scene.initPlayers(players);
    scene.updateResources(resources);
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

  socket.on("getPushed", ({ slapperId, targetId, direction }: { slapperId: string; targetId: string; direction: PoorMansVector2 }) => {
    const scene = game.scene.getScene("Game") as GameScene;
    scene.getPushed(slapperId, targetId, new Phaser.Math.Vector2(direction.x, direction.y));
  });

  socket.on("updateModifiers", (modifiers: Modifier[]) => {
    const scene = game.scene.getScene("Game") as GameScene;
    scene.setModifiers(modifiers);
  });

  socket.on("giveResourceLocations", () => {
    const scene = game.scene.getScene("Game") as GameScene;
    scene.sendResourceLocations(socket);
  });

  socket.on("updateResources", (resources: Resource[]) => {
    const scene = game.scene.getScene("Game") as GameScene;
    scene.updateResources(resources);
  });

  socket.on("playerCount", (playerCount) => {
    const scene = game.scene.getScene("MainMenu") as MainMenu;
    scene.setPlayerCount(playerCount);
  });

  socket.on("startGameForEveryone", () => {
    const scene = game.scene.getScene("MainMenu") as MainMenu;
    scene.startGameForEveryone();
  });
  socket.on("updateScore", (score: Score) => {
    const scene = game.scene.getScene("Game") as MainMenu;
    scene.events.emit("addScore", score);
  });
  socket.on("teamVictory", (team: Team) => {
    const scene = game.scene.getScene("Game") as GameScene;
    scene.victory(team);
  });

  socket.on("hunted", ({ hunter, hunted }: { hunter: string; hunted: string }) => {
    const scene = game.scene.getScene("Game") as GameScene;
    scene.handleHunted(hunter, hunted);
  });
};
