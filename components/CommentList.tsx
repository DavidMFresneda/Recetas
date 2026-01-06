import { getCommentsByRecipeId } from '@/lib/db/comments';
import { getProfileById } from '@/lib/db/profiles';
import { getCurrentUser } from '@/lib/auth';
import { CommentItem } from './CommentItem';
import type { Comment } from '@/lib/types/database';

interface CommentListProps {
  recipeId: string;
}

export async function CommentList({ recipeId }: CommentListProps) {
  const comments = await getCommentsByRecipeId(recipeId);
  const currentUser = await getCurrentUser();

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  // Get author profiles for each comment
  const commentsWithAuthors = await Promise.all(
    comments.map(async (comment) => {
      const author = await getProfileById(comment.user_id);
      return {
        comment,
        author,
      };
    })
  );

  return (
    <div className="space-y-0">
      {commentsWithAuthors.map(({ comment, author }) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          author={author}
          currentUserId={currentUser?.id || null}
        />
      ))}
    </div>
  );
}

