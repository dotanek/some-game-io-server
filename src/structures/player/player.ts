import {Socket} from "socket.io";
import {Entity} from "./entity";
import {EntityNotAssignedException} from "../../exceptions/entity-not-assigned.exception";

export class Player {
  private entity?: Entity;

  constructor(private readonly socket: Socket) {}

  public getId(): string {
    return this.socket.id;
  }

  public getEntity(): Entity {

    if (!this.entity) {
      throw new EntityNotAssignedException();
    }

    return this.entity;
  }

  public joinGame(gameId: string, entity: Entity): void {
    this.entity = entity;

    this.connectToGame(gameId);
  }

  public leaveGame(gameId: string): void {
    this.entity = undefined;

    this.disconnectFromGame(gameId);
  }

  private connectToGame(gameId: string): void {
    this.socket.join(gameId);
  }

  private disconnectFromGame(gameId: string): void {
    this.socket.leave(gameId);
  }
}