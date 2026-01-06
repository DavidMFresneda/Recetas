-- ============================================
-- MIGRATE EXISTING USERS WITHOUT PROFILES
-- ============================================
-- This migration creates profiles for users that exist in auth.users
-- but don't have a corresponding profile in the profiles table
-- Run this once to fix existing users

-- Insert profiles for users that don't have one
INSERT INTO public.profiles (id, full_name, username, email, bio)
SELECT 
  au.id,
  COALESCE(
    NULLIF(au.raw_user_meta_data->>'full_name', ''),
    NULLIF(au.raw_user_meta_data->>'display_name', ''),
    CASE 
      WHEN au.email IS NOT NULL THEN split_part(au.email, '@', 1)
      ELSE 'User'
    END
  ) as full_name,
  NULL as username,
  au.email,
  NULLIF(au.raw_user_meta_data->>'bio', '') as bio
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
  AND au.email IS NOT NULL  -- Only migrate users with email
ON CONFLICT (id) DO NOTHING;

-- Verify the migration
-- You can run this query to check if there are still users without profiles:
-- SELECT au.id, au.email 
-- FROM auth.users au
-- LEFT JOIN public.profiles p ON au.id = p.id
-- WHERE p.id IS NULL;

