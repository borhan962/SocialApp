import { useState } from 'react'
import type { postItem } from '../../../types/post.type'
import AllComments from '../allComments/AllComments'
import CreateComment from '../createComment/CreateComment'
import ShareModal from '../ShareModal/ShareModal'
import { DropDownList } from '../../DropDownList/DropDownList'
import { useContext } from 'react'
import { userDataContext } from '../../../context/userDataContext'
import {AuthContext} from '../../../context/AuthContext'
import {likePosts} from '../../../Services/likeAndUnlike.services'
import { useQueryClient } from '@tanstack/react-query'
import { ThumbsUp, MessageCircle, Share2 } from 'lucide-react'


export default function PostCard({post, ShowDetails}: {post: postItem , ShowDetails: boolean}) {

 const {userData} = useContext(userDataContext)
 const {userToken} = useContext(AuthContext)
 const queryClient = useQueryClient();
 const [showComments, setShowComments] = useState(ShowDetails);
 const [isShareOpen, setIsShareOpen] = useState(false);

  const isLiked = post.likes?.includes(userData?.data?.user?._id);
  const postBody = post.body || (post as any).content || (post as any).caption || (post as any).text;
  const sharedPostData = (post.isShare || post.sharedPost) && typeof post.sharedPost === 'object' && post.sharedPost !== null
    ? post.sharedPost
    : null;

  async function likes(id:string) {
    if (!userToken) return;
    try {
      await likePosts(userToken, id);
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    } catch {
      
    }
  }

  return (
 <>

 {/* Post skeleton card  */}
 
    <div className="bg-white my-4 dark:bg-gray-800 border border-gray-100 dark:border-gray-700/80 rounded-2xl shadow-sm max-w-xl w-full mx-auto transition-colors">
      <div className="p-4">

        {/* Post Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-3">
            <img className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-gray-100 dark:border-gray-700"
                 src={post.user?.photo || "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"}
                 alt="User Avatar"/>
            <div className="text-sm min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <a href="#" className="font-semibold text-gray-900 dark:text-white hover:underline hover:text-blue-700 dark:hover:text-blue-400">
                  {post.user?.name}
                </a>
                {(post.isShare || post.sharedPost) && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                    shared a post
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                @{post.user?.username}
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ""}
                <span className="text-gray-300">·</span>
                <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-400 text-[11px]">Public</span>
              </p>
            </div>
          </div>
          <div aria-label="More options" className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-1.5 -mt-1 -mr-1.5">
           <DropDownList postId={post.id || post._id} isBookmarked={post.bookmarked} postUserId={post.user?._id} showDetails={ShowDetails} />
          </div>
        </div>

        {/* Post Content (What the user typed when creating or sharing) */}
        {postBody && (
          <div className="text-sm text-gray-800 dark:text-gray-200 mb-3 break-words leading-relaxed whitespace-pre-line">
            <p>{postBody}</p>
          </div>
        )}

        {/* Media (Direct Post Image) */}
        {post.image && (
          <div className="mb-3 -mx-4 sm:mx-0 sm:rounded-xl overflow-hidden">
            <img src={post.image} alt="Post media content" className="w-full object-cover"/>
          </div>
        )}

        {/* Embedded Original Post (when this post is a shared post) */}
        {sharedPostData && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-3.5 bg-gray-50/70 dark:bg-gray-900/40 my-3 space-y-2.5">
            {/* Original Author */}
            <div className="flex items-center gap-2.5">
              <img
                src={sharedPostData.user?.photo || "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"}
                alt={sharedPostData.user?.name || "Original Author"}
                className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                  {sharedPostData.user?.name || "Author"}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  {sharedPostData.createdAt ? new Date(sharedPostData.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ""}
                </p>
              </div>
            </div>

            {/* Original Post Body */}
            {(sharedPostData.body || sharedPostData.content || sharedPostData.caption || sharedPostData.text) && (
              <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line break-words">
                {sharedPostData.body || sharedPostData.content || sharedPostData.caption || sharedPostData.text}
              </p>
            )}

            {/* Original Post Image */}
            {sharedPostData.image && (
              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 max-h-72">
                <img
                  src={sharedPostData.image}
                  alt="Original post attachment"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2 px-1">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500">
                <ThumbsUp className="w-3 h-3 text-white" />
              </div>
              <span className="hover:text-blue-600 hover:underline cursor-pointer font-medium">{post.likesCount} likes</span>
            </div>
            <div className="flex items-center gap-3">
                <span className="hover:text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
                  <Share2 className="w-3.5 h-3.5" />
                  {post.sharesCount} shares
                </span>
                <span 
                  className="hover:text-blue-600 hover:underline cursor-pointer flex items-center gap-1" 
                  onClick={() => setShowComments(!showComments)}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  {post.commentsCount} comments
                </span>
                {!ShowDetails && (
                  <span className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer font-medium text-[11px]"
                    onClick={() => window.location.href = `/PostDetails/${post.id}`}
                  >
                    View details
                  </span>
                )}
            </div>
        </div>
      
        {/* Action Buttons - Like, Comment, Share */}
        <div className="border-t border-gray-100 dark:border-gray-700/80 pt-1 mt-1">
          <div className="flex justify-around">
            {/* Like Button */}
            <button 
              onClick={() => likes(post.id)} 
              className={`flex items-center gap-2 py-2.5 px-4 rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 group flex-1 justify-center
                ${isLiked ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'}`}
            >
              <ThumbsUp className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isLiked ? 'fill-blue-600 dark:fill-blue-400' : ''}`} />
              <span className="text-sm font-semibold">Like</span>
            </button>

            {/* Comment Button */}
            <button 
              onClick={() => setShowComments(!showComments)} 
              className="flex items-center gap-2 py-2.5 px-4 rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 group flex-1 justify-center"
            >
              <MessageCircle className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="text-sm font-semibold">Comment</span>
            </button>

            {/* Share Button */}
            <button 
              type="button"
              onClick={() => setIsShareOpen(true)}
              className="flex items-center gap-2 py-2.5 px-4 rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 group flex-1 justify-center"
            >
              <Share2 className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="text-sm font-semibold">Share</span>
            </button>
          </div>
        </div>

        {/* Comment Section - shown when Comment button is clicked */}
        {showComments && (
          <div className="border-t border-gray-100 dark:border-gray-700/80 mt-1 pt-3">
            <AllComments postId={post._id} commentsCount={post.commentsCount} />
            <CreateComment postId={post._id} />
          </div>
        )}

      </div>
    </div>

    {/* Share Modal Popup */}
    <ShareModal
      isOpen={isShareOpen}
      onClose={() => setIsShareOpen(false)}
      post={post}
    />
 </>
  )
}
