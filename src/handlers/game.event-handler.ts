import { EventHandlerInterface } from "../interfaces/event-handler.interface";
import { Socket } from "socket.io";
import { Event } from "../enums/event.enum";
import {GameManagerInterface} from "../interfaces/game-manager.interface";
import {Player} from "../structures/player/player";

export class GameEventHandler implements EventHandlerInterface {
  private player: Player;
  constructor(private readonly socket: Socket, private readonly gameManager: GameManagerInterface) {
    this.player = new Player(socket);
  }

  public initEventListeners(): void {
    this.socket.on(Event.GAME_JOIN, this.handleGameJoin.bind(this));
    this.socket.on(Event.GAME_LEAVE, this.handleGameLeave.bind(this));
  }

  private handleGameJoin(name: string, callback: () => void): void {
    this.gameManager.addPlayerToRandomGame(this.player, name);

    console.log(`Client with id '${this.socket.id}' joined game as '${name}'.`);
    callback();
  }

  private handleGameLeave(): void {
    return;
  }
}
