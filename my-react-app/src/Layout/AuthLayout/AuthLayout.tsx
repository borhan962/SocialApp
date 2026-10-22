import { Outlet } from 'react-router-dom'
import AuthInformation from '../../components/AuthComponent/AuthInformation'
import { useTheme } from '../../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

export default function AuthLayout() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className='relative min-h-screen w-full bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col justify-center items-center p-4 sm:p-6'>
      {/* Floating Theme Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer select-none"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-500" />}
          <span>{isDark ? 'Light' : 'Dark'}</span>
        </button>
      </div>

      <div className='mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-6 sm:gap-8 lg:flex-row lg:items-center lg:justify-between py-10'>
        <AuthInformation />
        <Outlet />
      </div>
    </div>
  )
}
