import type { APIGameState, ApiPlayerState, Resource } from "../types/types";
import type { GameScene } from "./scenes/main";
import type { Socket } from "socket.io-client";
import type { MainMenu } from "./scenes/mainmenu";

export const handleRoutes = (socket: Socket, game: Phaser.Game) => {
  socket.on("init", (players: ApiPlayerState[], resources: Resource[]) => {
    const scenes = game.scene.getScenes();
    let scene: GameScene | MainMenu | undefined;
    for (let i = 0; i < scenes.length; i++) {
      if (scenes[i].scene.key === "MainMenu") {
        scene = game.scene.getScene("MainMenu") as MainMenu;
      } else {
        scene = game.scene.getScene("Game") as GameScene;
        scene.initPlayers(players);
        scene.updateResources(resources);
      }
    }
  });

  socket.on("update", (players: ApiPlayerState[]) => {
    const scenes = game.scene.getScenes();
    let scene: GameScene | MainMenu | undefined;
    for (let i = 0; i < scenes.length; i++) {
      if (scenes[i].scene.key === "MainMenu") {
        scene = game.scene.getScene("MainMenu") as MainMenu;
      } else {
        scene = game.scene.getScene("Game") as GameScene;
        scene.updatePlayers(players);
      }
    }
  });

  socket.on("newPlayer", (player: ApiPlayerState) => {
    const scenes = game.scene.getScenes();
    let scene: GameScene | MainMenu | undefined;
    for (let i = 0; i < scenes.length; i++) {
      if (scenes[i].scene.key === "MainMenu") {
        scene = game.scene.getScene("MainMenu") as MainMenu;
      } else {
        scene = game.scene.getScene("Game") as GameScene;
        scene.addPlayer(player);
      }
    }
  });

  socket.on("removePlayer", (id: string) => {
    const scenes = game.scene.getScenes();
    let scene: GameScene | MainMenu | undefined;
    for (let i = 0; i < scenes.length; i++) {
      if (scenes[i].scene.key === "MainMenu") {
        scene = game.scene.getScene("MainMenu") as MainMenu;
      } else {
        scene = game.scene.getScene("Game") as GameScene;
        scene.removePlayer(id);
      }
    }
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

  socket.on("updateResources", (resources: Resource[]) => {
    const scene = game.scene.getScene("Game") as GameScene;
    scene.updateResources(resources);
  });

  socket.on("getPushed", ({ direction }: { direction: Phaser.Math.Vector2 }) => {
    const scene = game.scene.getScene("Game") as GameScene;
    scene.getPushed(direction);
  });

  socket.on("playerCount", (playerCount) => {
    const scenes = game.scene.getScenes();
    let scene: GameScene | MainMenu | undefined;
    for (let i = 0; i < scenes.length; i++) {
      if (scenes[i].scene.key === "MainMenu") {
        scene = game.scene.getScene("MainMenu") as MainMenu;
        scene.setPlayerCount(playerCount);
      } else {
        scene = game.scene.getScene("Game") as GameScene;
      }
    }
  });

  socket.on("startGameForEveryone", () => {
    const scenes = game.scene.getScenes();
    let scene: GameScene | MainMenu | undefined;
    for (let i = 0; i < scenes.length; i++) {
      if (scenes[i].scene.key === "MainMenu") {
        scene = game.scene.getScene("MainMenu") as MainMenu;
        scene.startGameForEveryone();
      } else {
        scene = game.scene.getScene("Game") as GameScene;
      }
    }
  });
};
