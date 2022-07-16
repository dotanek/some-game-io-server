export class GameLeftEvent {
  constructor(public readonly gameId: string, public readonly userId: string) {}
}