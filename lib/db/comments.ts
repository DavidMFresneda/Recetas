import { createClient } from '@/lib/supabase/server';
import type { Comment, CommentInsert, CommentUpdate } from '@/lib/types/database';

/**
 * Get all comments for a recipe, ordered by most recent first
 */
export async function getCommentsByRecipeId(recipeId: string): Promise<Comment[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('recipe_id', recipeId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  return data || [];
}

/**
 * Get a comment by ID
 */
export async function getCommentById(commentId: string): Promise<Comment | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('id', commentId)
    .single();

  if (error) {
    console.error('Error fetching comment:', error);
    return null;
  }

  return data;
}

/**
 * Create a new comment
 */
export async function createComment(comment: CommentInsert): Promise<Comment | null> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error('User not authenticated');
    return null;
  }

  // Ensure user_id matches the authenticated user
  const commentWithUserId = {
    ...comment,
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from('comments')
    .insert(commentWithUserId)
    .select()
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    return null;
  }

  return data;
}

/**
 * Update a comment
 */
export async function updateComment(
  commentId: string,
  updates: CommentUpdate
): Promise<Comment | null> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error('User not authenticated');
    return null;
  }

  // First check if the comment belongs to the user
  const comment = await getCommentById(commentId);
  if (!comment || comment.user_id !== user.id) {
    console.error('Comment not found or user does not have permission');
    return null;
  }

  const { data, error } = await supabase
    .from('comments')
    .update(updates)
    .eq('id', commentId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating comment:', error);
    return null;
  }

  return data;
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error('User not authenticated');
    return false;
  }

  // First check if the comment belongs to the user
  const comment = await getCommentById(commentId);
  if (!comment || comment.user_id !== user.id) {
    console.error('Comment not found or user does not have permission');
    return false;
  }

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting comment:', error);
    return false;
  }

  return true;
}

/**
 * Get the count of comments for a recipe
 */
export async function getCommentCount(recipeId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('recipe_id', recipeId);

  if (error) {
    console.error('Error counting comments:', error);
    return 0;
  }

  return count || 0;
}

