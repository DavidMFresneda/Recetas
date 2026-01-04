# Database Setup Guide

This guide will help you set up the Supabase database for the Recipe Sharing Platform.

## Prerequisites

- A Supabase project with email authentication enabled
- Access to your Supabase project dashboard

## Step 1: Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** → **API**
4. You'll need:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys" → "anon public")

## Step 2: Set Up Environment Variables

1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Open `.env.local` and fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 3: Run Database Migrations

### Option A: Using Supabase SQL Editor (Recommended for Quick Setup)

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run each migration file in order:
   - Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
   - Click "Run" to execute
   - Repeat for `002_rls_policies.sql`
   - Repeat for `003_storage_setup.sql`

### Option B: Using Supabase CLI (For Version Control)

If you have Supabase CLI installed:

```bash
# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## Step 4: Create Storage Bucket

1. Go to **Storage** in your Supabase Dashboard
2. Click **New bucket**
3. Name it: `recipe-images`
4. Choose **Public bucket** (for published recipes) or **Private bucket** (with RLS policies)
5. Set file size limit: **5MB** (recommended)
6. Set allowed MIME types: `image/jpeg, image/png, image/webp, image/gif`
7. Click **Create bucket**

**Note:** If you chose a private bucket, the storage policies in `003_storage_setup.sql` will handle access control.

## Step 5: Verify Setup

### Check Tables

1. Go to **Table Editor** in Supabase Dashboard
2. You should see these tables:
   - `profiles`
   - `recipes`


### Check RLS Policies

1. Go to **Authentication** → **Policies**
2. Verify that RLS is enabled on all tables
3. Check that policies are created for each table

### Test Storage

1. Go to **Storage** → **recipe-images**
2. Try uploading a test image (if bucket is public)
3. Verify the image URL is accessible

## Database Schema Overview

### Tables

- **profiles**: User profile information linked to `auth.users`
- **recipes**: Main recipe table with metadata


### Key Features

- **Automatic timestamps**: `created_at` and `updated_at` are automatically managed
- **Total time calculation**: `total_minutes` is auto-calculated from `prep_minutes` + `cook_minutes`
- **Published date**: `published_at` is automatically set when recipe status changes to 'published'
- **Row Level Security**: All tables have RLS enabled with appropriate policies

## Next Steps

1. **Create Profile Trigger** (Optional): Set up a trigger to auto-create a profile when a user signs up
2. **Test Authentication**: Implement login/signup pages
3. **Test Database**: Create a test recipe to verify everything works

## Troubleshooting

### Migration Errors

- **"relation already exists"**: Tables may already exist. Drop them first or skip existing objects.
- **"permission denied"**: Ensure you're using the correct database role (usually `postgres` or service role)

### RLS Policy Issues

- **Can't read recipes**: Check that recipes have `status = 'published'` or you're the author
- **Can't insert**: Verify you're authenticated (`auth.uid()` is not null)

### Storage Issues

- **Can't upload**: Check bucket permissions and storage policies
- **Image not accessible**: Verify bucket is public or policies allow access

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)

