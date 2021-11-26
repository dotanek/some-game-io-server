export class ValidationFailedException extends Error {
  constructor(message: string) {
    super(message);
  }
}