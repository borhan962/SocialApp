import { Outlet } from 'react-router-dom'
import AuthInformation from '../../components/AuthComponent/AuthInformation'

export default function AuthLayout() {
  return (
    <div className='mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-6 p-4 sm:gap-8 lg:flex-row lg:items-center lg:justify-between'>
      <AuthInformation />
      <Outlet />
    </div>
  )
}
