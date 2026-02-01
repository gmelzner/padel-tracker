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
  user_team: number | null;
  user_player_name: string | null;
  sets_score: Array<{
    games: [number, number];
    tiebreakPlayed: boolean;
    tiebreakScore?: [number, number];
  }>;
  total_points: number;
  match_data: Record<string, unknown>;
  source_shared_id: string | null;
  created_at: string;
}

export interface MatchInsert {
  user_id: string;
  played_at?: string;
  team1_players: string[];
  team2_players: string[];
  winning_team: number | null;
  user_team: number | null;
  user_player_name: string | null;
  sets_score: Array<{
    games: [number, number];
    tiebreakPlayed: boolean;
    tiebreakScore?: [number, number];
  }>;
  total_points: number;
  match_data: Record<string, unknown>;
  source_shared_id?: string;
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

// --- Tournaments ---

export type TournamentType = "tournament" | "open_court";
export type TournamentCategory = "open" | "amateur" | "advanced" | "pro";
export type TournamentStatus = "pending" | "published" | "cancelled" | "completed";

export interface Tournament {
  id: string;
  name_es: string;
  name_en: string;
  description_es: string | null;
  description_en: string | null;
  city: string;
  address: string | null;
  date_start: string | null;
  date_end: string | null;
  type: TournamentType;
  category: TournamentCategory | null;
  price: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  contact_whatsapp: string | null;
  external_url: string | null;
  image_url: string | null;
  status: TournamentStatus;
  submitted_by: string | null;
  approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface TournamentInsert {
  name_es: string;
  name_en: string;
  description_es?: string;
  description_en?: string;
  city: string;
  address?: string;
  date_start?: string;
  date_end?: string;
  type: TournamentType;
  category?: TournamentCategory;
  price?: string;
  contact_phone?: string;
  contact_email?: string;
  contact_whatsapp?: string;
  external_url?: string;
  image_url?: string;
  submitted_by: string;
}
