-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
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

-- Anyone can view published recipes, authors can view their own (including drafts)
CREATE POLICY "Recipes are viewable by everyone if published, or by author"
  ON recipes FOR SELECT
  USING (
    status = 'published' OR 
    (auth.uid() IS NOT NULL AND author_id = auth.uid())
  );

-- Only authenticated users can create recipes
CREATE POLICY "Authenticated users can create recipes"
  ON recipes FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    author_id = auth.uid()
  );

-- Only recipe authors can update their recipes
CREATE POLICY "Users can update their own recipes"
  ON recipes FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Only recipe authors can delete their recipes
CREATE POLICY "Users can delete their own recipes"
  ON recipes FOR DELETE
  USING (auth.uid() = author_id);

-- ============================================
-- RECIPE_INGREDIENTS POLICIES
-- ============================================

-- Ingredients are viewable if parent recipe is viewable
CREATE POLICY "Recipe ingredients are viewable if recipe is viewable"
  ON recipe_ingredients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_ingredients.recipe_id
      AND (
        recipes.status = 'published' OR 
        (auth.uid() IS NOT NULL AND recipes.author_id = auth.uid())
      )
    )
  );

-- Only recipe owners can manage ingredients
CREATE POLICY "Recipe owners can insert ingredients"
  ON recipe_ingredients FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_ingredients.recipe_id
      AND recipes.author_id = auth.uid()
    )
  );

CREATE POLICY "Recipe owners can update ingredients"
  ON recipe_ingredients FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_ingredients.recipe_id
      AND recipes.author_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_ingredients.recipe_id
      AND recipes.author_id = auth.uid()
    )
  );

CREATE POLICY "Recipe owners can delete ingredients"
  ON recipe_ingredients FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_ingredients.recipe_id
      AND recipes.author_id = auth.uid()
    )
  );

-- ============================================
-- RECIPE_STEPS POLICIES
-- ============================================

-- Steps are viewable if parent recipe is viewable
CREATE POLICY "Recipe steps are viewable if recipe is viewable"
  ON recipe_steps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_steps.recipe_id
      AND (
        recipes.status = 'published' OR 
        (auth.uid() IS NOT NULL AND recipes.author_id = auth.uid())
      )
    )
  );

-- Only recipe owners can manage steps
CREATE POLICY "Recipe owners can insert steps"
  ON recipe_steps FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_steps.recipe_id
      AND recipes.author_id = auth.uid()
    )
  );

CREATE POLICY "Recipe owners can update steps"
  ON recipe_steps FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_steps.recipe_id
      AND recipes.author_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_steps.recipe_id
      AND recipes.author_id = auth.uid()
    )
  );

CREATE POLICY "Recipe owners can delete steps"
  ON recipe_steps FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_steps.recipe_id
      AND recipes.author_id = auth.uid()
    )
  );

-- ============================================
-- RECIPE_TAGS POLICIES
-- ============================================

-- Tags are viewable if parent recipe is viewable
CREATE POLICY "Recipe tags are viewable if recipe is viewable"
  ON recipe_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_tags.recipe_id
      AND (
        recipes.status = 'published' OR 
        (auth.uid() IS NOT NULL AND recipes.author_id = auth.uid())
      )
    )
  );

-- Only recipe owners can manage tags
CREATE POLICY "Recipe owners can insert tags"
  ON recipe_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_tags.recipe_id
      AND recipes.author_id = auth.uid()
    )
  );

CREATE POLICY "Recipe owners can delete tags"
  ON recipe_tags FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_tags.recipe_id
      AND recipes.author_id = auth.uid()
    )
  );

-- ============================================
-- FAVORITES POLICIES
-- ============================================

-- Users can only view their own favorites
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

-- Users can add favorites
CREATE POLICY "Users can add favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can remove their own favorites
CREATE POLICY "Users can remove their own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- REPORTS POLICIES
-- ============================================

-- Only authenticated users can create reports
CREATE POLICY "Authenticated users can create reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Reports are private (admin only access via service role key)
-- For MVP, we'll restrict SELECT to prevent users from seeing reports
-- Admin access should use service role key directly
CREATE POLICY "Reports are not publicly viewable"
  ON reports FOR SELECT
  USING (false);

