import { Newspaper, Users, Bookmark, User } from 'lucide-react';

export type FeedView = 'feed' | 'connection' | 'saved' | 'myPosts';

interface FeedMenuProps {
  activeView: FeedView;
  onViewChange: (view: FeedView) => void;
}

const menuItems: { key: FeedView; label: string; icon: React.ReactNode; gradient: string; activeGradient: string; description: string }[] = [
  {
    key: 'feed',
    label: 'Feed',
    icon: <Newspaper className="w-5 h-5" />,
    gradient: 'from-blue-500 to-indigo-500',
    activeGradient: 'from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40',
    description: 'All posts'
  },
  {
    key: 'connection',
    label: 'Connection',
    icon: <Users className="w-5 h-5" />,
    gradient: 'from-emerald-500 to-teal-500',
    activeGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40',
    description: 'Following'
  },
  {
    key: 'saved',
    label: 'Saved',
    icon: <Bookmark className="w-5 h-5" />,
    gradient: 'from-amber-400 to-orange-500',
    activeGradient: 'from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40',
    description: 'Bookmarks'
  },
  {
    key: 'myPosts',
    label: 'My Posts',
    icon: <User className="w-5 h-5" />,
    gradient: 'from-violet-500 to-purple-500',
    activeGradient: 'from-violet-50 to-purple-50 dark:from-violet-950/40 dark:to-purple-950/40',
    description: 'Your posts'
  },
];

export default function FeedMenu({ activeView, onViewChange }: FeedMenuProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/80 rounded-2xl shadow-sm overflow-hidden sticky top-20 transition-all">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          Navigate
        </h3>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
          Switch between views
        </p>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-gray-200 dark:border-gray-700" />

      {/* Menu Items */}
      <nav className="p-3 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = activeView === item.key;

          return (
            <button
              key={item.key}
              onClick={() => onViewChange(item.key)}
              className={`
                w-full flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer
                transition-all duration-200 ease-out group relative overflow-hidden
                ${isActive
                  ? 'bg-blue-50 dark:bg-blue-950/50 shadow-sm border border-blue-100 dark:border-blue-900/50'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/40 border border-transparent'
                }
              `}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-blue-600 dark:bg-blue-400" />
              )}

              {/* Icon */}
              <div className={`
                flex-shrink-0 p-2 transition-all duration-200
                ${isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100'
                }
              `}>
                {item.icon}
              </div>

              {/* Text */}
              <div className="flex-1 text-left min-w-0">
                <span className={`
                  text-sm font-semibold block truncate transition-colors
                  ${isActive
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100'
                  }
                `}>
                  {item.label}
                </span>
                <span className={`
                  text-[11px] block truncate transition-colors
                  ${isActive
                    ? 'text-gray-500 dark:text-gray-400'
                    : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                  }
                `}>
                  {item.description}
                </span>
              </div>

              {/* Active dot */}
              {isActive && (
                <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 shadow-sm" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mx-4 border-t border-gray-200 dark:border-gray-700" />
      <div className="px-5 py-3">
        <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center">
          © {new Date().getFullYear()} · Your Feed
        </p>
      </div>
    </div>
  );
}
