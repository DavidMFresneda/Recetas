'use server';

import { createClient } from '@/lib/supabase/server';
import { ensureProfileExists } from '@/lib/db/profiles';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * Sign up a new user
 */
export async function signUp(
  formData: FormData
): Promise<void> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('full_name') as string;
  const username = formData.get('username') as string | null;

  if (!email || !password || !fullName) {
    redirect(`/signup?error=${encodeURIComponent('Email, password, and full name are required')}`);
  }

  if (password.length < 6) {
    redirect(`/signup?error=${encodeURIComponent('Password must be at least 6 characters')}`);
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        username: username || null,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  if (data.user) {
    // Ensure profile exists (fallback in case trigger fails)
    await ensureProfileExists(
      data.user.id,
      data.user.email,
      data.user.user_metadata
    );
    revalidatePath('/', 'layout');
    redirect('/dashboard');
  }

  // Fallback: if no user was created, redirect to signup with error
  redirect(`/signup?error=${encodeURIComponent('Failed to create account')}`);
}

/**
 * Sign in an existing user
 */
export async function signIn(
  formData: FormData
): Promise<void> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    redirect(`/login?error=${encodeURIComponent('Email and password are required')}`);
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  // Ensure profile exists for existing users (in case they don't have one)
  if (data.user) {
    await ensureProfileExists(
      data.user.id,
      data.user.email,
      data.user.user_metadata
    );
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

