import {Socket} from "socket.io";
import {Entity} from "./entity";
import {EntityNotAssignedException} from "../../exceptions/entity-not-assigned.exception";
import {Game} from "../game";
import {GameNotAssignedException} from "../../exceptions/game-not-assigned.exception";

export class Player {
  private entity?: Entity;
  private game?: Game;

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

  public getGame(): Game {
    if (!this.game) {
      throw new GameNotAssignedException();
    }

    return this.game;
  }

  public joinGame(game: Game, entity: Entity): void {
    this.entity = entity;
    this.game = game;

    this.connectToGame(game);
  }

  public leaveGame(game: Game): void {
    this.entity = undefined;
    this.game = undefined;

    this.disconnectFromGame(game);
  }

  private connectToGame(game: Game): void {
    this.socket.join(game.getId());
  }

  private disconnectFromGame(game: Game): void {
    this.socket.leave(game.getId());
  }
}