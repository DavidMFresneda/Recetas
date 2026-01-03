# Actual Database Schema

This document describes the actual database schema structure that was created manually in Supabase. Use this as the source of truth for all future development.

## Table: `profiles`

User profile information linked to Supabase Auth users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, FK → `auth.users(id)` | User ID from auth system |
| `username` | TEXT | UNIQUE | Optional username |
| `full_name` | TEXT | NOT NULL | User's full name |
| `email` | TEXT | UNIQUE | User's email address |
| `bio` | TEXT | | Optional biography |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

### Indexes
- `idx_profiles_username` - On `username` (partial, where not null)
- `idx_profiles_email` - On `email` (partial, where not null)

### Triggers
- `update_profiles_updated_at` - Automatically updates `updated_at` on row update

---

## Table: `recipes`

Recipe information with ingredients and instructions stored as arrays.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Recipe ID |
| `user_id` | UUID | NOT NULL, FK → `profiles(id)` | Recipe author |
| `title` | TEXT | NOT NULL | Recipe title |
| `description` | TEXT | | Recipe description |
| `ingredients` | TEXT[] | | Array of ingredients |
| `instructions` | TEXT[] | | Array of instruction steps |
| `difficulty` | TEXT | | Difficulty level (e.g., "Easy", "Medium", "Hard") |
| `cooking_time` | INTEGER | | Cooking time in minutes |
| `category` | TEXT | | Recipe category |
| `cover_image_path` | TEXT | | URL or path to the recipe cover image |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |

### Indexes
- `idx_recipes_user_id` - On `user_id`
- `idx_recipes_category` - On `category` (partial, where not null)
- `idx_recipes_created_at` - On `created_at` (DESC)

### Notes
- Ingredients and instructions are stored as PostgreSQL arrays (`TEXT[]`)
- No separate tables for ingredients/steps/tags
- All recipes are public (no status field)

---

## Table: `favorites`

User favorite recipes (junction table).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `user_id` | UUID | NOT NULL, FK → `profiles(id)`, PRIMARY KEY | User who favorited |
| `recipe_id` | UUID | NOT NULL, FK → `recipes(id)`, PRIMARY KEY | Favorited recipe |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | When favorited |

### Indexes
- `idx_favorites_recipe_id` - On `recipe_id`
- `idx_favorites_user_id` - On `user_id`

---

## Table: `reports`

Recipe reporting system for moderation.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Report ID |
| `reporter_id` | UUID | FK → `profiles(id)`, ON DELETE SET NULL | User who reported |
| `recipe_id` | UUID | NOT NULL, FK → `recipes(id)` | Reported recipe |
| `reason` | TEXT | NOT NULL | Reason for report |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | When reported |

### Indexes
- `idx_reports_recipe_id` - On `recipe_id`

---

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### `profiles`
- **SELECT**: Public (anyone can view)
- **INSERT**: Users can only insert their own profile
- **UPDATE**: Users can only update their own profile

### `recipes`
- **SELECT**: Public (all recipes are viewable)
- **INSERT**: Authenticated users can create recipes (must set `user_id = auth.uid()`)
- **UPDATE**: Users can only update their own recipes (`user_id = auth.uid()`)
- **DELETE**: Users can only delete their own recipes (`user_id = auth.uid()`)

### `favorites`
- **SELECT**: Users can only view their own favorites
- **INSERT**: Users can only add favorites for themselves
- **DELETE**: Users can only remove their own favorites

### `reports`
- **SELECT**: Private (admin only via service role)
- **INSERT**: Authenticated users can create reports

---

## TypeScript Type Definitions

For reference when creating TypeScript types:

```typescript
export interface Profile {
  id: string;
  username: string | null;
  full_name: string;
  email: string;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Recipe {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  ingredients: string[];
  instructions: string[];
  difficulty: string | null;
  cooking_time: number | null;
  category: string | null;
  cover_image_path: string | null;
  created_at: string;
}

export interface Favorite {
  user_id: string;
  recipe_id: string;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string | null;
  recipe_id: string;
  reason: string;
  created_at: string;
}
```

---

## Key Differences from Original Plan

1. **Profiles**: Uses `full_name` instead of `display_name`, includes `email` and `bio` fields
2. **Recipes**: 
   - Uses `user_id` instead of `author_id`
   - Stores `ingredients` and `instructions` as arrays instead of separate tables
   - Uses `cooking_time` (single integer) instead of `prep_minutes`/`cook_minutes`/`total_minutes`
   - Uses `category` (single text) instead of `recipe_tags` table
   - Includes `cover_image_path` for recipe cover images
   - No `status`, `slug`, `servings`, `updated_at`, or `published_at` fields
3. **No separate tables**: `recipe_ingredients`, `recipe_steps`, and `recipe_tags` tables do not exist

---

## Migration Notes

If you need to apply these changes to a new database:

1. Run `001_initial_schema.sql` to create tables and indexes
2. Run `002_rls_policies.sql` to enable RLS and create policies
3. Run `004_auto_create_profile.sql` to set up the auto-profile creation trigger
4. Run `003_storage_setup.sql` if you need storage bucket setup (optional)

