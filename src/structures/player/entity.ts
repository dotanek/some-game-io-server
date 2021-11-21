// This represents ingame player properties.
import {Vector2D} from "../vector2d";

export class Entity {
  constructor(
    private readonly name: string,
    private position: Vector2D,
    private velocity: Vector2D,
    private acceleration: Vector2D,
    private mass: number,
  ) {}
}