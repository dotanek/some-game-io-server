import { PlayerDataEmittedModel } from './player-data-emitted.model';

export interface DataEmittedModel {
  entities: Record<string, PlayerDataEmittedModel>;
}
