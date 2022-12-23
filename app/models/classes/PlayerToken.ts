export class PlayerToken {
  gameId: string;
  playerId: string;
  gameToken: string;

  constructor(gameId: string, playerId: string, gameToken: string) {
    this.gameId = gameId;
    this.playerId = playerId;
    this.gameToken = gameToken;
  }
}
