import { HandlerInterface } from "../interfaces/handler.interface";
import { Socket } from "socket.io";
import { Event } from "../enums/event.enum";

export class GameHandler implements HandlerInterface {
  constructor(private readonly socket: Socket) {}

  public initEventListeners(): void {
    this.socket.on(Event.GAME_JOIN, this.handleGameJoin.bind(this));
    this.socket.on(Event.GAME_LEAVE, this.handleGameLeave.bind(this));
  }

  private handleGameJoin(name: string, callback: () => void): void {
    console.log(`Client with id '${this.socket.id}' joined game as '${name}'.`);
    callback();
  }

  private handleGameLeave(): void {
    return;
  }
}
