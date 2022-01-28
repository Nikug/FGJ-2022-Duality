import { Socket } from "socket.io";
import { ResourceLocation } from "../../types/types";
import { addPlayer, removePlayer, updatePlayerPosition } from "../game/player";
import { updateResourceLocations } from "../game/resource";

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
};
