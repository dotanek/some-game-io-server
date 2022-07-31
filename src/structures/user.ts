import { Socket } from 'socket.io';
import { Game } from './game';
import { GameNotAssignedException } from '../exceptions/game-not-assigned.exception';
import { PlayerDataReceivedModel } from '../models/player-data-received.model';
import EventEmitter from 'events';
import { InternalEvent } from '../enums/internal-event.enum';
import { GameLeftEvent } from '../events/game-left.event';

export class User {
  private game?: Game;
  private readonly eventEmitter = new EventEmitter();

  constructor(private readonly socket: Socket) {}

  public getId(): string {
    return this.socket.id;
  }

  public getGame(): Game {
    if (!this.game) {
      throw new GameNotAssignedException();
    }

    return this.game;
  }

  public joinGame(game: Game): void {
    if (this.hasGame()) {
      throw new GameNotAssignedException();
    }

    this.game = game;

    this.connectToGame(game);
  }

  public leaveGame(): void {
    if (!this.game) {
      throw new GameNotAssignedException();
    }

    const gameId = this.game.getId();
    const userId = this.getId();

    this.disconnectFromGame();
    this.game = undefined;

    this.eventEmitter.emit(InternalEvent.GAME_LEFT, new GameLeftEvent(gameId, userId));
  }

  public updateGame(data: PlayerDataReceivedModel): void {
    if (!this.game) {
      throw new GameNotAssignedException();
    }

    this.game.updatePlayerData(this.getId(), data);
  }

  public hasGame(): boolean {
    return this.game !== undefined;
  }

  private connectToGame(game: Game): void {
    this.socket.join(game.getId());
  }

  private disconnectFromGame(): void {
    if (!this.game) {
      throw new GameNotAssignedException();
    }

    this.socket.leave(this.game.getId());
  }
}
