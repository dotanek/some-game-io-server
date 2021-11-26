import {Game} from "../structures/game";
import {Player} from "../structures/player/player";

export interface GameManagerInterface {
  createGame(): Game;

  removeGame(game: Game): void;

  addPlayerToRandomGame(player: Player, name: string): void;

  removePlayerFromAllGames(player: Player): void;
}
