export interface Organization {
  id: string;
  name: string;
  style_guide: string | null;
  default_settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  organization_id: string | null;
  full_name: string;
  role: "admin" | "editor" | "reporter" | "contributor";
  preferences: Record<string, unknown> | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Story {
  id: string;
  user_id: string;
  organization_id: string | null;
  headline: string;
  slug: string;
  beat: string;
  audience: string;
  tone: string;
  priority: "breaking" | "high" | "medium" | "low";
  status: "draft" | "in_progress" | "review" | "approved" | "published" | "archived";
  embargo_date: string | null;
  assigned_to: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface StoryMaterial {
  id: string;
  story_id: string;
  material_type: "note" | "file" | "url" | "fact" | "quote" | "context" | "timeline";
  content: string | null;
  metadata: Record<string, unknown> | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface GeneratedContent {
  id: string;
  story_id: string;
  format_type: FormatType;
  content: string;
  edited_content: string | null;
  generation_params: Record<string, unknown> | null;
  quality_scores: QualityScores | null;
  version: number;
  is_current: boolean;
  created_by: string;
  edited_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface QualityScores {
  word_count: number;
  char_count: number;
  readability_score: number;
  seo_score: number | null;
  estimated_read_time: number;
}

export interface Comment {
  id: string;
  story_id: string;
  content_id: string | null;
  user_id: string;
  parent_comment_id: string | null;
  comment_text: string;
  resolved: boolean;
  created_at: string;
  updated_at: string;
}

export interface QualityCheck {
  id: string;
  story_id: string;
  check_type: string;
  status: "pass" | "warning" | "fail" | "pending";
  details: Record<string, unknown>;
  checked_at: string;
}

export type FormatType = "breaking" | "web" | "feature" | "twitter" | "linkedin" | "facebook" | "instagram" | "video" | "newsletter" | "audio" | "press";

export interface StoryWithRelations extends Story {
  user_profile?: UserProfile;
  materials?: StoryMaterial[];
  generated_content?: GeneratedContent[];
}
