import { Game } from '../structures/game';
import { v4 as UUID } from 'uuid';
import { Server } from 'socket.io';
import { GameManagerInterface } from '../interfaces/game-manager.interface';
import { Player } from '../structures/player/player';
import config from '../config/config';

export class GameManager implements GameManagerInterface {
  private readonly games: Record<string, Game> = {};

  constructor(private readonly io: Server) {
    setInterval(() => {
      console.log('Active games: ' + Object.values(this.games).length);
    }, 1000);

    setInterval(() => {
      this.pushGamesState();
    }, config.updateRate);
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

  public addPlayerToRandomGame(player: Player, name: string): void {
    this.removePlayerFromAllGames(player);

    const game = this.findOrCreateRandomGame();

    game.addPlayer(player, name);
  }

  public removePlayerFromAllGames(player: Player): void {
    this.getGamesArray().forEach((game) => {
      if (game.isPlayerIn(player)) {
        game.removePlayer(player);

        if (game.getPlayerCount() === 0) {
          this.removeGame(game);
        }
      }
    });
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
