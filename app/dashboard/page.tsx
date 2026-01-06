import Link from "next/link";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { RecipeSearchFilters } from "@/components/RecipeSearchFilters";
import { RecipesGrid } from "@/components/RecipesGrid";
import { CategoriesList } from "@/components/CategoriesList";
import { RecipeListSkeleton } from "@/components/RecipeListSkeleton";
import { requireAuth } from "@/lib/auth";
import { Plus } from "lucide-react";

interface DashboardPageProps {
  searchParams: Promise<{
    search?: string;
    ingredient?: string;
    difficulty?: string;
    category?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  await requireAuth();
  
  const params = await searchParams;

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

        {/* Search and Filters */}
        <section className="py-8 border-b border-zinc-100 bg-zinc-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={
              <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm animate-pulse">
                <div className="h-6 bg-zinc-200 rounded w-48 mb-4" />
                <div className="h-10 bg-zinc-200 rounded w-full" />
              </div>
            }>
              <CategoriesListWrapper searchParams={params} />
            </Suspense>
          </div>
        </section>

        {/* Recipes Grid */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<RecipeListSkeleton />}>
              <RecipesGrid searchParams={params} />
            </Suspense>
          </div>
        </section>
      </main>
    </div>
  );
}

// Wrapper component to fetch categories for the filters
async function CategoriesListWrapper({ searchParams }: { searchParams: { search?: string; ingredient?: string; difficulty?: string; category?: string } }) {
  const categories = await CategoriesList();
  return <RecipeSearchFilters categories={categories} />;
}

