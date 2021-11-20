import {Game} from "../structures/game";
import { v4 as UUID } from 'uuid';
import {Server} from "socket.io";
import {GameManagerInterface} from "../interfaces/game-manager.interface";
import {Player} from "../structures/player/player";

export class GameManager implements GameManagerInterface {
  private readonly games: Record<string, Game> = {};

  constructor(private readonly io: Server) {}

  public createGame(): Game {
    const id = UUID();
    const game = new Game(id, this.io);

    this.games[id] = game;

    return game;
  }

  public removeGame(gameId: string): void {
    console.log(gameId);
    return;
  }

  public addPlayerToRandomGame(player: Player, name: string): void {
    this.removePlayerFromGames(player);

    const game = this.findOrCreateRandomGame();

    game.addPlayer(player, name);
  }

  private removePlayerFromGames(player: Player) {
    this.getGamesArray().forEach(game => {
      if (game.isPlayerIn(player)) {
        game.removePlayer(player);
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
}