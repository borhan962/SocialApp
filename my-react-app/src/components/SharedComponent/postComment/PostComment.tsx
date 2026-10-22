
import React, { useContext, useEffect, useState } from 'react'
import type { comment } from '../../../types/comment.type'
import { AuthContext } from '../../../context/AuthContext'
import { userDataContext } from '../../../context/userDataContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { likeComment } from '../../../Services/likeAndUnlike.services'
import { ThumbsUp } from 'lucide-react'
import { toast } from 'react-toastify'

export default function PostComment({ comment, postId }: { comment: comment; postId?: string }) {
  const { userToken } = useContext(AuthContext);
  const { userData } = useContext(userDataContext);
  const queryClient = useQueryClient();

  const currentUserId = userData?.data?.user?._id;
  const targetPostId = postId || (typeof comment.post === 'string' ? comment.post : (comment.post as any)?._id);

  const isInitialLiked = Boolean(
    currentUserId &&
    comment.likes?.some((like: any) =>
      typeof like === 'string' ? like === currentUserId : like?._id === currentUserId
    )
  );

  const [isLiked, setIsLiked] = useState<boolean>(isInitialLiked);
  const [likesCount, setLikesCount] = useState<number>(comment.likes?.length || 0);

  useEffect(() => {
    setIsLiked(isInitialLiked);
    setLikesCount(comment.likes?.length || 0);
  }, [comment, currentUserId]);

  const likeMutation = useMutation({
    mutationFn: () => likeComment(userToken!, targetPostId, comment._id),
    onMutate: async () => {
      const prevIsLiked = isLiked;
      const prevCount = likesCount;

      setIsLiked(!prevIsLiked);
      setLikesCount(prevIsLiked ? Math.max(0, prevCount - 1) : prevCount + 1);

      return { prevIsLiked, prevCount };
    },
    onError: (_err, _vars, context) => {
      if (context) {
        setIsLiked(context.prevIsLiked);
        setLikesCount(context.prevCount);
      }
      toast.error("Failed to update like on comment");
    },
    onSettled: () => {
      if (targetPostId) {
        queryClient.invalidateQueries({ queryKey: ["allComments", targetPostId] });
      }
    },
  });

  const formattedDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="flex items-start gap-2.5 py-2.5 group">
      <img 
        src={comment.commentCreator.photo} 
        alt={comment.commentCreator.name} 
        className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-gray-100 dark:border-gray-700 mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 dark:bg-gray-700/60 rounded-2xl px-3.5 py-2.5 inline-block max-w-full">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-[13px] font-semibold text-gray-900 dark:text-white leading-tight">{comment.commentCreator.name}</p>
            <span className="text-[11px] text-gray-400 dark:text-gray-400">@{comment.commentCreator.username}</span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed break-words">{comment.content}</p>
        </div>
        
        {/* Comment actions */}
        <div className="flex items-center gap-3 mt-1 ml-1">
          <span className="text-[11px] text-gray-400 dark:text-gray-400">{formattedDate}</span>
          <button 
            type="button"
            onClick={() => {
              if (!userToken) {
                toast.info("Please login to like comments");
                return;
              }
              likeMutation.mutate();
            }}
            className={`flex items-center gap-1.5 text-[12px] font-semibold transition cursor-pointer select-none ${
              isLiked ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 transition-transform active:scale-125 ${isLiked ? 'fill-blue-600 dark:fill-blue-400 text-blue-600 dark:text-blue-400' : ''}`} />
            <span>Like</span>
            {likesCount > 0 && (
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                isLiked ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}>
                {likesCount}
              </span>
            )}
          </button>

          <button type="button" className="text-[12px] font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer">
            Reply
          </button>
        </div>
      </div>
    </div>
  )
}
