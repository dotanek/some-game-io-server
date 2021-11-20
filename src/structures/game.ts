import { Server, Socket } from 'socket.io';
import { Player } from './player/player';
import { Entity } from './player/entity';
import { Vector2D } from './vector2d';
import { EntityNotAssignedException } from '../exceptions/entity-not-assigned.exception';

export class Game {
  private readonly players: Record<string, Player> = {};

  constructor(private readonly id: string, private readonly io: Server) {
    this.addMockPlayers();

    setInterval(() => {
      io.to(id).emit('game-update', this.getPlayerEntities());
    }, 1000);
  }

  private addMockPlayers(amount: number = 10): void {
    for (let i = 0; i < amount; i++) {
      const mockPlayer = new Player({ id: "aaaaaaaaa"+i } as Socket);
      const entity = new Entity('mock-player-' + i, new Vector2D(100 * i, 100 * i), new Vector2D(20, 20), new Vector2D(0, 0));

      (mockPlayer as any).entity = entity;
      this.players[mockPlayer.getId()] = mockPlayer;
    }
  }

  public getId(): string {
    return this.id;
  }

  public isPlayerIn(player: Player) {
    return this.players[player.getId()] !== undefined;
  }

  public addPlayer(player: Player, name: string): void {
    this.players[player.getId()] = player;

    const entity = new Entity(name, new Vector2D(), new Vector2D(), new Vector2D());

    player.joinGame(this.id, entity);
  }

  public removePlayer(player: Player) {
    player.leaveGame(this.id);

    delete this.players[player.getId()];
  }

  private getPlayersArray(): Player[] {
    return Object.values(this.players);
  }

  private getPlayerEntities(): Entity[] {
    const entities = [] as Entity[];

    this.getPlayersArray().forEach((player) => {
      try {
        entities.push(player.getEntity());
      } catch (error) {
        if (error instanceof EntityNotAssignedException) {
          console.error(error.message);
          console.error(error.stack);

          /* Might terminate player connection here considering something went wrong with him */
        }
      }
    });

    return entities;
  }
}
