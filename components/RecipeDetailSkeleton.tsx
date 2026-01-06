export function RecipeDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      {/* Back Button Skeleton */}
      <div className="h-6 bg-zinc-200 rounded w-32 mb-6" />

      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 space-y-3">
            <div className="h-10 bg-zinc-200 rounded w-3/4" />
            <div className="h-6 bg-zinc-200 rounded w-full" />
            <div className="h-6 bg-zinc-200 rounded w-2/3" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 bg-zinc-200 rounded w-20" />
            <div className="h-10 bg-zinc-200 rounded w-24" />
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="h-5 bg-zinc-200 rounded w-32" />
          <div className="h-5 bg-zinc-200 rounded w-24" />
          <div className="h-5 bg-zinc-200 rounded w-20" />
        </div>
      </div>

      {/* Cover Image Skeleton */}
      <div className="mb-8 h-64 bg-zinc-200 rounded-2xl" />

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ingredients Skeleton */}
        <div>
          <div className="h-8 bg-zinc-200 rounded w-40 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50">
                <div className="w-6 h-6 rounded-full bg-zinc-200" />
                <div className="flex-1 h-5 bg-zinc-200 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Instructions Skeleton */}
        <div>
          <div className="h-8 bg-zinc-200 rounded w-32 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-zinc-200 rounded w-full" />
                  <div className="h-4 bg-zinc-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="mt-8 pt-8 border-t border-zinc-200">
        <div className="h-4 bg-zinc-200 rounded w-48" />
      </div>
    </div>
  );
}

