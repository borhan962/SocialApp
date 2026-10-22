import { useContext } from 'react';
import PostCard from '../SharedComponent/PostCard/PostCard';
import { AuthContext } from '../../context/AuthContext';
import { getFeedFollowing } from '../../Services/feedFollowing.services';
import type { postItem } from '../../types/post.type';
import { CustomStyles } from '../loading/loading.tsx';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';


export default function ConnectionPosts() {
  const { userToken } = useContext(AuthContext);

  async function fetchFollowingPosts() {
    try {
      if (userToken) {
        const response = await getFeedFollowing(userToken);
        return response?.data ?? response;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data.message) {
        toast.error(error.response.data.message);
        throw new Error("Failed to load connection posts");
      }
    }
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["connectionPosts", userToken],
    queryFn: fetchFollowingPosts,
    enabled: !!userToken,
    select(data) {
      return data?.posts ?? data;
    },
    retry: 2,
    retryDelay: 3500,
    refetchOnWindowFocus: true,
    gcTime: 5000
  });

  return (
    <div className="mt-4">
      {/* Connection Posts Header */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 mb-4 max-w-xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="p-2.5 text-black dark:text-white">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Following Feed</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Posts from people you follow
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <CustomStyles />
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-red-500 font-medium">Failed to load posts.</p>
        </div>
      ) : data && data.length > 0 ? (
        data.map((post: postItem) => (
          <PostCard key={post.id} post={post} ShowDetails={false} />
        ))
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-10 text-center max-w-xl mx-auto">
          <div className="inline-flex p-4 rounded-full bg-gray-100 dark:bg-gray-700/50 mb-4">
            <Users className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">No posts from connections</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Follow people to see their posts here
          </p>
        </div>
      )}
    </div>
  );
}
