import { Server } from 'socket.io';
import { Player } from './player/player';
import { Entity } from './player/entity';
import { Vector2D } from './vector2d';
import { EntityNotAssignedException } from '../exceptions/entity-not-assigned.exception';
import { PlayerDataReceivedModel } from '../models/player-data-received.model';
import { PlayerNotInGameException } from '../exceptions/player-not-in-game.exception';
import { EntityPositionValidator } from '../validators/entity-position.validator';
import { ValidationFailedException } from '../exceptions/validation-failed.exception';
import { DataEmittedModel } from '../models/data-emitted.model';
import config from '../config/config';

const positionValidator = new EntityPositionValidator();

export class Game {
  private readonly players: Record<string, Player> = {};

  constructor(private readonly id: string, private readonly io: Server) {}

  public getId(): string {
    return this.id;
  }

  public isPlayerIn(player: Player) {
    return this.players[player.getId()] !== undefined;
  }

  public addPlayer(player: Player, name: string): void {
    this.players[player.getId()] = player;

    //const position = this.generateRandomPosition(0, 0, config.world.width, config.world.height);

    const mass = config.minimalMass;

    const entity = new Entity(name, new Vector2D(), new Vector2D(), new Vector2D(), mass);

    player.joinGame(this, entity);
  }

  public removePlayer(player: Player) {
    player.leaveGame(this);

    delete this.players[player.getId()];
  }

  public removeAllPlayers(): void {
    this.getPlayersArray().forEach((player) => {
      player.leaveGame(this);
    });
  }

  public getPlayerCount(): number {
    return this.getPlayersArray().length;
  }

  public updatePlayerData(player: Player, data: PlayerDataReceivedModel) {
    if (!this.players[player.getId()]) {
      throw new PlayerNotInGameException();
    }

    const entity = player.getEntity();

    /* TODO add validation */
    const { position, velocity } = data;

    if (!positionValidator.validate(position)) {
      throw new ValidationFailedException('Forbidden entity position');
    }

    entity.update(position, velocity, entity.getMass());
  }

  public pushStateToPlayers(): void {
    const entities = this.getPlayerEntities();
    const data: DataEmittedModel = {
      entities: {},
    };

    entities.forEach((entity) => {
      const name = entity.getName();
      const position = entity.getApproxPosition();
      const velocity = entity.getVelocity();
      const mass = entity.getMass();

      data.entities[name] = { name, position, velocity, mass };
    });

    this.io.to(this.id).emit('game-update', data);
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

  private generateRandomPosition(xStart: number, yStart: number, xEnd: number, yEnd: number): Vector2D {
    const x = xStart + Math.random() * xEnd;
    const y = yStart + Math.random() * yEnd;

    return new Vector2D(x, y);
  }
}
