import { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../../Services/notifications.services";
import NotificationLoading from "./NotificationLoading";
import { Bell, Heart, MessageCircle, UserPlus, Share2, Bookmark, AtSign, CheckCheck, Check } from "lucide-react";

import { Link } from "react-router-dom";

interface NotificationUser {
  _id: string;
  name: string;
  photo?: string;
  username?: string;
}

interface NotificationEntity {
  _id: string;
  body?: string;
  user?: string;
  commentsCount?: number;
  likesCount?: number;
  [key: string]: any;
}

interface Notification {
  _id: string;
  type: string;
  entityType?: string;
  entityId?: string;
  message?: string;
  content?: string;
  isRead?: boolean;
  read?: boolean;
  createdAt: string;
  actor?: NotificationUser;
  sender?: NotificationUser;
  recipient?: NotificationUser;
  entity?: NotificationEntity;
  post?: NotificationEntity;
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "like":
    case "like_post":
      return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
    case "comment":
    case "comment_post":
      return <MessageCircle className="w-5 h-5 text-blue-500" />;
    case "follow":
    case "follow_user":
      return <UserPlus className="w-5 h-5 text-emerald-500" />;
    case "share":
    case "share_post":
      return <Share2 className="w-5 h-5 text-purple-500" />;
    case "bookmark":
      return <Bookmark className="w-5 h-5 text-amber-500" />;
    case "mention":
      return <AtSign className="w-5 h-5 text-cyan-500" />;
    default:
      return <Bell className="w-5 h-5 text-gray-500" />;
  }
}

