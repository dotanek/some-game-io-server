export class GameNotAssignedException extends Error {
  constructor() {
    super('Player does not have a game assigned');
  }
}