import { Suspense } from "react";
import { getRecipeById } from "@/lib/db/recipes";
import { getProfileById } from "@/lib/db/profiles";
import { getCurrentUser } from "@/lib/auth";
import { getLikeCount, hasUserLiked } from "@/lib/db/likes";
import { formatDifficulty } from "@/lib/utils/format";
import { ChefHat, Clock, Edit, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteRecipeButton } from "./DeleteRecipeButton";
import { LikeButton } from "./LikeButton";
import { CommentsSection } from "./CommentsSection";

interface RecipeDetailContentProps {
  recipeId: string;
}

export async function RecipeDetailContent({ recipeId }: RecipeDetailContentProps) {
  const recipe = await getRecipeById(recipeId);
  const currentUser = await getCurrentUser();

  if (!recipe) {
    notFound();
  }

  const author = await getProfileById(recipe.user_id);
  const isOwner = currentUser?.id === recipe.user_id;

  // Get like data
  const likeCount = await getLikeCount(recipe.id);
  const userHasLiked = currentUser ? await hasUserLiked(recipe.id, currentUser.id) : false;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Error Message */}
      <div className="mb-6">
        {/* Error message will be handled by parent component */}
      </div>

      {/* Recipe Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-2">
              {recipe.title}
            </h1>
            {recipe.description && (
              <p className="text-lg text-zinc-600 mb-4">
                {recipe.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {currentUser && (
              <LikeButton
                recipeId={recipe.id}
                initialLikeCount={likeCount}
                initialHasLiked={userHasLiked}
              />
            )}
            {isOwner && (
              <>
                <Link
                  href={`/recipes/${recipe.id}/edit`}
                  className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Link>
                <DeleteRecipeButton recipeId={recipe.id} recipeTitle={recipe.title} />
              </>
            )}
          </div>
        </div>

        {/* Recipe Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>
              by {author?.full_name || author?.username || author?.email || 'Unknown'}
            </span>
          </div>
          {recipe.cooking_time && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{recipe.cooking_time} minutes</span>
            </div>
          )}
          {recipe.difficulty && (
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800">
              {formatDifficulty(recipe.difficulty)}
            </span>
          )}
          {recipe.category && (
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-800">
              {recipe.category}
            </span>
          )}
        </div>
      </div>

      {/* Cover Image */}
      {recipe.cover_image_path && (
        <div className="mb-8 rounded-2xl overflow-hidden">
          <img
            src={recipe.cover_image_path}
            alt={recipe.title}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ingredients */}
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-orange-500" />
            Ingredients
          </h2>
          <ul className="space-y-2">
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50 border border-zinc-200"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-semibold flex items-center justify-center mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-zinc-900">{ingredient}</span>
                </li>
              ))
            ) : (
              <li className="text-zinc-500 italic">No ingredients listed</li>
            )}
          </ul>
        </div>

        {/* Instructions */}
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">Instructions</h2>
          <ol className="space-y-4">
            {recipe.instructions && recipe.instructions.length > 0 ? (
              recipe.instructions.map((instruction, index) => (
                <li
                  key={index}
                  className="flex gap-4"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div className="flex-1 pt-1">
                    <p className="text-zinc-900 leading-relaxed">{instruction}</p>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-zinc-500 italic">No instructions provided</li>
            )}
          </ol>
        </div>
      </div>

      {/* Recipe Footer */}
      <div className="mt-8 pt-8 border-t border-zinc-200 text-sm text-zinc-500">
        <p>
          Created on {new Date(recipe.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Comments Section */}
      <Suspense fallback={
        <div className="mt-12 pt-8 border-t border-zinc-200">
          <div className="h-8 bg-zinc-200 rounded w-48 mb-6 animate-pulse" />
          <div className="h-24 bg-zinc-200 rounded mb-8 animate-pulse" />
        </div>
      }>
        <CommentsSection recipeId={recipe.id} />
      </Suspense>
    </div>
  );
}

