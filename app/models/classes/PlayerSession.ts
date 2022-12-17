import { Player } from "@prisma/client";
import { GameToken } from "~/models/classes/GameToken";

export class PlayerSession {
  player: Player;
  gameTokens: GameToken[];

  constructor(player: Player, gameTokens: GameToken[]) {
    this.player = player;
    this.gameTokens = gameTokens;
  }
}
