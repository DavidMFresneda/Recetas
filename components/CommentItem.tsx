'use client';

import { useState, useTransition } from 'react';
import { Edit, Trash2, Save, X, Loader2 } from 'lucide-react';
import { updateCommentAction, deleteCommentAction } from '@/app/actions/comments';
import { formatDistanceToNow } from 'date-fns';
import type { Comment } from '@/lib/types/database';
import type { Profile } from '@/lib/types/database';

interface CommentItemProps {
  comment: Comment;
  author: Profile | null;
  currentUserId: string | null;
}

export function CommentItem({ comment, author, currentUserId }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isPending, startTransition] = useTransition();

  const isOwner = currentUserId === comment.user_id;

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(comment.content);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!editContent.trim() || isPending) {
      return;
    }

    const formData = new FormData();
    formData.append('content', editContent);

    startTransition(async () => {
      await updateCommentAction(comment.id, formData);
      setIsEditing(false);
    });
  };

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      return;
    }

    startTransition(async () => {
      await deleteCommentAction(comment.id);
    });
  };

  const authorName = author?.full_name || author?.username || author?.email || 'Unknown';
  const timeAgo = formatDistanceToNow(new Date(comment.created_at), { addSuffix: true });

  return (
    <div className="border-b border-zinc-200 py-4 last:border-b-0">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-zinc-900">{authorName}</span>
            <span className="text-xs text-zinc-500">{timeAgo}</span>
            {comment.updated_at !== comment.created_at && (
              <span className="text-xs text-zinc-400 italic">(edited)</span>
            )}
          </div>
        </div>
        {isOwner && !isEditing && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="p-1 text-zinc-500 hover:text-orange-500 transition-colors"
              aria-label="Edit comment"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="p-1 text-zinc-500 hover:text-red-500 transition-colors disabled:opacity-50"
              aria-label="Delete comment"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
            required
            maxLength={2000}
            disabled={isPending}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 sm:text-sm disabled:opacity-50"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={!editContent.trim() || isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save
            </button>
          </div>
        </form>
      ) : (
        <p className="text-zinc-700 whitespace-pre-wrap">{comment.content}</p>
      )}
    </div>
  );
}