function getNotificationBg(type: string) {
  switch (type) {
    case "like":
    case "like_post":
      return "bg-red-50 dark:bg-red-950/30";
    case "comment":
    case "comment_post":
      return "bg-blue-50 dark:bg-blue-950/30";
    case "follow":
    case "follow_user":
      return "bg-emerald-50 dark:bg-emerald-950/30";
    case "share":
    case "share_post":
      return "bg-purple-50 dark:bg-purple-950/30";
    case "bookmark":
      return "bg-amber-50 dark:bg-amber-950/30";
    case "mention":
      return "bg-cyan-50 dark:bg-cyan-950/30";
    default:
      return "bg-gray-50 dark:bg-gray-800";
  }
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export default function Notifications() {
  const { userToken } = useContext(AuthContext);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const queryClient = useQueryClient();

  const markAllMutation = useMutation({
    mutationFn: () => markAllNotificationsAsRead(userToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markSingleMutation = useMutation({
    mutationFn: (notificationId: string) => markNotificationAsRead(userToken!, notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notifications", userToken],
    queryFn: () => getNotifications(userToken!),
    enabled: !!userToken,
    refetchOnWindowFocus: true,
    retry: 2,
    retryDelay: 3500,
  });

  const notifications: Notification[] =
    (Array.isArray(data?.data?.notifications) ? data.data.notifications : null) ??
    (Array.isArray(data?.notifications) ? data.notifications : null) ??
    (Array.isArray(data?.data) ? data.data : null) ??
    (Array.isArray(data) ? data : []);

  const unreadCount = notifications.filter((n: Notification) => !(n.isRead ?? n.read)).length;
  const displayNotifications = filter === "unread"
    ? notifications.filter((n: Notification) => !(n.isRead ?? n.read))
    : notifications;


  return (
    <>
     
      <div className="container mx-auto md:w-[60%] my-8 px-4">
        {/* Header Card */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 mb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 text-black dark:text-white">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Notifications
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {unreadCount > 0
                    ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                    : "You're all caught up"}
                </p>
              </div>
            </div>

            {/* Mark all as read button (placed where the toggle button was) */}
            <button
              onClick={() => markAllMutation.mutate()}
              disabled={unreadCount === 0 || markAllMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer dark:bg-blue-950/40 dark:text-blue-400"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4" />
              <span>{markAllMutation.isPending ? "Marking..." : "mark all as read"}</span>
            </button>
          </div>

          {/* Toggle buttons (All / Unread) moved under notification and unread notification text */}
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-start">
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  filter === "all"
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  filter === "unread"
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Unread {unreadCount > 0 && `(${unreadCount})`}
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {isLoading ? (
          <NotificationLoading />
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-red-500 font-medium">Failed to load notifications.</p>
          </div>
        ) : displayNotifications.length > 0 ? (
          <div className="space-y-2">
            {displayNotifications.map((notification: Notification) => {
              const actor = notification.actor || notification.sender;
              const actorName = actor?.name || "Someone";
              const actorPhoto = actor?.photo;
              const isRead = notification.isRead ?? notification.read ?? false;
              const postBody = notification.entity?.body || notification.post?.body;
              const postId = notification.entityId || notification.entity?._id || notification.post?._id;
              const actionMessage = notification.message || notification.content || getDefaultMessage(notification.type);

              const cardContent = (
                <div className="flex items-start gap-3 p-4">
                  {/* Actor Avatar */}
                  <div className="relative flex-shrink-0">
                    {actorPhoto ? (
                      <img
                        src={actorPhoto}
                        alt={actorName}
                        className="w-11 h-11 rounded-full object-cover border border-gray-100 dark:border-gray-700"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                        {actorName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {/* Type Badge */}
                    <div
                      className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 ${getNotificationBg(notification.type)}`}
                    >
                      <div className="scale-[0.6]">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug">
                          <span className="font-semibold text-gray-900 dark:text-gray-100">{actorName} </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {actionMessage}
                          </span>
                        </p>
                        {postBody && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg truncate border border-gray-100 dark:border-gray-700">
                            "{postBody}"
                          </p>
                        )}
                      </div>

                      {/* Unread Dot */}
                      {!isRead && (
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                      )}
                    </div>

                    {/* Timestamp & Mark as read button under every notification message */}
                    <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-gray-50 dark:border-gray-700/40">
                      <p className="text-[11px] text-gray-400 dark:text-gray-500">
                        {timeAgo(notification.createdAt)}
                      </p>

                      {!isRead ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            markSingleMutation.mutate(notification._id);
                          }}
                          disabled={markSingleMutation.isPending && markSingleMutation.variables === notification._id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition cursor-pointer dark:bg-blue-950/40 dark:text-blue-400"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>
                            {markSingleMutation.isPending && markSingleMutation.variables === notification._id
                              ? "Marking..."
                              : "mark as read"}
                          </span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span>Read</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );

              return (
                <div
                  key={notification._id}
                  className={`
                    bg-white dark:bg-gray-800 border rounded-xl shadow-sm overflow-hidden
                    transition-all duration-200 hover:shadow-md
                    ${isRead
                      ? "border-gray-200 dark:border-gray-700"
                      : "border-blue-200 dark:border-blue-800 border-l-4 border-l-blue-500 bg-blue-50/15"
                    }
                  `}
                >
                  {postId ? (
                    <Link to={`/PostDetails/${postId}`} className="block hover:bg-gray-50/50 dark:hover:bg-gray-750 transition-colors">
                      {cardContent}
                    </Link>
                  ) : (
                    cardContent
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-10 text-center">
            <div className="inline-flex p-4 rounded-full bg-gray-100 dark:bg-gray-700/50 mb-4">
              <Bell className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {filter === "unread" ? "No unread notifications" : "No notifications yet"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filter === "unread"
                ? "You've read all your notifications"
                : "When someone interacts with your posts, you'll see it here"}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function getDefaultMessage(type: string): string {
  switch (type) {
    case "like":
    case "like_post":
      return "liked your post";
    case "comment":
    case "comment_post":
      return "commented on your post";
    case "follow":
    case "follow_user":
      return "started following you";
    case "share":
    case "share_post":
      return "shared your post";
    case "bookmark":
      return "bookmarked your post";
    case "mention":
      return "mentioned you";
    default:
      return "interacted with you";
  }
}
