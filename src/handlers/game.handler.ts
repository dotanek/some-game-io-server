import { HandlerInterface } from "../interfaces/handler.interface";
import { Socket } from "socket.io";
import { Event } from "../enums/event.enum";

export class GameHandler implements HandlerInterface {
  constructor(private readonly socket: Socket) {}

  public initEventListeners(): void {
    this.socket.on(Event.GAME_JOIN, this.handleGameJoin);
    this.socket.on(Event.GAME_LEAVE, this.handleGameLeave);
  }

  private handleGameJoin(): void {
    return;
  }

  private handleGameLeave(): void {
    return;
  }
}
