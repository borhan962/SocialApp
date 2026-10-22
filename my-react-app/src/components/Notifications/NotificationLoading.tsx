import { Skeleton } from "@heroui/react";

const bone = "animate-shine rounded-lg bg-neutral-200/90 dark:bg-neutral-800/90";

function NotificationSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <Skeleton className={`h-11 w-11 rounded-full ${bone}`} />
          <Skeleton className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full ${bone}`} />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2 pt-0.5">
          <Skeleton className={`h-3.5 w-3/4 ${bone}`} />
          <Skeleton className={`h-3 w-1/2 ${bone}`} />
          <Skeleton className={`h-2.5 w-16 ${bone}`} />
        </div>

        {/* Unread dot placeholder */}
        <Skeleton className={`h-2.5 w-2.5 rounded-full flex-shrink-0 mt-1.5 ${bone}`} />
      </div>
    </div>
  );
}

export default function NotificationLoading() {
  return (
    <div className="space-y-2">
      <NotificationSkeleton />
      <NotificationSkeleton />
      <NotificationSkeleton />
      <NotificationSkeleton />
      <NotificationSkeleton />
    </div>
  );
}
