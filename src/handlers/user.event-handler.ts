import { EventHandlerInterface } from '../interfaces/event-handler.interface';
import { Socket } from 'socket.io';
import { SocketEvent } from '../enums/socket-event.enum';
import { GameManagerInterface } from '../interfaces/game-manager.interface';
import { User } from '../structures/user';
import { PlayerDataReceivedModel } from '../models/player-data-received.model';
import { GameNotAssignedException } from '../exceptions/game-not-assigned.exception';
import { ValidationFailedException } from '../exceptions/validation-failed.exception';
import eventEmitter from '../providers/event-emitter.provider';
import { InternalEvent } from '../enums/internal-event.enum';
import { GameLeftEvent } from '../events/game-left.event';

export interface UserEventHandlerInterface extends EventHandlerInterface {}

export class UserEventHandler implements UserEventHandlerInterface {
  private readonly user: User;

  constructor(private readonly socket: Socket, private readonly gameManager: GameManagerInterface) {
    this.user = new User(socket);
  }

  public initEventListeners(): void {
    this.socket.on(SocketEvent.GAME_JOIN, this.handleGameJoin.bind(this));
    this.socket.on(SocketEvent.GAME_LEAVE, this.handleGameLeave.bind(this));
    this.socket.on(SocketEvent.DISCONNECT, this.handleDisconnect.bind(this));
    this.socket.on(SocketEvent.PLAYER_UPDATE, this.handlePlayerUpdate.bind(this));
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
    if (this.user.hasGame()) {
      const gameId = this.user.getGame().getId();
      const userId = this.user.getId();

      eventEmitter.emit(InternalEvent.GAME_LEFT, new GameLeftEvent(gameId, userId));
    }

    console.log(`Client with id '${this.socket.id}' disconnected.`);
  }

  private handleError(error: Error): void {
    console.error(error.message);
    console.error(error.stack);

    this.socket.emit(SocketEvent.ERROR, 'An error has occurred.');
  }
}
