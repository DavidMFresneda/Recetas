import { Suspense } from "react";
import { Header } from "@/components/Header";
import { RecipeDetailContent } from "@/components/RecipeDetailContent";
import { RecipeDetailSkeleton } from "@/components/RecipeDetailSkeleton";
import { requireAuth } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function RecipeDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAuth();
  
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          {/* Error Message */}
          {resolvedSearchParams.error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-800">{resolvedSearchParams.error}</p>
            </div>
          )}

          {/* Recipe Content with Suspense */}
          <Suspense fallback={<RecipeDetailSkeleton />}>
            <RecipeDetailContent recipeId={id} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

