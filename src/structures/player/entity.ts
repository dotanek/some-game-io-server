// This represents in-game player properties.
import { Vector2D } from '../vector2d';
import config from "../../config/config";

export class Entity {
  private lastUpdate: number = performance.now();

  constructor(
    private readonly name: string,
    private position: Vector2D,
    private velocity: Vector2D,
    private acceleration: Vector2D,
    private mass: number,
  ) {}

  public update(position: Vector2D, velocity: Vector2D, mass: number) {
    this.position = position;
    this.velocity = velocity;
    this.mass = mass;

    this.lastUpdate = performance.now();
  }

  public getName(): string {
    return this.name;
  }

  public getPosition(): Vector2D {
    return new Vector2D(this.position.x, this.position.y);
  }

  public getVelocity(): Vector2D {
    return new Vector2D(this.velocity.x, this.velocity.y);
  }

  public getMass(): number {
    return this.mass;
  }

  public getApproxPosition(): Vector2D {
    const secondsPassed = (performance.now() - this.lastUpdate) / 1000;
    console.log(secondsPassed);

    let x = this.position.x + this.velocity.x * secondsPassed;
    let y = this.position.y + this.velocity.y * secondsPassed;

    if (x < 0) {
      x = 0;
    } else if (x > config.world.width) {
      x = config.world.width;
    }

    if (y < 0) {
      y = 0;
    } else if (y > config.world.height) {
      y = config.world.height;
    }

    return new Vector2D(x,y);
  }
}
