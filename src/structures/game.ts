import { Server } from 'socket.io';
import { Player } from './player/player';
import { Entity } from './player/entity';
import { Vector2D } from './vector2d';
import { EntityNotAssignedException } from '../exceptions/entity-not-assigned.exception';
import {PlayerDataReceivedModel} from "../models/player-data-received.model";
import {PlayerNotInGameException} from "../exceptions/player-not-in-game.exception";
import {PlayerDataEmittedModel} from "../models/player-data-emitted.model";

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

    const entity = new Entity(name, new Vector2D(), new Vector2D(), new Vector2D(), 100);

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

    entity.update(position, velocity, entity.getMass());
  }

  public pushStateToPlayers(): void {
    const entities = this.getPlayerEntities();

    const data = {
      entities: entities.map(entity => {
        const name = entity.getName();
        const position = entity.getApproxPosition();
        const velocity = entity.getVelocity();
        const mass = entity.getMass();

        return { name, position, velocity, mass } as PlayerDataEmittedModel;
      })
    };

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
}
