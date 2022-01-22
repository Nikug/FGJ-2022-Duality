import { Player } from "../types/types";
import { Socket } from "socket.io";

const UPDATES_PER_SECOND = 30;
const UPDATE_INTERVAL = (1 / UPDATES_PER_SECOND) * 1000;

let players: Player[] = [];

export const addPlayer = (socket: Socket) => {
  const newPlayer = {
    x: 100,
    y: 100,
    socket: socket,
  };
  players = [...players, newPlayer];
  socket.broadcast.emit("newPlayer", playerToClient(newPlayer));
  socket.emit("init", playersToUpdate(players));
};

export const removePlayer = (socket: Socket) => {
  players = players.filter((player) => player.socket !== socket);
  socket.broadcast.emit("removePlayer", socket.id);
};

export const updatePlayerPosition = (x: number, y: number, socket: Socket) => {
  players = players.map((player) =>
    player.socket === socket ? { ...player, x, y } : player,
  );
};

export const startGameLoop = async () => {
  console.log("Started game loop!");
  for (;;) {
    const update = playersToUpdate(players);
    players.map((player) => player.socket.emit("update", update));
    await new Promise((resolve) => setTimeout(resolve, UPDATE_INTERVAL));
  }
};

const playersToUpdate = (players: Player[]) => {
  return players.map(playerToClient);
};

const playerToClient = (player: Player) => ({
  x: player.x,
  y: player.y,
  id: player.socket.id,
});
