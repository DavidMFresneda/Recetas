'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Save } from 'lucide-react';
import type { Recipe } from '@/lib/types/database';

interface RecipeFormProps {
  recipe?: Recipe;
  action: (formData: FormData) => void;
  submitLabel?: string;
}

export function RecipeForm({ recipe, action, submitLabel = 'Create Recipe' }: RecipeFormProps) {
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [instructions, setInstructions] = useState<string[]>(['']);

  useEffect(() => {
    if (recipe) {
      setIngredients(
        recipe.ingredients && recipe.ingredients.length > 0 
          ? recipe.ingredients 
          : ['']
      );
      setInstructions(
        recipe.instructions && recipe.instructions.length > 0 
          ? recipe.instructions 
          : ['']
      );
    }
  }, [recipe]);

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index: number, value: string) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  return (
    <form action={action} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-zinc-900 mb-2">
          Recipe Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          defaultValue={recipe?.title || ''}
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 sm:text-sm"
          placeholder="e.g., Creamy Garlic Pasta"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-zinc-900 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={recipe?.description || ''}
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 sm:text-sm resize-none"
          placeholder="A brief description of your recipe..."
        />
      </div>

      {/* Ingredients */}
      <div>
        <label className="block text-sm font-medium text-zinc-900 mb-2">
          Ingredients <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                name={`ingredients[${index}]`}
                value={ingredient}
                onChange={(e) => updateIngredient(index, e.target.value)}
                className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 sm:text-sm"
                placeholder={`Ingredient ${index + 1}`}
              />
              {ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addIngredient}
          className="mt-2 flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-600"
        >
          <Plus className="h-4 w-4" />
          Add Ingredient
        </button>
      </div>

      {/* Instructions */}
      <div>
        <label className="block text-sm font-medium text-zinc-900 mb-2">
          Instructions <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {instructions.map((instruction, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-zinc-500">Step {index + 1}</span>
                </div>
                <textarea
                  name={`instructions[${index}]`}
                  value={instruction}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 sm:text-sm resize-none"
                  placeholder={`Step ${index + 1} instructions...`}
                />
              </div>
              {instructions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="mt-6 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addInstruction}
          className="mt-2 flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-600"
        >
          <Plus className="h-4 w-4" />
          Add Step
        </button>
      </div>

      {/* Additional Fields */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Difficulty */}
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-zinc-900 mb-2">
            Difficulty
          </label>
          <select
            id="difficulty"
            name="difficulty"
            defaultValue={recipe?.difficulty || ''}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 sm:text-sm"
          >
            <option value="">Select difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Cooking Time */}
        <div>
          <label htmlFor="cooking_time" className="block text-sm font-medium text-zinc-900 mb-2">
            Cooking Time (minutes)
          </label>
          <input
            type="number"
            id="cooking_time"
            name="cooking_time"
            min="1"
            defaultValue={recipe?.cooking_time || ''}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 sm:text-sm"
            placeholder="e.g., 30"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-zinc-900 mb-2">
          Category
        </label>
        <input
          type="text"
          id="category"
          name="category"
          defaultValue={recipe?.category || ''}
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 sm:text-sm"
          placeholder="e.g., Pasta, Breakfast, Dessert"
        />
      </div>

      {/* Cover Image URL */}
      <div>
        <label htmlFor="cover_image_path" className="block text-sm font-medium text-zinc-900 mb-2">
          Cover Image URL
        </label>
        <input
          type="url"
          id="cover_image_path"
          name="cover_image_path"
          defaultValue={recipe?.cover_image_path || ''}
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 sm:text-sm"
          placeholder="https://example.com/image.jpg"
        />
        <p className="mt-1 text-xs text-zinc-500">
          URL to the recipe cover image (optional)
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-200">
        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          <Save className="h-4 w-4" />
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

