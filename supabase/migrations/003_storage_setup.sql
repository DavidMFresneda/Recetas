-- ============================================
-- STORAGE BUCKET SETUP
-- ============================================
-- Note: Storage buckets are typically created via Supabase Dashboard or API
-- This SQL file provides the policies that should be applied after creating the bucket
-- 
-- To create the bucket manually:
-- 1. Go to Supabase Dashboard > Storage
-- 2. Create a new bucket named "recipe-images"
-- 3. Make it public (for published recipes) or private (with policies below)
-- 4. Set file size limit (recommended: 5MB)
-- 5. Set allowed MIME types: image/jpeg, image/png, image/webp, image/gif

-- Enable RLS on storage.objects
-- Note: This is usually enabled by default, but included for completeness

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- Policy: Anyone can view images from recipe-images bucket
-- (This assumes the bucket is set to public)
-- If bucket is private, use this policy instead:
CREATE POLICY "Recipe images are viewable by everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'recipe-images');

-- Policy: Authenticated users can upload images
-- Restrict to their own user folder structure: {user_id}/{filename}
CREATE POLICY "Authenticated users can upload recipe images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'recipe-images' AND
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can update their own images
CREATE POLICY "Users can update their own recipe images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'recipe-images' AND
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'recipe-images' AND
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can delete their own images
-- Also allow deletion if user owns the recipe that references the image
CREATE POLICY "Users can delete their own recipe images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'recipe-images' AND
    auth.uid() IS NOT NULL AND
    (
      -- User owns the folder
      (storage.foldername(name))[1] = auth.uid()::text
      OR
      -- User owns a recipe that references this image
      EXISTS (
        SELECT 1 FROM recipes
        WHERE recipes.cover_image_path = storage.objects.name
        AND recipes.author_id = auth.uid()
      )
    )
  );

-- ============================================
-- HELPER FUNCTION: Get image URL
-- ============================================
-- This function can be used to generate public URLs for images
-- Usage: SELECT get_recipe_image_url('recipe-images', 'user-id/image.jpg');
CREATE OR REPLACE FUNCTION get_recipe_image_url(bucket_name TEXT, file_path TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('app.supabase_url') || '/storage/v1/object/public/' || bucket_name || '/' || file_path;
END;
$$ LANGUAGE plpgsql STABLE;

