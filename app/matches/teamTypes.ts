export enum SkillLevel {
  PROFI = 200, HIGH = 100, MEDIUM = 50, LOW = 20
}

export interface PlayerModel {
  id: string,
  name: string
  speed: number
  technicalSkill: number
  condition: number,
  anwesend: boolean
}

export interface MatchModel {
  id: number,
  teams: TeamModel[]
  diff: number,
  home: () => TeamModel,
  away: () => TeamModel,
  isSameMatch: (other: MatchModel) => boolean
}

export interface TeamModel {
  overallSkill: number,
  players: PlayerModel[],
}

export interface TeamState {
  players: PlayerModel[], // alle Spieler,
  matches: MatchModel[]
}