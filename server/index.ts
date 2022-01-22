import dotenv from "dotenv";
dotenv.config();

import { startGameLoop } from "./src/game";

import { Server } from "socket.io";
import cors from "cors";
import express from "express";
import http from "http";
import { handleSockets } from "./src/socket";

const PORT = process.env.PORT ?? 3000;

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", handleSockets);

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(PORT, () => {
  console.log(`Started server on port ${PORT}`);
});

startGameLoop();
