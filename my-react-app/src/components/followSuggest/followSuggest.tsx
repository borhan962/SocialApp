import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { userDataContext } from "../../context/userDataContext";
import { showFollowSuggest } from "../../Services/followSuggest.services";
import { follow } from "../../Services/followSuggest.services";

import {Skeleton} from "@heroui/react";

import { useQuery } from "@tanstack/react-query";
import { UserPlus, UserCheck, RefreshCw, Sparkles, User as UserIcon } from "lucide-react";
import { toast } from "react-toastify";

export interface UserSuggestion {
  _id?: string;
  id?: string;
  name: string;
  username?: string;
  photo?: string;
  email?: string;
}

export default function FollowSuggest() {
  const { userToken } = useContext(AuthContext);
  const userContext = useContext(userDataContext);
  const currentUserId = userContext?.userData?.data?.user?._id || userContext?.userData?._id;

  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const [showAll, setShowAll] = useState(false);


  async function getFollowSuggest(): Promise<UserSuggestion[]> {
    if (!userToken) return [];
    const response = await showFollowSuggest(userToken);
    let rawList: any[] = [];
    if (Array.isArray(response)) {
      rawList = response;
    } else if (Array.isArray(response?.data?.suggestions)) {
      rawList = response.data.suggestions;
    } else if (Array.isArray(response?.data?.users)) {
      rawList = response.data.users;
    } else if (Array.isArray(response?.suggestions)) {
      rawList = response.suggestions;
    } else if (Array.isArray(response?.users)) {
      rawList = response.users;
    } else if (Array.isArray(response?.data)) {
      rawList = response.data;
    }

    return rawList
      .map((item: any) => (item?.user ? { ...item.user, ...item } : item))
      .filter((u: any) => u && (u.name || u.username));
  }

  const {
    data: suggestions = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["followSuggest", userToken],
    queryFn: getFollowSuggest,
    enabled: !!userToken,
    staleTime: 1000 * 60 * 5,
  });

  // Filter out the logged-in user from suggestions
  const filteredUsers = suggestions.filter((user) => {
    const userId = user._id || user.id;
    return !currentUserId || userId !== currentUserId;
  });

  const displayedUsers = showAll ? filteredUsers : filteredUsers.slice(0, 5);

  const handleToggleFollow = async (user: UserSuggestion) => {
    const userId = user._id || user.id;
    if (!userToken || !userId) {
      toast.error("Please login to follow users");
      return;
    }

    const isCurrentlyFollowing = !!followingMap[userId];

    try {
      const response = await follow(userToken, userId);

      setFollowingMap((prev) => ({
        ...prev,
        [userId]: !isCurrentlyFollowing,
      }));

      if (!isCurrentlyFollowing) {
        toast.success(response?.message || `You are now following ${user.name}`);
      } else {
        toast.info(response?.message || `Unfollowed ${user.name}`);
      }
    } catch (error: any) {
      console.error("Follow error:", error);
      toast.error(error.response?.data?.message || "Failed to update follow status");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/60 shadow-sm p-4 sticky top-20 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700/50 ">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
              Who to follow
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Suggested for you
            </p>
          </div>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          title="Refresh suggestions"
          className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-600" : ""}`} />
        </button>
      </div>

      {/* Content */}
      <div className="mt-3 divide-y divide-gray-50 dark:divide-gray-700/40 cursor-pointer">
        {isLoading ? (
          // Skeleton Loading
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex items-center justify-between py-2.5 animate-pulse">
               <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-36 rounded-lg" />
        <Skeleton className="h-3 w-24 rounded-lg" />
      </div>
    </div>
               <Skeleton className="h-8 w-18 rounded-full" />
            </div>
          ))
        ) : isError ? (
          // Error State
          <div className="py-6 text-center">
            <p className="text-xs text-red-500 dark:text-red-400 mb-2 font-medium">
              Couldn't load suggestions
            </p>
            <button
              onClick={() => refetch()}
              className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
            >
              Try again
            </button>
          </div>
        ) : filteredUsers.length === 0 ? (
          // Empty State
          <div className="py-6 text-center text-gray-400 dark:text-gray-500">
            <UserIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs font-medium">No suggestions right now</p>
          </div>
        ) : (
          // Suggestions List
          displayedUsers.map((user, idx) => {
            const userId = user._id || user.id || user.username || String(idx);
            const isFollowing = !!followingMap[userId];

            return (
              <div
                key={userId}
                className="flex items-center justify-between py-2.5 group hover:bg-gray-50/70 dark:hover:bg-gray-700/30 -mx-2 px-2 rounded-xl transition-colors"
              >
                {/* User Info */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                  <div className="relative shrink-0">
                    <img
                      src={
                        user.photo ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.name || "User"
                        )}&background=3b82f6&color=fff&bold=true`
                      }
                      alt={user.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.name || "User"
                        )}&background=3b82f6&color=fff&bold=true`;
                      }}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-blue-400/40 transition-all"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {user.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                      {user.username
                        ? `@${user.username}`
                        : user.email
                        ? `@${user.email.split("@")[0]}`
                        : "suggested"}
                    </p>
                  </div>
                </div>

                {/* Follow Button */}
                <button

                  type="button"
                  onClick={() => handleToggleFollow(user)}
                  className={`cursor-pointer shrink-0 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1 transition-all active:scale-95 ${
                    isFollowing
                      ? "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 group/btn"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs hover:shadow-sm"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5 group-hover/btn:hidden text-green-600" />
                      <span className="group-hover/btn:hidden">Following</span>
                      <span className="hidden group-hover/btn:inline">Unfollow</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer / Show More */}
      {filteredUsers.length > 5 && (
        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/50">
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full text-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 py-1 cursor-pointer transition-colors"
          >
            {showAll ? "Show less" : `Show more (${filteredUsers.length - 5} more)`}
          </button>
        </div>
      )}

      {/* Subtle Bottom Credits */}
      <div className="mt-3 pt-2 text-[11px] text-gray-400 dark:text-gray-500 flex flex-wrap gap-x-2 gap-y-1">
        <span className="hover:underline cursor-pointer">About</span>
        <span>·</span>
        <span className="hover:underline cursor-pointer">Help</span>
        <span>·</span>
        <span className="hover:underline cursor-pointer">Privacy</span>
        <span>·</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </div>
  );
}
