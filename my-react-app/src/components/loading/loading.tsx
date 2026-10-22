import {Skeleton} from "@heroui/react";

const bone = "animate-shine rounded-lg bg-neutral-200/90 dark:bg-neutral-800/90";

function PostSkeleton() {
  return (
    <div className="max-w-xl w-full mx-auto space-y-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm my-4">
      {/* User Header (Avatar + Name & Username) */}
      <div className="flex items-center space-x-3">
        <Skeleton className={`h-12 w-12 rounded-full shrink-0 ${bone}`} />
        <div className="space-y-2 flex-1">
          <Skeleton className={`h-3.5 w-32 ${bone}`} />
          <Skeleton className={`h-2.5 w-24 ${bone}`} />
        </div>
      </div>

      {/* Post Text */}
      <div className="space-y-2 pt-1">
        <Skeleton className={`h-3 w-full ${bone}`} />
        <Skeleton className={`h-3 w-4/5 ${bone}`} />
        <Skeleton className={`h-3 w-2/3 ${bone}`} />
      </div>

      {/* Media / Image */}
      <Skeleton className={`h-48 w-full rounded-lg ${bone}`} />

      {/* Engagement / Footer */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700/60">
        <Skeleton className={`h-3 w-16 ${bone}`} />
        <Skeleton className={`h-3 w-28 ${bone}`} />
      </div>
    </div>
  );
}

export function CustomStyles() {
  return (
    <>
      <PostSkeleton />
    </>
  );
}
