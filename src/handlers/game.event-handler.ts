import { EventHandlerInterface } from '../interfaces/event-handler.interface';
import { Game } from '../structures/game';
import { InternalEvent } from '../enums/internal-event.enum';
import { GameLeftEvent } from '../events/game-left.event';
import eventEmitter from '../providers/event-emitter.provider';

export interface GameEventHandlerInterface extends EventHandlerInterface {}

export class GameEventHandler implements GameEventHandlerInterface {
  constructor(private readonly game: Game) {}

  public initEventListeners(): void {
    eventEmitter.addListener(InternalEvent.GAME_LEFT, this.handleGameLeft.bind(this));
  }

  public handleGameLeft(event: GameLeftEvent): void {
    if (this.game.getId() !== event.gameId) {
      return;
    }

    this.game.removePlayerById(event.userId);
  }
}