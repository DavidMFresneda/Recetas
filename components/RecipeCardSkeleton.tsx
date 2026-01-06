export function RecipeCardSkeleton() {
  return (
    <article className="h-full flex flex-col animate-pulse">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-200" />
      <div className="mt-4 flex-1 flex flex-col space-y-3">
        <div className="h-6 bg-zinc-200 rounded w-3/4" />
        <div className="h-4 bg-zinc-200 rounded w-full" />
        <div className="h-4 bg-zinc-200 rounded w-2/3" />
        <div className="flex items-center gap-4 mt-3">
          <div className="h-4 bg-zinc-200 rounded w-16" />
          <div className="h-4 bg-zinc-200 rounded w-24" />
        </div>
      </div>
    </article>
  );
}

