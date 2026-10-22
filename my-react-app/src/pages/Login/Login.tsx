import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../Schema/login.schema';
import axios from 'axios';
import { baseUrl } from '../../constant/enviromant';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import type { LoginFormInputs } from '../../types/Auth.types';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';


export default function Login() {


  const {setToken} = useContext(AuthContext)


  const navigator = useNavigate();
   async function handleLogin(value: LoginFormInputs) {
  
    try {
      const response = await axios.post(`${baseUrl}/users/signin`, value);
      if (response.status === 200 || response.status === 201) {
          localStorage.setItem("token", response.data.data.token)
          
          setToken(response.data.data.token)
         toast.success(response.data.message || "Login successfully!");
         navigator("/feed")
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || "Login failed";
      toast.error(errorMsg);
    }
  }
  
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({

      resolver: zodResolver(loginSchema),
      defaultValues: {
        email: "",
        password: ""
      }
    })
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
  
  
    <section className="order-1 w-full max-w-[430px] lg:order-2">
      <div className="rounded-2xl bg-white dark:bg-slate-800/90 border border-transparent dark:border-slate-700/80 p-4 shadow-sm dark:shadow-xl sm:p-6 transition-colors">
        <div className="mb-4 text-center lg:hidden">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#00298d] dark:text-blue-400">Route Posts</h1>
          <p className="mt-1 text-base font-medium leading-snug text-slate-700 dark:text-slate-300">
            Connect with friends and the world around you on Route Posts.
          </p>
        </div>

        {/* Tab switch */}
        <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 p-1">
          <button
            type="button"
            className="rounded-lg bg-white dark:bg-slate-800 py-2 text-sm font-extrabold text-[#00298d] dark:text-blue-400 shadow-sm dark:shadow-slate-950/40 transition"
          >
            Login
          </button>
          <Link
            to="/auth/register"
            className="rounded-lg py-2 text-center text-sm font-extrabold text-slate-600 dark:text-slate-400 transition hover:text-slate-800 dark:hover:text-slate-200"
          >
            Register
          </Link>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Log in to Route Posts</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Log in and continue your social journey.</p>

        <form onSubmit={handleSubmit(handleLogin)} noValidate className="mt-5 space-y-3.5">
          {/* Email */}
          <div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
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
              </span>
              <input
                placeholder="Email address"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/70 py-3 pl-11 pr-4 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-[#00298d] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900"
                type="email"
                {...register("email")}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-key-round"
                  aria-hidden="true"
                >
                  <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                  <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                </svg>
              </span>
              <input
                placeholder="Password"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/70 py-3 pl-11 pr-11 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-[#00298d] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900"
                type={showPassword ? 'text' : 'password'}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-eye-off"
                  >
                    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .698 10.743 10.743 0 0 1-3.23 4.382"></path>
                    <path d="m2 2 20 20"></path>
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-eye"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-[#00298d] dark:bg-blue-600 hover:bg-[#002275] dark:hover:bg-blue-500 py-3 text-sm font-bold text-white shadow-md dark:shadow-blue-900/30 transition focus:outline-none cursor-pointer"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/auth/register" className="font-bold text-[#00298d] dark:text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </section>
      </>
  )
}
