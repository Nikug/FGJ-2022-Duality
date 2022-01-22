import dotenv from "dotenv";
dotenv.config();

import {
  addPlayer,
  removePlayer,
  startGameLoop,
  updatePlayerPosition,
} from "./src/main";

import { Server } from "socket.io";
import cors from "cors";
import express from "express";
import http from "http";

const PORT = process.env.PORT ?? 3000;

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  addPlayer(socket);

  socket.on("disconnect", () => {
    removePlayer(socket);
  });

  socket.on("move", ({ x, y }: { x: number; y: number }) => {
    console.log("moving", x, y);
    updatePlayerPosition(x, y, socket);
  });
});

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(PORT, () => {
  console.log(`Started server on port ${PORT}`);
});

startGameLoop();
