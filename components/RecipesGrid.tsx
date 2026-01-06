import Link from "next/link";
import { getRecipesWithFilters, getAllRecipes } from "@/lib/db/recipes";
import { getProfileById } from "@/lib/db/profiles";
import { getLikeCount } from "@/lib/db/likes";
import { getCommentCount } from "@/lib/db/comments";
import { formatDifficulty } from "@/lib/utils/format";
import { Clock, ChefHat, Heart, MessageSquare } from "lucide-react";
import type { Recipe } from "@/lib/types/database";

interface RecipesGridProps {
  searchParams: {
    search?: string;
    ingredient?: string;
    difficulty?: string;
    category?: string;
  };
}

export async function RecipesGrid({ searchParams }: RecipesGridProps) {
  // Get all recipes to extract unique categories
  const allRecipes = await getAllRecipes();
  
  // Apply filters if any are present
  const hasFilters = searchParams.search || searchParams.ingredient || searchParams.difficulty || searchParams.category;
  const recipes = hasFilters
    ? await getRecipesWithFilters({
        search: searchParams.search,
        ingredient: searchParams.ingredient,
        difficulty: searchParams.difficulty,
        category: searchParams.category,
      })
    : allRecipes;

  // Get author profiles, like counts, and comment counts for each recipe
  const recipesWithAuthors = await Promise.all(
    recipes.map(async (recipe) => {
      const author = await getProfileById(recipe.user_id);
      const likeCount = await getLikeCount(recipe.id);
      const commentCount = await getCommentCount(recipe.id);
      return {
        ...recipe,
        author: author ? (author.full_name || author.username || author.email) : 'Unknown',
        likeCount,
        commentCount,
      };
    })
  );

  if (recipesWithAuthors.length === 0) {
    return (
      <div className="text-center py-12">
        <ChefHat className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">
          No recipes found
        </h3>
        <p className="text-zinc-600 mb-6">
          {hasFilters 
            ? "Try adjusting your search or filters."
            : "Be the first to share a recipe with the community!"
          }
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
          {hasFilters ? 'Filtered Recipes' : 'All Recipes'}
        </h2>
        <p className="mt-2 text-zinc-600">
          {recipesWithAuthors.length} recipe{recipesWithAuthors.length !== 1 ? 's' : ''} {hasFilters ? 'found' : 'shared by the community'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {recipesWithAuthors.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/recipes/${recipe.id}`}
            className="group"
          >
            <article className="h-full flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-100">
                {recipe.cover_image_path ? (
                  <img
                    src={recipe.cover_image_path}
                    alt={recipe.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-100">
                    <ChefHat className="h-12 w-12 text-orange-400" />
                  </div>
                )}
                {recipe.category && (
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-900 backdrop-blur-sm">
                      {recipe.category}
                    </span>
                  </div>
                )}
                {recipe.difficulty && (
                  <div className="absolute top-3 right-3">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-900 backdrop-blur-sm">
                      {formatDifficulty(recipe.difficulty)}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-4 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-zinc-900 group-hover:text-orange-500 transition-colors">
                  {recipe.title}
                </h3>
                {recipe.description && (
                  <p className="mt-1 text-sm text-zinc-600 line-clamp-2">
                    {recipe.description}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
                  {recipe.cooking_time && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {recipe.cooking_time} min
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {recipe.likeCount}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {recipe.commentCount}
                  </div>
                  <span>by {recipe.author}</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </>
  );
}

