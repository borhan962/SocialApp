import { useContext } from "react";
import { userDataContext } from "../../context/userDataContext";
import { AuthContext } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getUserPosts } from "../../Services/userPosts.services";
import { CustomStyles } from "../loading/loading";
import PostCard from "../SharedComponent/PostCard/PostCard";
import type { postItem } from "../../types/post.type";
import { User } from "lucide-react";

export default function MyPosts() {
  const { userData } = useContext(userDataContext);
  const { userToken } = useContext(AuthContext);

  async function getPosts() {
    if (userData?.data?.user?._id && userToken) {
      const response = await getUserPosts(userToken, userData?.data?.user?._id);
      return response?.data?.posts ?? response?.posts ?? response;
    }
    return [];
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userPosts", userData?.data?.user?._id],
    queryFn: getPosts,
    enabled: !!userToken && !!userData?.data?.user?._id,
    retry: 2,
    retryDelay: 3500,
    refetchOnWindowFocus: true,
  });

  return (
    <div className="mt-4">
      {/* My Posts Header */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 mb-4 max-w-xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="p-2.5 text-black dark:text-white">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">My Posts</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {data?.length ?? 0} {data?.length === 1 ? "post" : "posts"} published by you
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <CustomStyles />
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-red-500 font-medium">Failed to load your posts.</p>
        </div>
      ) : data && data.length > 0 ? (
        data.map((post: postItem) => (
          <PostCard key={post.id} post={post} ShowDetails={false} />
        ))
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-10 text-center max-w-xl mx-auto">
          <div className="inline-flex p-4 rounded-full bg-gray-100 dark:bg-gray-700/50 mb-4">
            <User className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">No posts yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create your first post to share with everyone
          </p>
        </div>
      )}
    </div>
  );
}
