import {MatchModel, TeamModel} from './teamTypes';

export class Match implements MatchModel {
  id: number;
  teams: TeamModel[];
  diff: number;

  constructor(id: number, home: TeamModel, away: TeamModel) {
    this.id = id;
    this.teams = [home, away];
    this.diff = Math.abs(home.overallSkill - away.overallSkill);
  }

  public isSameMatch(other: MatchModel): boolean {
    const homeAway = this.compareTeams(this.home(), other.away());
    const awayHome = this.compareTeams(this.away(), other.home());

    const homeHome = this.compareTeams(this.home(), other.home());
    const awayAway = this.compareTeams(this.away(), other.away());

    const isHomeAwayVertauscht = homeAway && awayHome;
    const isHomeAwayTheSame = homeHome && awayAway;

    return isHomeAwayTheSame || isHomeAwayVertauscht;
  }

  private compareTeams(left: TeamModel, right: TeamModel): boolean {
    // return _.differenceWith(left.players, right.players, (p1, p2) => p1.id === p2.id).length === 0;
    // return left.players.every( player => right.players.includes(player) )

    const leftIds = left.players.map((p => p.id));
    const rightIds = right.players.map(p => p.id);

    return leftIds.every(id => rightIds.includes(id));

  }

  public home(): TeamModel {
    return this.teams[0];
  }

  public away(): TeamModel {
    return this.teams[1];
  }
}