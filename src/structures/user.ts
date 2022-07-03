import { Socket } from 'socket.io';
import { Game } from './game';
import { GameNotAssignedException } from '../exceptions/game-not-assigned.exception';
import { PlayerDataReceivedModel } from '../models/player-data-received.model';

export class User {
  private game?: Game;

  constructor(private readonly socket: Socket) {
  }

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
    this.game = game;

    this.connectToGame(game);
  }

  public leaveGame(): void {
    this.disconnectFromGame();

    this.game = undefined;
  }

  public updateGame(data: PlayerDataReceivedModel): void {
    if (!this.game) {
      throw new GameNotAssignedException();
    }

    this.game.updatePlayerData(this.getId(), data);
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
