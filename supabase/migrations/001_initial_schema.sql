-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ACTUAL TABLE STRUCTURE (Created manually in Supabase)
-- This file documents the actual schema structure
-- ============================================

-- Create profiles table
-- Note: This table structure matches what was created manually in Supabase
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create recipes table
-- Note: This table structure matches what was created manually in Supabase
-- Uses arrays for ingredients and instructions instead of separate tables
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  ingredients TEXT[],
  instructions TEXT[],
  difficulty TEXT,
  cooking_time INTEGER,
  category TEXT,
  cover_image_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



-- ============================================
-- INDEXES
-- ============================================

-- Profiles indexes
CREATE INDEX idx_profiles_username ON profiles(username) WHERE username IS NOT NULL;
CREATE INDEX idx_profiles_email ON profiles(email) WHERE email IS NOT NULL;

-- Recipes indexes
CREATE INDEX idx_recipes_user_id ON recipes(user_id);
CREATE INDEX idx_recipes_category ON recipes(category) WHERE category IS NOT NULL;
CREATE INDEX idx_recipes_created_at ON recipes(created_at DESC);



-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
