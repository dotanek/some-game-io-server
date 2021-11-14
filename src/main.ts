import express from "express";
import { Server } from "socket.io";
import { Event } from "./enums/event.enum";
import { GameHandler } from "./handlers/game.handler";
import { createServer } from "http";
import config from "./config/config";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
});
const port = config.port;

io.on(Event.CONNECTION, (socket) => {
  const gameHandler = new GameHandler(socket);
  gameHandler.initEventListeners();

  console.log(`Client with id '${socket.id}' connected.`);
});

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
