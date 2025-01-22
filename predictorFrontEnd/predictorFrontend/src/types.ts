export interface Team {
  id: string;
  name: string;
  logo: string;
}

export interface Match {
  id: string;
  home: Team;
  away: Team;
  homeScore: number;
  awayScore: number;
  etapa: string;
  matchDate: string;
  status: string;
}

export interface Predictie {
  id: string;
  user: string;
  match: Match;
  predictedHomeScore: number;
  predictedAwayScore: number;
  predictionDate: string;
  points: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  simplePoints: number;
  advancedPoints: number;
}

export interface Leaderboard {
  id: string;
  code: string;
  name: string;
  owner: User;
  users: User[];
  privacy: string;
}

export interface TeamStanding {
  name: string;
  points: number;
}
