import { EventHandlerInterface } from '../interfaces/event-handler.interface';
import { Socket } from 'socket.io';
import { Event } from '../enums/event.enum';
import { GameManagerInterface } from '../interfaces/game-manager.interface';
import { User } from '../structures/user';
import { PlayerDataReceivedModel } from '../models/player-data-received.model';
import { GameNotAssignedException } from '../exceptions/game-not-assigned.exception';
import { ValidationFailedException } from '../exceptions/validation-failed.exception';

export class UserEventHandler implements EventHandlerInterface {
  private readonly user: User;

  constructor(private readonly socket: Socket, private readonly gameManager: GameManagerInterface) {
    this.user = new User(socket);
  }

  public initEventListeners(): void {
    this.socket.on(Event.GAME_JOIN, this.handleGameJoin.bind(this));
    this.socket.on(Event.GAME_LEAVE, this.handleGameLeave.bind(this));
    this.socket.on(Event.DISCONNECT, this.handleDisconnect.bind(this));
    this.socket.on(Event.PLAYER_UPDATE, this.handlePlayerUpdate.bind(this));
  }

  private handleGameJoin(name: string, callback: () => void): void {
    this.gameManager.addUserToRandomGame(this.user, name);

    // TODO ARTIFICIAL DELAY REMOVE LATER
    setTimeout(() => {
      console.log(`Client with id '${this.socket.id}' joined game as '${name}'.`);
      callback();
    }, 1000);
  }

  private handlePlayerUpdate(data: PlayerDataReceivedModel): void {
    try {
      this.user.updateGame(data);
    } catch (error) {
      if (error instanceof GameNotAssignedException) {
        this.handleError(error);
      } else if (error instanceof ValidationFailedException) {
        this.handleError(error);
      }
    }
  }

  private handleGameLeave(): void {
    this.user.leaveGame();
  }

  private handleDisconnect(): void {
    this.user.leaveGame();

    console.log(`Client with id '${this.socket.id}' disconnected.`);
  }

  private handleError(error: Error): void {
    console.error(error.message);
    console.error(error.stack);

    this.socket.emit(Event.ERROR, 'An error has occured.');
  }
}
