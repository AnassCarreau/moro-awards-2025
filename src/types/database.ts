export type NominationMode = 'user' | 'link' | 'text' | 'link_or_text' | 'proposal'
export type EventPhase = 'proposals' | 'nominations' | 'curation' | 'voting' | 'gala' | 'results'

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  mode: NominationMode
  is_special: boolean
  special_title: string | null
  display_order: number
  created_at: string
}

export interface Profile {
  id: string
  username: string | null
  avatar_url: string | null
  provider: string | null
  twitter_handle: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Nomination {
  id: string
  category_id: number
  user_id: string | null
  nominated_user: string | null
  nominated_link: string | null
  nominated_text: string | null
  is_deleted_content: boolean
  title_proposal: string | null
  nomination_count: number
  created_at: string
}

export interface Finalist {
  id: string
  category_id: number
  display_name: string
  display_handle: string | null
  display_image: string | null
  display_description: string | null
  original_link: string | null
  vote_count: number
  final_position: number | null
  is_revealed: boolean
  revealed_at: string | null
  created_at: string
}

export interface Vote {
  id: string
  user_id: string
  finalist_id: string
  category_id: number
  created_at: string
}

export interface TitleProposal {
  id: string
  user_id: string | null
  proposed_title: string
  vote_count: number
  created_at: string
}

export interface EventConfig {
  id: number
  current_phase: EventPhase
  phase_start_date: string | null
  phase_end_date: string | null
  gala_active: boolean
  results_public: boolean
  updated_at: string
}

export interface PhaseInfo {
  phase: EventPhase
  message: string
  endDate: Date | null
  showCountdown: boolean
}