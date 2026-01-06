'use server';

import { createRecipe, updateRecipe, deleteRecipe as deleteRecipeHelper, getRecipeById } from '@/lib/db/recipes';
import { requireAuth, getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface RecipeActionResponse {
  error?: string;
  success?: boolean;
}

/**
 * Create a new recipe
 */
export async function createRecipeAction(
  formData: FormData
): Promise<RecipeActionResponse> {
  const user = await requireAuth();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string | null;
  const difficultyRaw = formData.get('difficulty') as string | null;
  const cookingTime = formData.get('cooking_time') as string | null;
  const category = formData.get('category') as string | null;
  const coverImagePath = formData.get('cover_image_path') as string | null;

  // Convert difficulty to lowercase and validate
  const validDifficulties = ['easy', 'medium', 'hard'];
  const difficulty = difficultyRaw 
    ? validDifficulties.includes(difficultyRaw.toLowerCase()) 
      ? difficultyRaw.toLowerCase() 
      : null
    : null;

  // Parse ingredients array
  const ingredients: string[] = [];
  let ingredientIndex = 0;
  while (formData.get(`ingredients[${ingredientIndex}]`)) {
    const ingredient = formData.get(`ingredients[${ingredientIndex}]`) as string;
    if (ingredient.trim()) {
      ingredients.push(ingredient.trim());
    }
    ingredientIndex++;
  }

  // Parse instructions array
  const instructions: string[] = [];
  let instructionIndex = 0;
  while (formData.get(`instructions[${instructionIndex}]`)) {
    const instruction = formData.get(`instructions[${instructionIndex}]`) as string;
    if (instruction.trim()) {
      instructions.push(instruction.trim());
    }
    instructionIndex++;
  }

  if (!title || title.trim().length === 0) {
    redirect('/recipes/new?error=' + encodeURIComponent('Title is required'));
  }

  if (ingredients.length === 0) {
    redirect('/recipes/new?error=' + encodeURIComponent('At least one ingredient is required'));
  }

  if (instructions.length === 0) {
    redirect('/recipes/new?error=' + encodeURIComponent('At least one instruction is required'));
  }

  const recipeData = {
    user_id: user.id,
    title: title.trim(),
    description: description?.trim() || null,
    ingredients,
    instructions,
    difficulty: difficulty || null,
    cooking_time: cookingTime ? parseInt(cookingTime, 10) : null,
    category: category?.trim() || null,
    cover_image_path: coverImagePath?.trim() || null,
  };

  const newRecipe = await createRecipe(recipeData);

  if (!newRecipe) {
    redirect('/recipes/new?error=' + encodeURIComponent('Failed to create recipe'));
  }

  revalidatePath('/dashboard');
  redirect(`/recipes/${newRecipe.id}`);
}

/**
 * Update an existing recipe
 */
export async function updateRecipeAction(
  recipeId: string,
  formData: FormData
): Promise<RecipeActionResponse> {
  const user = await requireAuth();

  // Verify ownership before processing
  const existingRecipe = await getRecipeById(recipeId);
  if (!existingRecipe) {
    redirect(`/dashboard?error=${encodeURIComponent('Recipe not found')}`);
  }
  
  if (existingRecipe.user_id !== user.id) {
    redirect(`/recipes/${recipeId}?error=${encodeURIComponent('You do not have permission to edit this recipe')}`);
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string | null;
  const difficultyRaw = formData.get('difficulty') as string | null;
  const cookingTime = formData.get('cooking_time') as string | null;
  const category = formData.get('category') as string | null;
  const coverImagePath = formData.get('cover_image_path') as string | null;

  // Convert difficulty to lowercase and validate
  const validDifficulties = ['easy', 'medium', 'hard'];
  const difficulty = difficultyRaw 
    ? validDifficulties.includes(difficultyRaw.toLowerCase()) 
      ? difficultyRaw.toLowerCase() 
      : null
    : null;

  // Parse ingredients array
  const ingredients: string[] = [];
  let ingredientIndex = 0;
  while (formData.get(`ingredients[${ingredientIndex}]`)) {
    const ingredient = formData.get(`ingredients[${ingredientIndex}]`) as string;
    if (ingredient.trim()) {
      ingredients.push(ingredient.trim());
    }
    ingredientIndex++;
  }

  // Parse instructions array
  const instructions: string[] = [];
  let instructionIndex = 0;
  while (formData.get(`instructions[${instructionIndex}]`)) {
    const instruction = formData.get(`instructions[${instructionIndex}]`) as string;
    if (instruction.trim()) {
      instructions.push(instruction.trim());
    }
    instructionIndex++;
  }

  if (!title || title.trim().length === 0) {
    redirect(`/recipes/${recipeId}/edit?error=` + encodeURIComponent('Title is required'));
  }

  if (ingredients.length === 0) {
    redirect(`/recipes/${recipeId}/edit?error=` + encodeURIComponent('At least one ingredient is required'));
  }

  if (instructions.length === 0) {
    redirect(`/recipes/${recipeId}/edit?error=` + encodeURIComponent('At least one instruction is required'));
  }

  const updates = {
    title: title.trim(),
    description: description?.trim() || null,
    ingredients,
    instructions,
    difficulty: difficulty || null,
    cooking_time: cookingTime ? parseInt(cookingTime, 10) : null,
    category: category?.trim() || null,
    cover_image_path: coverImagePath?.trim() || null,
  };

  const updatedRecipe = await updateRecipe(recipeId, updates);

  if (!updatedRecipe) {
    redirect(`/recipes/${recipeId}/edit?error=` + encodeURIComponent('Failed to update recipe. You may not have permission to edit this recipe.'));
  }

  revalidatePath('/dashboard');
  revalidatePath(`/recipes/${recipeId}`);
  redirect(`/recipes/${updatedRecipe.id}`);
}

/**
 * Delete a recipe
 */
export async function deleteRecipeAction(recipeId: string): Promise<void> {
  const user = await requireAuth();

  // Verify ownership before deleting
  const existingRecipe = await getRecipeById(recipeId);
  if (!existingRecipe) {
    redirect(`/dashboard?error=${encodeURIComponent('Recipe not found')}`);
  }
  
  if (existingRecipe.user_id !== user.id) {
    redirect(`/recipes/${recipeId}?error=${encodeURIComponent('You do not have permission to delete this recipe')}`);
  }

  const success = await deleteRecipeHelper(recipeId);

  if (!success) {
    redirect(`/recipes/${recipeId}?error=` + encodeURIComponent('Failed to delete recipe.'));
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

