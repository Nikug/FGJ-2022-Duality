import.meta.hot;
import Phaser from "phaser";
import { gameConfig } from "./phaser";
import { handleRoutes } from "./routes";
import { io } from "socket.io-client";

const serverUrl = __SNOWPACK_ENV__.SERVER_URL || "http://localhost:3000";
console.log("Server url is:", serverUrl);

export const socket = io(serverUrl);
export const game = new Phaser.Game(gameConfig);

handleRoutes(socket, game);
