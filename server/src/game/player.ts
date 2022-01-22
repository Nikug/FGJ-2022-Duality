import { Socket } from "socket.io";
import { getPlayers, setPlayers } from ".";
import { Player } from "../../types/types";

export const addPlayer = (socket: Socket) => {
  console.log("Adding new player", socket.id);

  const players = getPlayers();
  const newPlayer = {
    x: 100,
    y: 100,
    socket: socket,
  };
  const newPlayers = [...players, newPlayer];

  socket.broadcast.emit("newPlayer", playerToClient(newPlayer));
  socket.emit("init", playersToUpdate(newPlayers));
  setPlayers(newPlayers);
};

export const removePlayer = (socket: Socket) => {
  console.log("Removing player", socket.id);

  const players = getPlayers();
  const newPlayers = players.filter((player) => player.socket !== socket);

  socket.broadcast.emit("removePlayer", socket.id);
  setPlayers(newPlayers);
};

export const updatePlayerPosition = (x: number, y: number, socket: Socket) => {
  const players = getPlayers();
  const newPlayers = players.map((player) =>
    player.socket === socket ? { ...player, x, y } : player,
  );
  setPlayers(newPlayers);
};

export const playersToUpdate = (players: Player[]) =>
  players.map(playerToClient);

export const playerToClient = (player: Player) => ({
  x: player.x,
  y: player.y,
  id: player.socket.id,
});