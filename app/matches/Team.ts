import {PlayerModel, TeamModel} from './teamTypes';

export class Team implements TeamModel {
  players: PlayerModel[];
  overallSkill: number;

  constructor(players: PlayerModel[]) {
    this.players = players;
    this.overallSkill = this.calculateTeamSkill(players);
  }

  private calculateTeamSkill(players: PlayerModel[]): number {
    return players
      .map(player => player.speed + player.condition + player.technicalSkill)
      .reduce((n1, n2) => n1 + n2);
  }

}