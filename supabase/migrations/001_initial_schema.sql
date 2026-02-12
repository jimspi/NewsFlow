-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  style_guide text,
  default_settings jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User profiles
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations(id),
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'editor', 'reporter', 'contributor')),
  preferences jsonb,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Stories
CREATE TABLE stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  organization_id uuid REFERENCES organizations(id),
  headline text NOT NULL,
  slug text UNIQUE NOT NULL,
  beat text NOT NULL,
  audience text NOT NULL,
  tone text NOT NULL,
  priority text NOT NULL CHECK (priority IN ('breaking', 'high', 'medium', 'low')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'review', 'approved', 'published', 'archived')),
  embargo_date timestamptz,
  assigned_to uuid REFERENCES auth.users(id),
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

CREATE INDEX idx_stories_user_id ON stories(user_id);
CREATE INDEX idx_stories_status ON stories(status);
CREATE INDEX idx_stories_beat ON stories(beat);
CREATE INDEX idx_stories_created_at ON stories(created_at DESC);

-- Story materials
CREATE TABLE story_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid REFERENCES stories(id) ON DELETE CASCADE NOT NULL,
  material_type text NOT NULL CHECK (material_type IN ('note', 'file', 'url', 'fact', 'quote', 'context', 'timeline')),
  content text,
  metadata jsonb,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_story_materials_story_id ON story_materials(story_id);

-- Generated content
CREATE TABLE generated_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid REFERENCES stories(id) ON DELETE CASCADE NOT NULL,
  format_type text NOT NULL CHECK (format_type IN ('breaking', 'web', 'feature', 'twitter', 'linkedin', 'facebook', 'instagram', 'video', 'newsletter', 'audio', 'press')),
  content text NOT NULL,
  edited_content text,
  generation_params jsonb,
  quality_scores jsonb,
  version integer NOT NULL DEFAULT 1,
  is_current boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users(id) NOT NULL,
  edited_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_generated_content_story_id ON generated_content(story_id);
CREATE INDEX idx_generated_content_current ON generated_content(is_current);

-- Content versions
CREATE TABLE content_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES generated_content(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  version integer NOT NULL,
  edited_by uuid REFERENCES auth.users(id) NOT NULL,
  change_summary text,
  created_at timestamptz DEFAULT now()
);

-- Comments
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid REFERENCES stories(id) ON DELETE CASCADE NOT NULL,
  content_id uuid REFERENCES generated_content(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  parent_comment_id uuid REFERENCES comments(id),
  comment_text text NOT NULL,
  position jsonb,
  resolved boolean NOT NULL DEFAULT false,
  resolved_by uuid REFERENCES auth.users(id),
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_comments_story_id ON comments(story_id);

-- Quality checks
CREATE TABLE quality_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid REFERENCES stories(id) ON DELETE CASCADE NOT NULL,
  check_type text NOT NULL CHECK (check_type IN ('fact_consistency', 'attribution', 'balance', 'readability', 'seo', 'legal', 'bias', 'plagiarism')),
  status text NOT NULL CHECK (status IN ('pass', 'warning', 'fail', 'pending')),
  details jsonb NOT NULL,
  checked_at timestamptz DEFAULT now()
);

CREATE INDEX idx_quality_checks_story_id ON quality_checks(story_id);

-- Story analytics
CREATE TABLE story_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid REFERENCES stories(id) ON DELETE CASCADE NOT NULL,
  metric_type text NOT NULL,
  value numeric NOT NULL,
  metadata jsonb,
  recorded_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own stories" ON stories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create stories" ON stories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own stories" ON stories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own stories" ON stories FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can manage story materials" ON story_materials FOR ALL
  USING (EXISTS (SELECT 1 FROM stories WHERE stories.id = story_materials.story_id AND stories.user_id = auth.uid()));

CREATE POLICY "Users can manage generated content" ON generated_content FOR ALL
  USING (EXISTS (SELECT 1 FROM stories WHERE stories.id = generated_content.story_id AND stories.user_id = auth.uid()));

CREATE POLICY "Users can view content versions" ON content_versions FOR SELECT
  USING (EXISTS (SELECT 1 FROM generated_content gc JOIN stories s ON s.id = gc.story_id WHERE gc.id = content_versions.content_id AND s.user_id = auth.uid()));
CREATE POLICY "Users can create content versions" ON content_versions FOR INSERT WITH CHECK (auth.uid() = edited_by);

CREATE POLICY "Users can manage comments" ON comments FOR ALL
  USING (EXISTS (SELECT 1 FROM stories WHERE stories.id = comments.story_id AND stories.user_id = auth.uid()));

CREATE POLICY "Users can view quality checks" ON quality_checks FOR SELECT
  USING (EXISTS (SELECT 1 FROM stories WHERE stories.id = quality_checks.story_id AND stories.user_id = auth.uid()));
CREATE POLICY "System can insert quality checks" ON quality_checks FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view analytics" ON story_analytics FOR SELECT
  USING (EXISTS (SELECT 1 FROM stories WHERE stories.id = story_analytics.story_id AND stories.user_id = auth.uid()));
CREATE POLICY "System can insert analytics" ON story_analytics FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own org" ON organizations FOR SELECT
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.organization_id = organizations.id AND user_profiles.id = auth.uid()));

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON stories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_story_materials_updated_at BEFORE UPDATE ON story_materials FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_generated_content_updated_at BEFORE UPDATE ON generated_content FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
