export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  preferred_locale: string | null;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  user_id: string;
  played_at: string;
  team1_players: string[];
  team2_players: string[];
  winning_team: number | null;
  user_team: number;
  user_player_name: string | null;
  sets_score: Array<{
    games: [number, number];
    tiebreakPlayed: boolean;
    tiebreakScore?: [number, number];
  }>;
  total_points: number;
  match_data: Record<string, unknown>;
  created_at: string;
}

export interface MatchInsert {
  user_id: string;
  played_at?: string;
  team1_players: string[];
  team2_players: string[];
  winning_team: number | null;
  user_team: number;
  user_player_name: string;
  sets_score: Array<{
    games: [number, number];
    tiebreakPlayed: boolean;
    tiebreakScore?: [number, number];
  }>;
  total_points: number;
  match_data: Record<string, unknown>;
}

export interface SharedResult {
  id: string;
  encoded_data: string;
  player_names: string[];
  score_line: string;
  winning_team: number | null;
  created_at: string;
}

export interface SharedResultInsert {
  id: string;
  encoded_data: string;
  player_names: string[];
  score_line: string;
  winning_team: number | null;
}
