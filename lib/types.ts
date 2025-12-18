// Database Types
export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string;
}

export interface Dream {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  interpretation: string | null;
  mood: string | null;
  keywords: string[] | null;
  is_lucid: boolean;
  dream_date: string;
  created_at: string;
}

export interface DreamAnalysis {
  title: string;
  interpretation: string;
  mood: string;
  keywords: string[];
}

// Form Types
export interface CreateDreamInput {
  content: string;
  dream_date?: string;
  is_lucid?: boolean;
}

export interface UpdateDreamInput {
  content?: string;
  title?: string;
  interpretation?: string;
  mood?: string;
  keywords?: string[];
  is_lucid?: boolean;
  dream_date?: string;
}

