-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Anyone can read profiles (public)
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- RECIPES POLICIES
-- ============================================

-- Anyone can view all recipes (public)
-- Note: Since recipes table doesn't have a status field, all recipes are public
CREATE POLICY "Recipes are viewable by everyone"
  ON recipes FOR SELECT
  USING (true);

-- Only authenticated users can create recipes
-- Users can only create recipes with their own user_id
CREATE POLICY "Authenticated users can create recipes"
  ON recipes FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    user_id = auth.uid()
  );

-- Only recipe owners can update their recipes
CREATE POLICY "Users can update their own recipes"
  ON recipes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Only recipe owners can delete their recipes
CREATE POLICY "Users can delete their own recipes"
  ON recipes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- REPORTS POLICIES
-- ============================================

-- Only authenticated users can create reports
-- CREATE POLICY "Authenticated users can create reports"
--   ON reports FOR INSERT
--   WITH CHECK (auth.uid() IS NOT NULL);

-- -- Reports are private (admin only access via service role key)
-- -- For MVP, we'll restrict SELECT to prevent users from seeing reports
-- -- Admin access should use service role key directly
-- CREATE POLICY "Reports are not publicly viewable"
--   ON reports FOR SELECT
--   USING (false);
