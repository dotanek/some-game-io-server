import {Game} from "../structures/game";
import {Player} from "../structures/player/player";

export interface GameManagerInterface {
  createGame(): Game;

  removeGame(gameId: string): void;

  addPlayerToRandomGame(player: Player, name: string): void;
}
