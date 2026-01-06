import { Header } from "@/components/Header";
import { RecipeForm } from "@/components/RecipeForm";
import { requireAuth } from "@/lib/auth";
import { getRecipeById } from "@/lib/db/recipes";
import { getCurrentUser } from "@/lib/auth";
import { updateRecipeAction } from "@/app/actions/recipes";
import { ChefHat, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function EditRecipePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAuth();
  
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const recipe = await getRecipeById(id);
  const currentUser = await getCurrentUser();

  if (!recipe) {
    notFound();
  }

  // Verify user owns the recipe
  if (currentUser?.id !== recipe.user_id) {
    redirect(`/recipes/${recipe.id}?error=${encodeURIComponent('You do not have permission to edit this recipe')}`);
  }

  // Create a wrapper action that includes the recipe ID
  async function updateAction(formData: FormData) {
    'use server';
    return updateRecipeAction(id, formData);
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <Link
                href={`/recipes/${recipe.id}`}
                className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Recipe
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <ChefHat className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                    Edit Recipe
                  </h1>
                  <p className="mt-1 text-zinc-600">
                    Update your recipe information
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {resolvedSearchParams.error && (
              <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-800">{resolvedSearchParams.error}</p>
              </div>
            )}

            {/* Recipe Form */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6">
              <RecipeForm 
                recipe={recipe} 
                action={updateAction} 
                submitLabel="Update Recipe" 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

