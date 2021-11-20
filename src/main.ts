import express from "express";
import { Server } from "socket.io";
import { Event } from "./enums/event.enum";
import { GameEventHandler } from "./handlers/game.event-handler";
import { createServer } from "http";
import config from "./config/config";
import {GameManager} from "./managers/game-manager";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
});
const port = config.port;

const gameManager = new GameManager(io);

io.on(Event.CONNECTION, (socket) => {
  const gameEventHandler = new GameEventHandler(socket, gameManager);
  gameEventHandler.initEventListeners();

  console.log(`Client with id '${socket.id}' connected.`);
});

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
