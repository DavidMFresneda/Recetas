/**
 * Database Type Definitions
 * 
 * These types match the actual database schema in Supabase.
 * Update these if the schema changes.
 */

export interface Profile {
  id: string;
  username: string | null;
  full_name: string;
  email: string;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Recipe {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  ingredients: string[];
  instructions: string[];
  difficulty: string | null;
  cooking_time: number | null;
  category: string | null;
  cover_image_path: string | null;
  created_at: string;
}

/**
 * Insert types (for creating new records)
 * These omit auto-generated fields like id and timestamps
 */
export interface ProfileInsert {
  id: string;
  username?: string | null;
  full_name: string;
  email: string;
  bio?: string | null;
}

export interface RecipeInsert {
  user_id: string;
  title: string;
  description?: string | null;
  ingredients?: string[];
  instructions?: string[];
  difficulty?: string | null;
  cooking_time?: number | null;
  category?: string | null;
  cover_image_path?: string | null;
}

/**
 * Update types (for updating existing records)
 * All fields are optional except the id
 */
export interface ProfileUpdate {
  username?: string | null;
  full_name?: string;
  email?: string;
  bio?: string | null;
}

export interface RecipeUpdate {
  title?: string;
  description?: string | null;
  ingredients?: string[];
  instructions?: string[];
  difficulty?: string | null;
  cooking_time?: number | null;
  category?: string | null;
  cover_image_path?: string | null;
}

export interface Like {
  user_id: string;
  recipe_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  recipe_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

/**
 * Insert types for social features
 */
export interface CommentInsert {
  user_id: string;
  recipe_id: string;
  content: string;
}

/**
 * Update types for social features
 */
export interface CommentUpdate {
  content: string;
}
