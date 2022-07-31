export class GameStoppedException extends Error {
  constructor() {
    super('Illegal operation on a stopped game');
  }
}