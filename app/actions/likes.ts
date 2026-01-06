'use server';

import { toggleLike } from '@/lib/db/likes';
import { requireAuth, getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export interface LikeActionResponse {
  error?: string;
  success?: boolean;
}

/**
 * Server action to toggle like on a recipe
 */
export async function toggleLikeAction(recipeId: string): Promise<LikeActionResponse> {
  const user = await requireAuth();

  const success = await toggleLike(recipeId, user.id);

  if (!success) {
    return {
      error: 'Failed to toggle like',
    };
  }

  // Revalidate the recipe detail page and dashboard
  revalidatePath(`/recipes/${recipeId}`);
  revalidatePath('/dashboard');

  return {
    success: true,
  };
}

