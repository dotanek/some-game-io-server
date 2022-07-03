import { Game } from '../structures/game';
import { v4 as UUID } from 'uuid';
import { Server } from 'socket.io';
import { GameManagerInterface } from '../interfaces/game-manager.interface';
import { User } from '../structures/user';
import config from '../config/config';

export class GameManager implements GameManagerInterface {
  private readonly games: Record<string, Game> = {};

  constructor(private readonly io: Server) {
    setInterval(() => {
      console.log('Active games: ' + Object.values(this.games).length);
    }, 10000);

    setInterval(() => {
      this.pushGamesState();
    }, config.refreshRate);
  }

  public createGame(): Game {
    const id = UUID();
    const game = new Game(id, this.io);

    this.games[id] = game;

    return game;
  }

  public removeGame(game: Game): void {
    delete this.games[game.getId()];

    game.removeAllPlayers();
  }

  public addUserToRandomGame(user: User, name: string): void {
    const game = this.findOrCreateRandomGame();

    game.addPlayer(user, name);
  }

  private getGamesArray(): Game[] {
    return Object.values(this.games);
  }

  private findOrCreateRandomGame(): Game {
    const gamesArray: Game[] = this.getGamesArray();

    if (gamesArray.length === 0) {
      return this.createGame();
    }

    return gamesArray[Math.floor(Math.random() * gamesArray.length)];
  }

  private pushGamesState(): void {
    this.getGamesArray().forEach((game) => {
      game.pushStateToPlayers();
    });
  }
}
