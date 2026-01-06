import { RecipeListSkeleton } from "@/components/RecipeListSkeleton";
import { Header } from "@/components/Header";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900">
      <Header />

      <main className="flex-1">
        {/* Dashboard Header */}
        <section className="border-b border-zinc-100 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="animate-pulse">
                <div className="h-9 bg-zinc-200 rounded w-64 mb-2" />
                <div className="h-6 bg-zinc-200 rounded w-96" />
              </div>
              <div className="h-12 bg-zinc-200 rounded-full w-40 animate-pulse" />
            </div>
          </div>
        </section>

        {/* Search and Filters Skeleton */}
        <section className="py-8 border-b border-zinc-100 bg-zinc-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm animate-pulse">
              <div className="h-6 bg-zinc-200 rounded w-48 mb-4" />
              <div className="h-10 bg-zinc-200 rounded w-full" />
            </div>
          </div>
        </section>

        {/* Recipes Grid Skeleton */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <RecipeListSkeleton />
          </div>
        </section>
      </main>
    </div>
  );
}

