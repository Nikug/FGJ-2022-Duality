import { Socket } from "socket.io";
import { ResourceLocation } from "../../types/types";
import {
  fillEmptyResourceLocations,
  getResourceLocations,
  updateResourceLocations,
} from "../game/resource";
import { Vector2 } from "../../types/types";
import {
  addPlayer,
  pushPlayer,
  removePlayer,
  updatePlayerPosition,
} from "../game/player";

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
};
