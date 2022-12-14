export class PlayerToken {
    gameId: string;
    playerId: string;
    expiresAt: Date;
    issuedAt: Date;
    gameToken: string;

    constructor(gameId: string, playerId: string, expiresAt: Date, issuedAt: Date, gameToken: string) {
        this.gameId = gameId;
        this.playerId = playerId;
        this.expiresAt = expiresAt;
        this.issuedAt = issuedAt;
        this.gameToken = gameToken;
    }
}