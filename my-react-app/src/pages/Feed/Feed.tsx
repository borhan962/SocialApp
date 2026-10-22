import { useState } from "react";
import FeedMenu from "../../components/feedMenu/feedMenu";
import type { FeedView } from "../../components/feedMenu/feedMenu";
import FollowSuggest from "../../components/followSuggest/followSuggest";
import Posts from "../../components/Posts/Posts";
import CreatePost from "../../components/SharedComponent/createPost/CreatePost";
import SavedPosts from "../../components/SavedPosts/SavedPosts";
import ConnectionPosts from "../../components/ConnectionPosts/ConnectionPosts";
import MyPosts from "../../components/MyPosts/MyPosts";




export default function Feed() {
  const [activeView, setActiveView] = useState<FeedView>('feed');

  return (
    <main>

      <div className="container mx-auto md:w-[80%] my-10">
        <div className="grid  gap-x-5 md:grid-cols-12">
           <div className="leftSidebar  col-span-3">
          <FeedMenu activeView={activeView} onViewChange={setActiveView} />
        </div>
        <div className="postList col-span-6 ">
          {/* Feed view — show CreatePost + all Posts */}
          {activeView === 'feed' && (
            <>
              <CreatePost/>
              <Posts/>
            </>
          )}

          {/* Connection view — show posts from followed users */}
          {activeView === 'connection' && (
            <ConnectionPosts />
          )}

          {/* Saved view — show bookmarked posts only */}
          {activeView === 'saved' && (
            <SavedPosts />
          )}

          {/* My Posts view — show user's own posts */}
          {activeView === 'myPosts' && (
            <MyPosts />
          )}
        </div>
        <div className="rightSidebar col-span-3 ">
          <FollowSuggest/>
        </div>
        </div>
       
      </div>
    </main>
  )
}
