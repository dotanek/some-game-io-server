import config from '../config/config';
import { ValidatorInterface } from '../interfaces/validator.interface';
import { Vector2D } from '../structures/vector2d';

export class EntityPositionValidator implements ValidatorInterface {
  validate(value: Vector2D): boolean {
    const { x, y } = value;

    const validX = x >= 0 && x <= config.world.width;
    const validY = y >= 0 && y <= config.world.height;

    return validX && validY;
  }
}
