import React, { useContext, useState } from "react";
import type { postItem } from "../../../types/post.type";
import { AuthContext } from "../../../context/AuthContext";
import { userDataContext } from "../../../context/userDataContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sharePost } from "../../../Services/sharePost.services";
import { X, Globe, Send, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: postItem;
}

export default function ShareModal({ isOpen, onClose, post }: ShareModalProps) {
  const { userToken } = useContext(AuthContext);
  const { userData } = useContext(userDataContext);
  const queryClient = useQueryClient();
  const [text, setText] = useState("");

  const currentUserName = userData?.data?.user?.name || "User";
  const currentUserPhoto = userData?.data?.user?.photo;
  
  // If sharing a post that is already a shared post, target the original post
  const originalPost = (post.sharedPost && typeof post.sharedPost === 'object' && post.sharedPost !== null)
    ? post.sharedPost
    : post;
  const targetPostId = originalPost._id || originalPost.id || post._id || post.id;

  const shareMutation = useMutation({
    mutationFn: () => {
      return sharePost(userToken!, targetPostId, text.trim());
    },
    onSuccess: () => {
      toast.success("Post shared successfully!");
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["feedFollowing"] });
      setText("");
      onClose();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Failed to share post";
      toast.error(msg);
    },
  });

  if (!isOpen) return null;

  const originalDate = originalPost.createdAt
    ? new Date(originalPost.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";
  const originalBody = originalPost.body || originalPost.content || originalPost.caption || originalPost.text || "";
  const originalUser = originalPost.user || post.user;
  const originalImage = originalPost.image;

  const handlePost = () => {
    if (!userToken) {
      toast.info("Please login to share");
      return;
    }
    shareMutation.mutate();
  };

  const handleCancel = () => {
    setText("");
    onClose();
  };

  return (
    <div 
      onClick={handleCancel}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 dark:border-gray-700 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Share Post
          </h2>
          <button
            type="button"
            onClick={handleCancel}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* User info */}
          <div className="flex items-center gap-3">
            <img
              src={currentUserPhoto}
              alt={currentUserName}
              className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-gray-700 flex-shrink-0"
            />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                {currentUserName}
              </p>
              <div className="flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-[11px] text-gray-600 dark:text-gray-300 w-fit">
                <Globe className="w-3 h-3 text-gray-500" />
                <span>Public</span>
              </div>
            </div>
          </div>

          {/* Textarea */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Say something about this..."
            rows={3}
            className="w-full p-3 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 bg-transparent border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition resize-none"
          />

          {/* Original Post Preview Card Under the Textarea */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-3.5 bg-gray-50/60 dark:bg-gray-900/40 space-y-2.5">
            {/* Author */}
            <div className="flex items-center gap-2.5">
              <img
                src={originalUser?.photo || "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"}
                alt={originalUser?.name || "Original Author"}
                className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                  {originalUser?.name || "Author"}
                </p>
                {originalDate && (
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    {originalDate}
                  </p>
                )}
              </div>
            </div>

            {/* Original Post Body */}
            {originalBody && (
              <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line break-words">
                {originalBody}
              </p>
            )}

            {/* Original Post Image (if any) */}
            {originalImage && (
              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 max-h-48">
                <img
                  src={originalImage}
                  alt="Original post attachment"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer with Cancel and Post buttons */}
        <div className="px-5 py-3.5 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handleCancel}
            disabled={shareMutation.isPending}
            className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handlePost}
            disabled={shareMutation.isPending}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {shareMutation.isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Sharing...</span>
              </>
            ) : (
              <>
                <span>Post</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
