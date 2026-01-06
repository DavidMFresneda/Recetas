'use client';

import { useState, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { toggleLikeAction } from '@/app/actions/likes';
import { useRouter } from 'next/navigation';

interface LikeButtonProps {
  recipeId: string;
  initialLikeCount: number;
  initialHasLiked: boolean;
}

export function LikeButton({ recipeId, initialLikeCount, initialHasLiked }: LikeButtonProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggleLike = () => {
    // Optimistic update
    const newHasLiked = !hasLiked;
    const newLikeCount = newHasLiked ? likeCount + 1 : likeCount - 1;

    setHasLiked(newHasLiked);
    setLikeCount(newLikeCount);

    startTransition(async () => {
      const result = await toggleLikeAction(recipeId);
      if (result.error) {
        // Revert optimistic update on error
        setHasLiked(hasLiked);
        setLikeCount(likeCount);
      } else {
        // Refresh to get accurate count
        router.refresh();
      }
    });
  };

  return (
    <button
      onClick={handleToggleLike}
      disabled={isPending}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        hasLiked
          ? 'bg-red-50 text-red-600 hover:bg-red-100'
          : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      aria-label={hasLiked ? 'Remove like' : 'Like recipe'}
    >
      <Heart
        className={`h-5 w-5 ${hasLiked ? 'fill-red-600' : ''}`}
      />
      <span>{likeCount}</span>
    </button>
  );
}

