import Link from "next/link";
import { Header } from "@/components/Header";
import { requireAuth } from "@/lib/auth";
import { getAllRecipes } from "@/lib/db/recipes";
import { getProfileById } from "@/lib/db/profiles";
import { Clock, ChefHat, Plus } from "lucide-react";
import type { Recipe } from "@/lib/types/database";

export default async function DashboardPage() {
  await requireAuth();
  
  const recipes = await getAllRecipes();

  // Get author profiles for each recipe
  const recipesWithAuthors = await Promise.all(
    recipes.map(async (recipe) => {
      const author = await getProfileById(recipe.user_id);
      return {
        ...recipe,
        author: author ? (author.full_name || author.username || author.email) : 'Unknown',
      };
    })
  );

  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900">
      <Header />

      <main className="flex-1">
        {/* Dashboard Header */}
        <section className="border-b border-zinc-100 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                  Recipe Dashboard
                </h1>
                <p className="mt-2 text-zinc-600">
                  Discover and share amazing recipes with the community
                </p>
              </div>
              <Link
                href="/recipes/new"
                className="flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600"
              >
                <Plus className="h-4 w-4" />
                Create Recipe
              </Link>
            </div>
          </div>
        </section>

        {/* Recipes Grid */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {recipesWithAuthors.length === 0 ? (
              <div className="text-center py-12">
                <ChefHat className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                  No recipes yet
                </h3>
                <p className="text-zinc-600 mb-6">
                  Be the first to share a recipe with the community!
                </p>
                <Link
                  href="/recipes/new"
                  className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600"
                >
                  <Plus className="h-4 w-4" />
                  Create Your First Recipe
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                    All Recipes
                  </h2>
                  <p className="mt-2 text-zinc-600">
                    {recipesWithAuthors.length} recipe{recipesWithAuthors.length !== 1 ? 's' : ''} shared by the community
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
                                {recipe.difficulty}
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
                            <span>by {recipe.author}</span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

