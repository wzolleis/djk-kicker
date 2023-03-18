import {MatchModel, PlayerModel, TeamModel} from './teamTypes';
import {combineWithoutRepetitions} from './cominations';
import {Match} from './Match';
import {Team} from './Team';

let matchCounter = 1;

export const calculateMatches = (players: PlayerModel[]): MatchModel[] => {
  const anwesend = players.filter(player => player.anwesend);
  const teams: TeamModel[] = calculatePossibleTeams(anwesend);

  const matches: MatchModel[] = teams.map(team => mapToMatch(team, anwesend));

  // compare matches and check player ids,
  // reduce matches, push only matches into array, if not present (according to previous compare function)
  // return reduced matches
  return removeDuplicates(matches);
};

export const removeDuplicates = (matches: MatchModel[]): MatchModel[] => {
  return matches.reduce((acc: MatchModel[], item: MatchModel) => {
    if (!acc.find(m => m.isSameMatch(item))) {
      acc.push(item);
    }
    return acc;
  }, []);
};

export const calculatePossibleTeams = (players: PlayerModel[]): TeamModel[] => {
  const numberOfPlayersInTeamOne: number = Math.floor(players.length / 2);
  const combinationsTeamOne: PlayerModel[][] = combineWithoutRepetitions(players, numberOfPlayersInTeamOne);
  return mapToTeams(combinationsTeamOne);
};

export const mapToTeams = (options: PlayerModel[][]): TeamModel[] => {
  return options.map((players: PlayerModel[]): TeamModel => mapToTeam(players));
};

const mapToTeam = (players: PlayerModel[]): TeamModel => {
  return new Team(players);
};

export const mapToMatch = (team: TeamModel, allPlayers: PlayerModel[]): MatchModel => {
  const otherTeam: TeamModel = mapToTeam(allPlayers.filter(player => !team.players.includes(player)));

  return new Match(matchCounter++, team, otherTeam);
};