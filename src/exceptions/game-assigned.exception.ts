export class GameAssignedException extends Error {
  constructor() {
    super('Player has a game assigned already');
  }
}