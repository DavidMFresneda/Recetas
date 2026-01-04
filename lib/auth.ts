import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Require authentication - redirects to login if not authenticated
 * @param redirectTo Optional path to redirect to after login
 */
export async function requireAuth(redirectTo?: string): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    const loginUrl = redirectTo
      ? `/login?redirect=${encodeURIComponent(redirectTo)}`
      : '/login';
    redirect(loginUrl);
  }

  return user;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

