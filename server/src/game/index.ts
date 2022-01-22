import { Player } from "../../types/types";
import { UPDATE_INTERVAL } from "../constants";
import { playersToUpdate } from "../game/player";

let globalPlayers: Player[] = [];

export const getPlayers = () => [...globalPlayers];
export const setPlayers = (newPlayers: Player[]) =>
  (globalPlayers = newPlayers);

export const startGameLoop = async () => {
  console.log("Started game loop!");
  for (;;) {
    const players = getPlayers();
    const update = playersToUpdate(players);
    players.map((player) => player.socket.emit("update", update));
    await new Promise((resolve) => setTimeout(resolve, UPDATE_INTERVAL));
  }
};