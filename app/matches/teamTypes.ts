export interface PlayerModel {
  id: string,
  name: string
  playerNumber: number
  speed: number
  technicalSkill: number
  condition: number,
  anwesend: boolean
  position: string
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