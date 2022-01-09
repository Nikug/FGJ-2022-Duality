import Phaser from "phaser";
import { gameConfig } from "./phaser";
import { io } from "socket.io-client";

const backendUrl = "http://localhost:3000";

const socket = io(backendUrl);

const game = new Phaser.Game(gameConfig);
