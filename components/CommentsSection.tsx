import { Suspense } from 'react';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';
import { getCommentCount } from '@/lib/db/comments';
import { MessageSquare } from 'lucide-react';

interface CommentsSectionProps {
  recipeId: string;
}

export async function CommentsSection({ recipeId }: CommentsSectionProps) {
  const commentCount = await getCommentCount(recipeId);

  return (
    <div className="mt-12 pt-8 border-t border-zinc-200">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-zinc-600" />
        <h2 className="text-2xl font-bold text-zinc-900">
          Comments ({commentCount})
        </h2>
      </div>

      <div className="mb-8">
        <CommentForm recipeId={recipeId} />
      </div>

      <Suspense
        fallback={
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border-b border-zinc-200 py-4">
                <div className="h-4 bg-zinc-200 rounded w-32 mb-2" />
                <div className="h-4 bg-zinc-200 rounded w-full" />
                <div className="h-4 bg-zinc-200 rounded w-2/3 mt-2" />
              </div>
            ))}
          </div>
        }
      >
        <CommentList recipeId={recipeId} />
      </Suspense>
    </div>
  );
}

