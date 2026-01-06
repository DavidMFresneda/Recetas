import { RecipeCardSkeleton } from './RecipeCardSkeleton';

interface RecipeListSkeletonProps {
  count?: number;
}

export function RecipeListSkeleton({ count = 8 }: RecipeListSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <RecipeCardSkeleton key={index} />
      ))}
    </div>
  );
}

