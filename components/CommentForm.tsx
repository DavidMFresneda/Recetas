'use client';

import { useState, useTransition } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { createCommentAction } from '@/app/actions/comments';

interface CommentFormProps {
  recipeId: string;
}

export function CommentForm({ recipeId }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!content.trim() || isPending) {
      return;
    }

    const formData = new FormData();
    formData.append('content', content);

    startTransition(async () => {
      await createCommentAction(recipeId, formData);
      setContent(''); // Clear form on success
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <textarea
          id="content"
          name="content"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          required
          maxLength={2000}
          disabled={isPending}
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-zinc-500">
          {content.length}/2000 characters
        </p>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!content.trim() || isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {isPending ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
}

