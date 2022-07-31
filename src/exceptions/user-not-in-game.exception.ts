export class UserNotInGameException extends Error {
  constructor() {
    super('Player does not belong to referenced game');
  }
}
