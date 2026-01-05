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
  avatar_url: string | null;
}

export interface Nomination {
  id: string;
  category_id: number;
  user_id: string | null;
  nominated_user: string | null;
  nominated_link: string | null;
  nominated_text: string | null;
  is_deleted_content: boolean;
}

export interface Finalist {
  id: string;
  category_id: number;
  display_name: string;
  display_handle: string | null;
  display_description: string | null;
  original_link: string | null;
  vote_count: number;
  final_position: number | null;
  is_revealed: boolean;
  revealed_at: string | null;
}

export interface Vote {
  id: string;
  user_id: string;
  finalist_id: string;
  category_id: number;
}

export interface EventConfig {
  id: number;
  nominations_end: string;
  curation_end: string;
  voting_end: string;
  gala_start: string;
  force_phase: EventPhase | null;
  results_public: boolean;
}

// Tipos para joins
export interface FinalistWithCategory extends Finalist {
  category: Category;
}
