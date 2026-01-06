import { createClient } from '@/lib/supabase/server';
import type { Recipe, RecipeInsert, RecipeUpdate } from '@/lib/types/database';

/**
 * Get a recipe by ID
 */
export async function getRecipeById(id: string): Promise<Recipe | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }

  return data;
}

/**
 * Get all recipes
 */
export async function getAllRecipes(): Promise<Recipe[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }

  return data || [];
}

/**
 * Get recipes by user ID
 */
export async function getRecipesByUserId(userId: string): Promise<Recipe[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user recipes:', error);
    return [];
  }

  return data || [];
}

/**
 * Get recipes by category
 */
export async function getRecipesByCategory(category: string): Promise<Recipe[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching recipes by category:', error);
    return [];
  }

  return data || [];
}

/**
 * Get recipes by difficulty
 */
export async function getRecipesByDifficulty(difficulty: string): Promise<Recipe[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('difficulty', difficulty)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching recipes by difficulty:', error);
    return [];
  }

  return data || [];
}

/**
 * Search recipes by title or description
 */
export async function searchRecipes(query: string): Promise<Recipe[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching recipes:', error);
    return [];
  }

  return data || [];
}

/**
 * Get recipes with filters
 */
export async function getRecipesWithFilters(filters: {
  category?: string;
  difficulty?: string;
  maxCookingTime?: number;
  search?: string;
  ingredient?: string;
}): Promise<Recipe[]> {
  const supabase = await createClient();
  
  let query = supabase
    .from('recipes')
    .select('*');

  if (filters.category) {
    query = query.eq('category', filters.category);
  }

  if (filters.difficulty) {
    query = query.eq('difficulty', filters.difficulty);
  }

  if (filters.maxCookingTime) {
    query = query.lte('cooking_time', filters.maxCookingTime);
  }

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching filtered recipes:', error);
    return [];
  }

  let recipes = data || [];

  // Filter by ingredient (client-side since ingredients is an array)
  if (filters.ingredient && filters.ingredient.trim()) {
    const ingredientLower = filters.ingredient.toLowerCase().trim();
    recipes = recipes.filter(recipe => {
      if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) {
        return false;
      }
      return recipe.ingredients.some((ing: string) => 
        ing.toLowerCase().includes(ingredientLower)
      );
    });
  }

  return recipes;
}

/**
 * Get current user's recipes
 */
export async function getCurrentUserRecipes(): Promise<Recipe[]> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }

  return getRecipesByUserId(user.id);
}

/**
 * Create a new recipe
 */
export async function createRecipe(recipe: RecipeInsert): Promise<Recipe | null> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return null;
  }

  // Ensure user_id matches the authenticated user
  const recipeWithUserId = {
    ...recipe,
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from('recipes')
    .insert(recipeWithUserId)
    .select()
    .single();

  if (error) {
    console.error('Error creating recipe:', error);
    return null;
  }

  return data;
}

/**
 * Update a recipe
 */
export async function updateRecipe(
  id: string,
  updates: RecipeUpdate
): Promise<Recipe | null> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return null;
  }

  // First check if the recipe belongs to the user
  const recipe = await getRecipeById(id);
  if (!recipe || recipe.user_id !== user.id) {
    console.error('Recipe not found or user does not have permission');
    return null;
  }

  const { data, error } = await supabase
    .from('recipes')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating recipe:', error);
    return null;
  }

  return data;
}

/**
 * Delete a recipe
 */
export async function deleteRecipe(id: string): Promise<boolean> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return false;
  }

  // First check if the recipe belongs to the user
  const recipe = await getRecipeById(id);
  if (!recipe || recipe.user_id !== user.id) {
    console.error('Recipe not found or user does not have permission');
    return false;
  }

  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting recipe:', error);
    return false;
  }

  return true;
}

/**
 * Get latest recipes (paginated)
 */
export async function getLatestRecipes(limit: number = 10): Promise<Recipe[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching latest recipes:', error);
    return [];
  }

  return data || [];
}

