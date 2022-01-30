import { Socket } from "socket.io";
import {
  getGameState,
  getPlayerById,
  getPlayers,
  setGameState,
  setPlayers,
} from ".";
import { io } from "../..";
import { Player, Team, Vector2 } from "../../types/types";
import { RESOURCE_POINT } from "../constants";
import { flipCoin } from "../utils/getRandomNumber";
import { setNotRunning } from "./gameState";
import { getResources } from "./resource";

export const addPlayer = (socket: Socket) => {
  const gameState = getGameState();
  if (gameState.running) {
    socket.disconnect(true);
    return;
  }

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
  io.emit("init", playersToUpdate(newPlayers), getResources());
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
    return flipCoin() ? "ananas" : "coconut";
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

  if (newPlayers.length === 0) {
    setNotRunning();
  }
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

export const pushPlayer = (
  socket: Socket,
  playerId: string,
  targetId: string,
  direction: Vector2,
) => {
  const player = getPlayerById(targetId);
  if (player) {
    socket.broadcast.emit("getPushed", {
      slapperId: playerId,
      targetId,
      direction,
    });
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

export const handleHunt = (socket: Socket, hunted: string) => {
  const player = getPlayerById(hunted);
  if (!player) return;
  const state = getGameState();

  const hunter = getPlayerById(socket.id);
  if (hunter) {
    if (hunter.team === "ananas") {
      state.score.ananas += RESOURCE_POINT;
      state.score.coconut -= RESOURCE_POINT;
    } else {
      state.score.coconut += RESOURCE_POINT;
      state.score.ananas -= RESOURCE_POINT;
    }
    setGameState(state);
    io.emit("updateScore", state.score);
  }

  socket.broadcast.emit("hunted", { hunter: socket.id, hunted: hunted });
};
