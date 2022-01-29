import { Socket } from "socket.io";
import { getGameState, getPlayerById, getPlayers, setPlayers } from ".";
import { Player, Team, Vector2 } from "../../types/types";
import { getResources } from "./resource";

export const addPlayer = (socket: Socket) => {
  const players = getPlayers();
  const newPlayer: Player = {
    x: 0,
    y: 0,
    socket: socket,
    team: assignTeam(players),
  };
  const newPlayers = [...players, newPlayer];

  console.log("Adding new player", socket.id, newPlayer.team);

  socket.broadcast.emit("newPlayer", playerToClient(newPlayer));
  socket.emit("init", playersToUpdate(newPlayers), getResources());
  setPlayers(newPlayers);
};

export const assignTeam = (players: Player[]): Team => {
  const { coconut, ananas } = players.reduce(
    (prev: { coconut: number; ananas: number }, player) =>
      player.team === "ananas"
        ? { ...prev, ananas: prev.ananas + 1 }
        : { ...prev, coconut: prev.coconut + 1 },
    { coconut: 0, ananas: 0 },
  );

  if (coconut === ananas) {
    return Math.floor(Math.random() * 2) == 0 ? "ananas" : "coconut";
  } else {
    return coconut > ananas ? "ananas" : "coconut";
  }
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
  team: player.team,
});

export const pushPlayer = (playerId: string, direction: Vector2) => {
  const player = getPlayerById(playerId);
  if (player) {
    player.socket?.emit("getPushed", { direction });
  }
};

export const updatePlayerCount = (socket: Socket) => {
  const players = getPlayers();
  socket.emit("playerCount", players.length);
};

export const startGame = (socket: Socket) => {
  const gameState = getGameState();
  if (!gameState.running) {
    socket.broadcast.emit("startGameForEveryone");
    socket.emit("startGameForEveryone");
  }
};
