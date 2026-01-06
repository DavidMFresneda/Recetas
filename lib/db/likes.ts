import { createClient } from '@/lib/supabase/server';
import type { Like } from '@/lib/types/database';

/**
 * Get all likes for a recipe
 */
export async function getLikesByRecipeId(recipeId: string): Promise<Like[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('likes')
    .select('*')
    .eq('recipe_id', recipeId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching likes:', error);
    return [];
  }

  return data || [];
}

/**
 * Get the count of likes for a recipe
 */
export async function getLikeCount(recipeId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('recipe_id', recipeId);

  if (error) {
    console.error('Error counting likes:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Check if a user has liked a recipe
 */
export async function hasUserLiked(recipeId: string, userId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('likes')
    .select('user_id')
    .eq('recipe_id', recipeId)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 means no rows found, which is fine
    console.error('Error checking like:', error);
    return false;
  }

  return !!data;
}

/**
 * Toggle like for a recipe (add if not exists, remove if exists)
 */
export async function toggleLike(recipeId: string, userId: string): Promise<boolean> {
  const supabase = await createClient();

  // Check if like exists
  const hasLiked = await hasUserLiked(recipeId, userId);

  if (hasLiked) {
    // Remove like
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('recipe_id', recipeId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error removing like:', error);
      return false;
    }
    return true;
  } else {
    // Add like
    const { error } = await supabase
      .from('likes')
      .insert({
        user_id: userId,
        recipe_id: recipeId,
      });

    if (error) {
      console.error('Error adding like:', error);
      return false;
    }
    return true;
  }
}

/**
 * Get all recipes that the current user has liked
 */
export async function getCurrentUserLikes(): Promise<Like[]> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('likes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user likes:', error);
    return [];
  }

  return data || [];
}

