import { useContext, useState } from "react";
import { getAllComments } from "../../../Services/allComments.services";
import PostComment from "../postComment/PostComment";
import { AuthContext } from "../../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import type { comment } from "../../../types/comment.type";
import { ChevronDown } from "lucide-react";

type SortType = 'most_relevant' | 'latest';

export default function AllComments({ postId, commentsCount }: { postId: string; commentsCount?: number }) {
  const { userToken } = useContext(AuthContext);
  const [sortBy, setSortBy] = useState<SortType>('most_relevant');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  async function getComments() {
    if (userToken && postId) {
      const response = await getAllComments(userToken, postId);
      return response.data.comments;
    }
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["allComments", postId],
    queryFn: getComments,
    enabled: !!userToken && !!postId,
  });

  // Sort comments based on selected filter
  const sortedComments = data ? [...data].sort((a: comment, b: comment) => {
    if (sortBy === 'latest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    // Most relevant: sort by likes count (most liked first), then by date
    return (b.likes?.length || 0) - (a.likes?.length || 0) || 
           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }) : [];

  if (isLoading) return <p className="text-xs text-gray-400 p-2">Loading comments...</p>;
  if (isError) return <p className="text-xs text-red-400 p-2">Failed to load comments.</p>;

  const displayCount = commentsCount ?? data?.length ?? 0;

  return (
    <div className="mt-3">
      {/* Comments Header with Count and Filter */}
      {displayCount > 0 && (
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100 dark:border-gray-700/60">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">Comments</span>
            <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-transparent dark:border-blue-800/50 text-xs font-bold px-1.5">
              {displayCount}
            </span>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/70 transition text-xs font-medium text-gray-600 dark:text-gray-200 cursor-pointer shadow-xs"
            >
              <span>{sortBy === 'most_relevant' ? 'Most relevant' : 'Latest'}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-500 dark:text-gray-400 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showSortDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
                <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg dark:shadow-black/60 z-20 overflow-hidden py-1">
                  <button
                    onClick={() => { setSortBy('most_relevant'); setShowSortDropdown(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition cursor-pointer ${
                      sortBy === 'most_relevant' 
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold' 
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60'
                    }`}
                  >
                    Most relevant
                  </button>
                  <button
                    onClick={() => { setSortBy('latest'); setShowSortDropdown(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition cursor-pointer ${
                      sortBy === 'latest' 
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold' 
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60'
                    }`}
                  >
                    Latest
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Comments List */}
       <div className="space-y-1">
        {sortedComments?.map((comment: comment) => (
          <PostComment key={comment._id} comment={comment} postId={postId} />
        ))}
      </div> 
    </div>
  );
}
