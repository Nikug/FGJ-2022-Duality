import { Socket } from "socket.io";
import { addPlayer, removePlayer, updatePlayerPosition } from "../game/player";

export const handleSockets = (socket: Socket) => {
  addPlayer(socket);

  socket.on("disconnect", () => {
    removePlayer(socket);
  });

  socket.on("move", ({ x, y }: { x: number; y: number }) => {
    updatePlayerPosition(x, y, socket);
  });
};
