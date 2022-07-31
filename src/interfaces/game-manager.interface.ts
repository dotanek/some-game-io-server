import { Game } from '../structures/game';
import { User } from '../structures/user';

export interface GameManagerInterface {
  createGame(): Game;

  removeGame(game: Game): void;

  addUserToRandomGame(user: User, name: string): void;
}
