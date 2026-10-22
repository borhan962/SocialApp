import { useContext, useState } from "react"
import { userDataContext } from "../../context/userDataContext"
import { useQuery } from "@tanstack/react-query"
import { getUserPosts } from "../../Services/userPosts.services"
import { AuthContext } from "../../context/AuthContext"
import { CustomStyles } from "../../components/loading/loading"
import PostCard from "../../components/SharedComponent/PostCard/PostCard"
import type { postItem } from "../../types/post.type"
import UploadPhoto from "../../components/SharedComponent/uploadPhoto/UploadPhoto"

import { Mail, Users, FileText, Bookmark, Newspaper } from "lucide-react"


export default function Profile() {

    const {userData } = useContext(userDataContext);
    const {userToken} = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState<'myPosts' | 'saved'>('myPosts');

  

    async function getPosts(){
      if(userData?.data?.user?._id && userToken){
       const response =  await getUserPosts(userToken , userData?.data?.user?._id)
       return response?.data?.posts
      }
    }


   const {data , isLoading , isError} = useQuery({
    queryKey: ["userPosts"],
    queryFn: getPosts,
    enabled: !!userToken && !!userData?.data?.user?._id,
   })


   const savedPosts = data?.filter((post: postItem) => post.bookmarked === true) || [];

   const user = userData?.data?.user;
   const myPostsCount = data?.length ?? 0;
   const savedPostsCount = savedPosts.length;
   const followersCount = user?.followers?.length ?? 0;
   const followingCount = user?.following?.length ?? 0;
   const bookmarksCount = savedPostsCount;

   if(isError) return <p className="text-center text-red-500">there is a problem ...</p>

  return (
    <> 

      <div className="min-h-screen bg-gray-100 dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100 transition-colors duration-200">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-b-2xl shadow-sm border-x border-b border-gray-100 dark:border-gray-700/80 max-w-4xl mx-auto transition-colors">
          
          {/* Cover Photo */}
          <div className="w-full h-[200px] relative">
            <div className="w-full h-full bg-gradient-to-r from-slate-700 via-slate-600 to-blue-800" />
          </div>

          {/* Profile Info Section */}
          <div className="rounded-3xl border border-white/60 dark:border-gray-700/80 bg-white/92 dark:bg-gray-800/90 p-5 backdrop-blur-xl sm:p-7 shadow-sm transition-colors">
            <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16 relative">
              {/* Profile Photo - with upload */}
              <div className="flex-shrink-0 relative">
                <UploadPhoto />
              </div>

              {/* Name + Username + Badge */}
              <div className="flex-1 md:mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">@{user?.username}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-100 dark:border-blue-900/50">
                    <Users className="w-3.5 h-3.5" />
                    Route Posts member
                  </span>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="flex gap-3 flex-wrap md:flex-nowrap">
                <div className="bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 rounded-xl px-5 py-3 text-center min-w-[100px] transition-colors">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider">Followers</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{followersCount}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 rounded-xl px-5 py-3 text-center min-w-[100px] transition-colors">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider">Following</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{followingCount}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 rounded-xl px-5 py-3 text-center min-w-[100px] transition-colors">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider">Bookmarks</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{bookmarksCount}</p>
                </div>
              </div>
            </div>

            {/* About + Stats Row */}
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              {/* About Card */}
              <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 rounded-xl p-4 transition-colors">
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">About</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>Active on Route Posts</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 rounded-xl p-4 transition-colors">
                  <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">My Posts</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{myPostsCount}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 rounded-xl p-4 transition-colors">
                  <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Saved Posts</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{savedPostsCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs + Content Section */}
        <div className="max-w-4xl mx-auto mt-6 pb-10">
          {/* Tab Navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 px-4 mb-4 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('myPosts')}
                  className={`flex items-center gap-2 px-4 py-3.5 text-sm font-semibold border-b-2 transition cursor-pointer ${
                    activeTab === 'myPosts'
                      ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-200 dark:hover:border-gray-700'
                  }`}
                >
                  <Newspaper className="w-4 h-4" />
                  My Posts
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`flex items-center gap-2 px-4 py-3.5 text-sm font-semibold border-b-2 transition cursor-pointer ${
                    activeTab === 'saved'
                      ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-200 dark:hover:border-gray-700'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  Saved
                </button>
              </div>
              
              {/* Post Count */}
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {activeTab === 'myPosts' ? myPostsCount : savedPostsCount}
              </span>
            </div>
          </div>

          {/* My Posts Tab */}
          {activeTab === 'myPosts' && (
            <>
              {isLoading ? (
                <CustomStyles />
              ) : isError ? (
                <p className="text-center text-red-500 dark:text-red-400">Failed to load posts.</p>
              ) : data?.length > 0 ? (
                data.map((post: postItem) => (
                  <PostCard key={post.id} post={post} ShowDetails={false} />
                ))
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-10 text-center mt-4 transition-colors">
                  <div className="inline-flex p-4 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-1">No posts yet</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Create your first post to share with everyone</p>
                </div>
              )}
            </>
          )}

          {/* Saved Tab */}
          {activeTab === 'saved' && (
            <>
              {savedPosts.length > 0 ? (
                savedPosts.map((post: postItem) => (
                  <PostCard key={post.id} post={post} ShowDetails={false} />
                ))
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-10 text-center mt-4 transition-colors">
                  <div className="inline-flex p-4 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                    <Bookmark className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-1">No saved posts</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Bookmark posts to save them for later</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
       
    </>

  )
}
