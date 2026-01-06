import { RecipeDetailSkeleton } from "@/components/RecipeDetailSkeleton";
import { Header } from "@/components/Header";
import { ArrowLeft } from "lucide-react";

export default function RecipeDetailLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button Skeleton */}
          <div className="inline-flex items-center gap-2 text-sm text-zinc-600 mb-6 animate-pulse">
            <ArrowLeft className="h-4 w-4" />
            <div className="h-4 bg-zinc-200 rounded w-32" />
          </div>

          <RecipeDetailSkeleton />
        </div>
      </main>
    </div>
  );
}

