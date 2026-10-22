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
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-800">Comments</span>
            <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] rounded-full bg-blue-100 text-blue-700 text-xs font-bold px-1.5">
              {displayCount}
            </span>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition text-xs font-medium text-gray-600 cursor-pointer"
            >
              <span>{sortBy === 'most_relevant' ? 'Most relevant' : 'Latest'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showSortDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
                <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                  <button
                    onClick={() => { setSortBy('most_relevant'); setShowSortDropdown(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition cursor-pointer ${
                      sortBy === 'most_relevant' 
                        ? 'bg-blue-50 text-blue-700 font-semibold' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Most relevant
                  </button>
                  <button
                    onClick={() => { setSortBy('latest'); setShowSortDropdown(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition cursor-pointer ${
                      sortBy === 'latest' 
                        ? 'bg-blue-50 text-blue-700 font-semibold' 
                        : 'text-gray-700 hover:bg-gray-50'
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
