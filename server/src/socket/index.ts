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
  resetLocation,
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

  socket.on(
    "push",
    ({
      id,
      targetId,
      direction,
    }: {
      id: string;
      targetId: string;
      direction: Vector2;
    }) => {
      pushPlayer(socket, id, targetId, direction);
    },
  );

  socket.on("getPlayerCount", () => {
    updatePlayerCount(socket);
  });

  socket.on("startGame", () => {
    startGame(socket);
    setRunning();
    fillEmptyResourceLocations();
  });
  socket.on(
    "collectResource",
    ({ id, playerId }: { id: string; playerId: string }) => {
      collectResource(id, playerId);
    },
  );
  socket.on("resetLocation", () => {
    resetLocation(socket);
  });
};
