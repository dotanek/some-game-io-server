import { EventHandlerInterface } from "../interfaces/event-handler.interface";
import { Socket } from "socket.io";
import { Event } from "../enums/event.enum";
import {GameManagerInterface} from "../interfaces/game-manager.interface";
import {Player} from "../structures/player/player";
import {PlayerDataReceivedModel} from "../models/player-data-received.model";
import {GameNotAssignedException} from "../exceptions/game-not-assigned.exception";

export class GameEventHandler implements EventHandlerInterface {
  private readonly player: Player;

  constructor(private readonly socket: Socket, private readonly gameManager: GameManagerInterface) {
    this.player = new Player(socket);
  }

  public initEventListeners(): void {
    this.socket.on(Event.GAME_JOIN, this.handleGameJoin.bind(this));
    this.socket.on(Event.GAME_LEAVE, this.handleGameLeave.bind(this));
    this.socket.on(Event.DISCONNECT, this.handleDisconnect.bind(this));
    this.socket.on(Event.PLAYER_UPDATE, this.handlePlayerUpdate.bind(this));
  }

  private handleGameJoin(name: string, callback: () => void): void {
    this.gameManager.addPlayerToRandomGame(this.player, name);

    // TODO ARTIFICIAL DELAY REMOVE LATER
    setTimeout(()=> {
      console.log(`Client with id '${this.socket.id}' joined game as '${name}'.`);
      callback();
    }, 1000);
  }

  private handlePlayerUpdate(data: PlayerDataReceivedModel): void {
    try {
      const game = this.player.getGame();

      game.updatePlayerData(this.player, data);

    } catch (error) {
      if (error instanceof GameNotAssignedException) {
        console.error(error.message);
        console.error(error.stack);

        this.socket.emit(Event.ERROR, 'An error has occured.');
        /* Might terminate player connection here considering something went wrong with him */
      }
    }
  }

  private handleGameLeave(): void {
    this.gameManager.removePlayerFromAllGames(this.player);
  }

  private handleDisconnect(): void {
    this.gameManager.removePlayerFromAllGames(this.player);

    console.log(`Client with id '${this.socket.id}' disconnected.`);
  }
}
