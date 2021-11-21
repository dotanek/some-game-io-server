import { Server, Socket } from 'socket.io';
import { Player } from './player/player';
import { Entity } from './player/entity';
import { Vector2D } from './vector2d';
import { EntityNotAssignedException } from '../exceptions/entity-not-assigned.exception';
import config from '../config/config';

export class Game {
  private readonly players: Record<string, Player> = {};

  constructor(private readonly id: string, private readonly io: Server) {
    //this.addMockPlayers();

    setInterval(() => {
      const data = {
        entities: this.getPlayerEntities(),
      };

      console.log(data.entities);

      io.to(id).emit('game-update', data);
    }, config.updateRate);
  }

  private random(): number {
    return 100 + Math.random() * 200;
  }

  private addMockPlayers(amount: number = 10): void {
    for (let i = 0; i < amount; i++) {
      const mockPlayer = new Player({ id: 'aaaaaaaaa' + i } as Socket);
      const entity = new Entity(
        'mock-player-' + i,
        new Vector2D(500 * i, 500 * i),
        new Vector2D(this.random(), this.random()),
        new Vector2D(0, 0),
        100 * this.random(),
      );

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

    const entity = new Entity(name, new Vector2D(), new Vector2D(), new Vector2D(), 100);

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
