// This represents ingame player properties.
import {Vector2D} from "../vector2d";

export class Entity {
  constructor(
    private readonly name: string,
    private readonly position: Vector2D,
    private readonly velocity: Vector2D,
    private readonly acceleration: Vector2D,
  ) {}
}