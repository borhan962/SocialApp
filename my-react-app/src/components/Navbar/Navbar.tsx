import { useState, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { userDataContext } from "../../context/userDataContext";
import { AuthContext } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getUnreadCount } from "../../Services/notifications.services";
import { Moon, Sun } from "@gravity-ui/icons";
import { Switch } from "@heroui/react";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const { userData } = useContext(userDataContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { userToken, setToken } = useContext(AuthContext);
  const { pathname } = useLocation();
  const { isDark, toggleTheme, setTheme } = useTheme();

  const activeClass = "bg-white dark:bg-slate-800 text-[#1f6fe5] dark:text-blue-400 border border-slate-200/80 dark:border-slate-700 shadow-sm";
  const inactiveClass = "text-slate-600 dark:text-slate-400 hover:bg-white/90 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100";

  const { data: notifData } = useQuery({
    queryKey: ["notifications", "unread-count", userToken],
    queryFn: () => getUnreadCount(userToken!),
    enabled: !!userToken,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  const rawCount =
    (typeof notifData?.unreadCount === 'number' ? notifData.unreadCount : null) ??
    (typeof notifData?.count === 'number' ? notifData.count : null) ??
    (typeof notifData?.data?.unreadCount === 'number' ? notifData.data.unreadCount : null) ??
    (typeof notifData?.data?.count === 'number' ? notifData.data.count : null) ??
    (typeof notifData?.data?.unread === 'number' ? notifData.data.unread : null) ??
    (typeof notifData?.data === 'number' ? notifData.data : null) ??
    (typeof notifData === 'number' ? notifData : null) ??
    (notifData?.unreadCount ?? notifData?.count ?? notifData?.data?.unreadCount ?? notifData?.data?.count ?? 0);

  const parsedCount = Number(rawCount);
  const unreadCount = !isNaN(parsedCount) && parsedCount > 0 ? parsedCount : 0;


    function handleLogout() {
      localStorage.removeItem("token")
      setToken("")
    }


  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-[#0b0f19]/85 backdrop-blur-md transition-colors duration-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-2 py-2 sm:gap-3 sm:px-4">
          <div className="flex items-center gap-3">
            <img alt="Route Posts" className="h-9 w-9 rounded-xl object-cover" src="/route.png" />
            <p className="hidden text-xl font-extrabold text-slate-900 dark:text-slate-100 sm:block">Route Posts</p>
          </div>

          <nav className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 px-1 py-1 sm:px-1.5">
            <Link
              to="/feed"
              aria-current={pathname === '/feed' || pathname === '/' ? 'page' : undefined}
              className={`relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 ${pathname === '/feed' || pathname === '/' ? activeClass : inactiveClass}`}
            >
              <span className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-house"
                  aria-hidden="true"
                >
                  <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                  <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
              </span>
              <span className="hidden sm:inline">Feed</span>
              <span className="sr-only sm:hidden">Feed</span>
            </Link>

            <Link
              to="/profile"
              className={`relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 ${pathname === '/profile' ? activeClass : inactiveClass}`}
            >
              <span className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-user"
                  aria-hidden="true"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <span className="hidden sm:inline">Profile</span>
              <span className="sr-only sm:hidden">Profile</span>
            </Link>

            <Link
              to="/notfiction"
              className={`relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 ${pathname === '/notfiction' ? activeClass : inactiveClass}`}
            >
              <span className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-message-circle"
                  aria-hidden="true"
                >
                  <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1 leading-none shadow-sm">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </span>
              <span className="hidden sm:inline">Notifications</span>
              <span className="sr-only sm:hidden">Notifications</span>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {/* Quick 1-Click Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <Sun className="size-4 text-amber-400" />
              ) : (
                <Moon className="size-4 text-slate-700" />
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
              >
                <img
                  alt={`${userData?.data.user.name}`}
                  className="h-8 w-8 rounded-full object-cover"
                  src={`${userData?.data.user.photo}`}
                />
                <span className="hidden max-w-[140px] truncate text-sm font-semibold text-slate-800 dark:text-slate-200 md:block">
                  {userData?.data.user.name}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-menu text-slate-500 dark:text-slate-400"
                  aria-hidden="true"
                >
                  <path d="M4 5h16"></path>
                  <path d="M4 12h16"></path>
                  <path d="M4 19h16"></path>
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 shadow-xl dark:shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                  <Link to={"/profile"}>
                    <button
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-user"
                        aria-hidden="true"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      Profile
                    </button>
                  </Link>

                  <Link to={"/setteing"}>
                    <button
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-settings"
                        aria-hidden="true"
                      >
                        <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      Settings
                    </button>
                  </Link>

                  {/* Dark mode switch row with HeroUI Switch */}
                  <div
                    onClick={toggleTheme}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      {isDark ? (
                        <Moon className="size-4 text-blue-400" />
                      ) : (
                        <Sun className="size-4 text-amber-500" />
                      )}
                      <span>Dark Mode</span>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Switch
                        isSelected={isDark}
                        onChange={(isSelected: boolean) => setTheme(isSelected ? "dark" : "light")}
                        aria-label="darkMode"
                        size="md"
                      >
                        {({ isSelected }) => (
                          <Switch.Content>
                            <Switch.Control>
                              <Switch.Thumb>
                                <Switch.Icon>
                                  {isSelected ? (
                                    <Moon className="size-3 text-inherit opacity-100" />
                                  ) : (
                                    <Sun className="size-3 text-inherit opacity-70" />
                                  )}
                                </Switch.Icon>
                              </Switch.Thumb>
                            </Switch.Control>
                          </Switch.Content>
                        )}
                      </Switch>
                    </div>
                  </div>

                  <div className="my-1.5 border-t border-slate-200 dark:border-slate-700"></div>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-log-out"
                      aria-hidden="true"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
