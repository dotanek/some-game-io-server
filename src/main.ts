import express from "express";
import { Server } from "socket.io";
import { Event } from "./enums/event.enum";
import { GameHandler } from "./handlers/game.handler";
import { createServer } from "http";
import path from "path";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});

io.on(Event.CONNECTION, (socket) => {
  const gameHandler = new GameHandler(socket);
  gameHandler.initEventListeners();
});

httpServer.listen(3000, () => {
  console.log("Listening on port 3000...");
});
