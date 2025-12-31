export type NominationMode = "user" | "link" | "text" | "link_or_text";
export type EventPhase =
  | "nominations"
  | "curation"
  | "voting"
  | "gala"
  | "results";

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  mode: NominationMode;
  display_order: number;
}

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
}

export interface Nomination {
  id: string;
  category_id: number;
  user_id: string | null;
  nominated_user: string | null;
  nominated_link: string | null;
  nominated_text: string | null;
  is_deleted_content: boolean;
  nomination_count: number;
  created_at: string;
}

export interface Finalist {
  id: string;
  category_id: number;
  display_name: string;
  display_handle: string | null;
  display_image: string | null;
  display_description: string | null;
  original_link: string | null;
  vote_count: number;
  final_position: number | null;
  is_revealed: boolean;
  revealed_at: string | null;
  created_at: string;
}

export interface Vote {
  id: string;
  user_id: string;
  finalist_id: string;
  category_id: number;
  created_at: string;
}

export interface PhaseInfo {
  phase: EventPhase;
  message: string;
  endDate: Date | null;
  showCountdown: boolean;
}

export interface EventConfig {
  id: number;
  // Fechas
  nominations_start: string;
  nominations_end: string;
  curation_end: string;
  voting_end: string;
  gala_start: string;
  gala_end: string;
  // Control
  force_phase: EventPhase | null;
  gala_active: boolean;
  results_public: boolean;
  // Metadata
  created_at: string;
  updated_at: string;
}

export interface EventDates {
  nominationsStart: Date;
  nominationsEnd: Date;
  curationEnd: Date;
  votingEnd: Date;
  galaStart: Date;
  galaEnd: Date;
}
