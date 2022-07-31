import { Vector2D } from '../structures/vector2d';

export const generateRandomPosition = (x1: number, y1: number, x2: number, y2: number): Vector2D => {
  const x = x1 + Math.random() * x2;
  const y = y1 + Math.random() * y2;

  return new Vector2D(x, y);
};