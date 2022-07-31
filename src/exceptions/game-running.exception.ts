export class GameRunningException extends Error {
  constructor() {
    super('Illegal operation on a running game');
  }
}