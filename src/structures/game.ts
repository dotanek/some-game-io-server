import { Server } from 'socket.io';
import { User } from './user';
import { Entity } from './entity';
import { Vector2D } from './vector2d';
import { PlayerDataReceivedModel } from '../models/player-data-received.model';
import { UserNotInGameException } from '../exceptions/user-not-in-game.exception';
import { EntityPositionValidator } from '../validators/entity-position.validator';
import { ValidationFailedException } from '../exceptions/validation-failed.exception';
import { DataEmittedModel } from '../models/data-emitted.model';
import config from '../config/config';
import { generateRandomPosition } from '../utils/vector.util';

const positionValidator = new EntityPositionValidator();

class Player {
  constructor(public readonly user: User, public readonly entity: Entity) {}
}

export class Game {
  private readonly players: Record<string, Player> = {};

  constructor(private readonly id: string, private readonly io: Server) {}

  public getId(): string {
    return this.id;
  }

  public isPlayerIn(player: User) {
    return this.players[player.getId()] !== undefined;
  }

  public addPlayer(user: User, name: string): void {
    const position = generateRandomPosition(0, 0, config.world.width, config.world.height);

    const entity = new Entity(name, position, new Vector2D(0,0), new Vector2D(0,0), config.minimalMass);
    console.log(position);

    this.players[user.getId()] = new Player(user, entity);

    user.joinGame(this);
  }

  public removeAllPlayers(): void {
    this.getPlayersArray().forEach((player) => {
      player.user.leaveGame();
    });
  }

  public getPlayerCount(): number {
    return this.getPlayersArray().length;
  }

  public updatePlayerData(userId: string, data: PlayerDataReceivedModel) {
    const player = this.players[userId];

    if (!player) {
      throw new UserNotInGameException();
    }

    /* TODO add validation */
    const { position, velocity } = data;

    if (!positionValidator.validate(position)) {
      throw new ValidationFailedException('Forbidden entity position');
    }

    player.entity.update(position, velocity, player.entity.getMass());
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
        entities.push(player.entity);
      } catch (error) {
        if (error instanceof Error) {
          /* Might terminate player connection here considering something went wrong with him */

          console.error(error.message);
          console.error(error.stack);
        } else {
          console.error(error);
        }
      }
    });

    return entities;
  }
}
