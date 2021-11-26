export class PlayerNotInGameException extends Error {
  constructor() {
    super('Player does not belong to referenced game');
  }
}