import { Header } from "@/components/Header";
import { RecipeForm } from "@/components/RecipeForm";
import { requireAuth } from "@/lib/auth";
import { createRecipeAction } from "@/app/actions/recipes";
import { ChefHat, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewRecipePage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  await requireAuth();

  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <ChefHat className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                    Create New Recipe
                  </h1>
                  <p className="mt-1 text-zinc-600">
                    Share your culinary creation with the community
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {searchParams.error && (
              <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-800">{searchParams.error}</p>
              </div>
            )}

            {/* Recipe Form */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6">
              <RecipeForm action={createRecipeAction} submitLabel="Create Recipe" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

