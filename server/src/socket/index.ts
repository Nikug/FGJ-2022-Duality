import { Socket } from "socket.io";
import { ResourceLocation } from "../../types/types";
import {
  collectResource,
  fillEmptyResourceLocations,
  updateResourceLocations,
} from "../game/resource";
import { Vector2 } from "../../types/types";
import {
  addPlayer,
  pushPlayer,
  removePlayer,
  startGame,
  updatePlayerCount,
  updatePlayerPosition,
} from "../game/player";
import { setRunning } from "../game/gameState";

export const handleSockets = (socket: Socket) => {
  addPlayer(socket);

  socket.on("disconnect", () => {
    removePlayer(socket);
  });

  socket.on("move", ({ x, y }: { x: number; y: number }) => {
    updatePlayerPosition(x, y, socket);
  });

  socket.on(
    "sendResourceLocations",
    (resourceLocations: ResourceLocation[]) => {
      updateResourceLocations(resourceLocations);
    },
  );

  socket.on("initResources", () => {
    fillEmptyResourceLocations();
  });

  socket.on("push", ({ id, direction }: { id: string; direction: Vector2 }) => {
    pushPlayer(id, direction);
  });

  socket.on("getPlayerCount", () => {
    updatePlayerCount(socket);
  });

  socket.on("startGame", () => {
    startGame(socket);
    setRunning();
  });
  socket.on(
    "collectResource",
    ({ id, playerId }: { id: string; playerId: string }) => {
      collectResource(id, playerId);
    },
  );
};
