'use server';

import { createComment, updateComment, deleteComment as deleteCommentHelper, getCommentById } from '@/lib/db/comments';
import { requireAuth, getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface CommentActionResponse {
  error?: string;
  success?: boolean;
}

const MAX_COMMENT_LENGTH = 2000;

/**
 * Create a new comment
 */
export async function createCommentAction(
  recipeId: string,
  formData: FormData
): Promise<CommentActionResponse> {
  const user = await requireAuth();

  const content = formData.get('content') as string;

  if (!content || content.trim().length === 0) {
    redirect(`/recipes/${recipeId}?error=${encodeURIComponent('Comment content is required')}`);
  }

  if (content.length > MAX_COMMENT_LENGTH) {
    redirect(`/recipes/${recipeId}?error=${encodeURIComponent(`Comment must be less than ${MAX_COMMENT_LENGTH} characters`)}`);
  }

  const comment = await createComment({
    user_id: user.id,
    recipe_id: recipeId,
    content: content.trim(),
  });

  if (!comment) {
    redirect(`/recipes/${recipeId}?error=${encodeURIComponent('Failed to create comment')}`);
  }

  revalidatePath(`/recipes/${recipeId}`);
  return { success: true };
}

/**
 * Update an existing comment
 */
export async function updateCommentAction(
  commentId: string,
  formData: FormData
): Promise<CommentActionResponse> {
  const user = await requireAuth();

  // Verify ownership before processing
  const existingComment = await getCommentById(commentId);
  if (!existingComment) {
    redirect(`/dashboard?error=${encodeURIComponent('Comment not found')}`);
  }

  if (existingComment.user_id !== user.id) {
    redirect(`/recipes/${existingComment.recipe_id}?error=${encodeURIComponent('You do not have permission to edit this comment')}`);
  }

  const content = formData.get('content') as string;

  if (!content || content.trim().length === 0) {
    redirect(`/recipes/${existingComment.recipe_id}?error=${encodeURIComponent('Comment content is required')}`);
  }

  if (content.length > MAX_COMMENT_LENGTH) {
    redirect(`/recipes/${existingComment.recipe_id}?error=${encodeURIComponent(`Comment must be less than ${MAX_COMMENT_LENGTH} characters`)}`);
  }

  const updatedComment = await updateComment(commentId, {
    content: content.trim(),
  });

  if (!updatedComment) {
    redirect(`/recipes/${existingComment.recipe_id}?error=${encodeURIComponent('Failed to update comment')}`);
  }

  revalidatePath(`/recipes/${existingComment.recipe_id}`);
  return { success: true };
}

/**
 * Delete a comment
 */
export async function deleteCommentAction(commentId: string): Promise<void> {
  const user = await requireAuth();

  // Verify ownership before deleting
  const existingComment = await getCommentById(commentId);
  if (!existingComment) {
    redirect(`/dashboard?error=${encodeURIComponent('Comment not found')}`);
  }

  if (existingComment.user_id !== user.id) {
    redirect(`/recipes/${existingComment.recipe_id}?error=${encodeURIComponent('You do not have permission to delete this comment')}`);
  }

  const success = await deleteCommentHelper(commentId);

  if (!success) {
    redirect(`/recipes/${existingComment.recipe_id}?error=${encodeURIComponent('Failed to delete comment')}`);
  }

  revalidatePath(`/recipes/${existingComment.recipe_id}`);
}

