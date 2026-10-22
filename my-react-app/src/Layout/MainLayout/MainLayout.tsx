
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      <Outlet/>
    </div>
  )
}
