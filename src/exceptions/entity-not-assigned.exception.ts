export class EntityNotAssignedException extends Error {
  constructor() {
    super('Player does not have an entity assigned');
  }
}