import { getAllRecipes } from "@/lib/db/recipes";

export async function CategoriesList() {
  const allRecipes = await getAllRecipes();
  const uniqueCategories = Array.from(
    new Set(
      allRecipes
        .map(recipe => recipe.category)
        .filter((cat): cat is string => !!cat)
    )
  ).sort();

  return uniqueCategories;
}

