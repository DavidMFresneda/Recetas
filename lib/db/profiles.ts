import { createClient } from '@/lib/supabase/server';
import type { Profile, ProfileInsert, ProfileUpdate } from '@/lib/types/database';

/**
 * Get a profile by ID
 */
export async function getProfileById(id: string): Promise<Profile | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

/**
 * Get a profile by username
 */
export async function getProfileByUsername(username: string): Promise<Profile | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (error) {
    console.error('Error fetching profile by username:', error);
    return null;
  }

  return data;
}

/**
 * Get a profile by email
 */
export async function getProfileByEmail(email: string): Promise<Profile | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error fetching profile by email:', error);
    return null;
  }

  return data;
}

/**
 * Get the current user's profile
 */
export async function getCurrentUserProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  return getProfileById(user.id);
}

/**
 * Create a new profile
 */
export async function createProfile(profile: ProfileInsert): Promise<Profile | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .single();

  if (error) {
    console.error('Error creating profile:', error);
    return null;
  }

  return data;
}

/**
 * Update a profile
 */
export async function updateProfile(
  id: string,
  updates: ProfileUpdate
): Promise<Profile | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }

  return data;
}

/**
 * Update the current user's profile
 */
export async function updateCurrentUserProfile(
  updates: ProfileUpdate
): Promise<Profile | null> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  return updateProfile(user.id, updates);
}

/**
 * Check if a username is available
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single();

  if (error && error.code === 'PGRST116') {
    // No rows returned, username is available
    return true;
  }

  if (error) {
    console.error('Error checking username availability:', error);
    return false;
  }

  // Username already exists
  return false;
}

/**
 * Ensure a profile exists for a user, create it if missing
 * This is a safety net in case the trigger fails
 */
export async function ensureProfileExists(userId: string, userEmail?: string, userMetadata?: Record<string, any>): Promise<Profile | null> {
  const supabase = await createClient();
  
  // Check if profile exists
  const existingProfile = await getProfileById(userId);
  if (existingProfile) {
    return existingProfile;
  }

  // Get user data from auth if not provided
  let email = userEmail;
  let metadata = userMetadata;
  
  if (!email || !metadata) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user || user.id !== userId) {
      console.error('Error getting user data for profile creation:', userError);
      return null;
    }
    
    email = user.email || '';
    metadata = user.user_metadata || {};
  }

  if (!email) {
    console.error('Cannot create profile without email');
    return null;
  }

  // Create profile with available data
  const profileData: ProfileInsert = {
    id: userId,
    full_name: 
      metadata.full_name ||
      metadata.display_name ||
      email.split('@')[0] ||
      'User',
    username: metadata.username || null,
    email: email,
    bio: metadata.bio || null,
  };

  return createProfile(profileData);
}

