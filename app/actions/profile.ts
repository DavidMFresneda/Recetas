'use server';

import { updateCurrentUserProfile } from '@/lib/db/profiles';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * Update the current user's profile
 */
export async function updateProfile(
  formData: FormData
): Promise<void> {
  const fullName = formData.get('full_name') as string;
  const username = formData.get('username') as string | null;
  const bio = formData.get('bio') as string | null;

  if (!fullName || fullName.trim().length === 0) {
    redirect('/me?error=' + encodeURIComponent('Full name is required'));
  }

  const updates = {
    full_name: fullName.trim(),
    username: username?.trim() || null,
    bio: bio?.trim() || null,
  };

  const updatedProfile = await updateCurrentUserProfile(updates);

  if (!updatedProfile) {
    redirect('/me?error=' + encodeURIComponent('Failed to update profile'));
  }

  revalidatePath('/me');
  redirect('/me?success=true');
}

