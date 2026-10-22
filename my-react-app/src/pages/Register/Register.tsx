import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ListBox, Select } from "@heroui/react";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../Schema/register.schema';
import axios from 'axios';
import { baseUrl } from '../../constant/enviromant';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import type { RegisterFormInputs } from '../../types/Auth.types';


export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showRePassword, setShowRePassword] = useState(false)
  const navigator = useNavigate()

  const { register, handleSubmit, control, formState: { errors } } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "" as unknown as "male" | "female",
      password: "",
      rePassword: ""
    }
  })

 async function handleRegister(value: RegisterFormInputs) {
    try {
      const response = await axios.post(`${baseUrl}/users/signup`, value);

      if (response.status === 201 || response.status === 200) {
        toast.success(response.data.message || "Account created successfully!");
        navigator('/auth/login');
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || "Registration failed";
      toast.error(errorMsg);
    }
  }

  return (
    <>

    <section className="order-1 w-full max-w-107.5 lg:order-2">
      <div className="rounded-2xl bg-white dark:bg-slate-800/90 border border-transparent dark:border-slate-700/80 p-4 shadow-sm dark:shadow-xl sm:p-6 transition-colors">
        <div className="mb-4 text-center lg:hidden">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#00298d] dark:text-blue-400">Route Posts</h1>
          <p className="mt-1 text-base font-medium leading-snug text-slate-700 dark:text-slate-300">
            Connect with friends and the world around you on Route Posts.
          </p>
        </div>

        {/* Tab switch */}
        <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 p-1">
          <Link
            to="/auth/login"
            className="rounded-lg py-2 text-center text-sm font-extrabold text-slate-600 dark:text-slate-400 transition hover:text-slate-800 dark:hover:text-slate-200"
          >
            Login
          </Link>
          <button
            type="button"
            className="rounded-lg bg-white dark:bg-slate-800 py-2 text-sm font-extrabold text-[#00298d] dark:text-blue-400 shadow-sm dark:shadow-slate-950/40 transition"
          >
            Register
          </button>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Create a new account</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">It is quick and easy.</p>

        <form onSubmit={handleSubmit(handleRegister)} className="mt-5 space-y-3.5">
          {/* Full Name */}
          <div>
            <div className="relative">
              <i className="fa-solid fa-user pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm"></i>
              <input
                placeholder="Full name"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/70 py-3 pl-11 pr-4 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-[#00298d] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900"
                type="text"
                {...register("name")}
              />
            </div>
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Username */}
          <div>
            <div className="relative">
              <i className="fa-solid fa-user pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm"></i>
              <input
                placeholder="Username"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/70 py-3 pl-11 pr-4 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-[#00298d] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900"
                type="text"
                {...register("username")}
              />
            </div>
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
          </div>

          {/* Email */}
          <div>
            <div className="relative">
              <i className="fa-regular fa-envelope pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm"></i>
              <input
                placeholder="Email address"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/70 py-3 pl-11 pr-4 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-[#00298d] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900"
                type="email"
                {...register("email")}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Gender */}
          <div>
            <div className="relative">
              <i className="fa-solid fa-venus-mars pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm z-50"></i>
              <Controller        
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select
                    className="w-full"
                    placeholder="Select Gender"
                    aria-label="Gender"
                    selectedKey={field.value || null}
                    onSelectionChange={(key) => field.onChange(key ? String(key) : "")}
                  >
                    <Select.Trigger className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/70 py-3 pl-11 pr-4 text-sm text-slate-800 dark:text-slate-100 outline-none transition focus:border-[#00298d] dark:focus:border-blue-500">
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg dark:shadow-black/60 overflow-hidden">
                      <ListBox className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 p-1">
                        <ListBox.Item id="male" textValue="male" className="px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/70 cursor-pointer">Male</ListBox.Item>
                        <ListBox.Item id="female" textValue="female" className="px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/70 cursor-pointer">Female</ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>
                )}
              />
            </div>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <div className="relative">
              <i className="fa-solid fa-calendar pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm"></i>
              <input
                placeholder="Date of birth"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/70 py-3 pl-11 pr-4 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-[#00298d] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900"
                type="date"
                {...register("dateOfBirth")}
              />
            </div>
            {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <i className="fa-solid fa-key pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm"></i>
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
                  <i className="fa-solid fa-eye-slash"></i>
                ) : (
                  <i className="fa-solid fa-eye"></i>
                )}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password / rePassword */}
          <div>
            <div className="relative">
              <i className="fa-solid fa-key pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm"></i>
              <input
                placeholder="Confirm password"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/70 py-3 pl-11 pr-11 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-[#00298d] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900"
                type={showRePassword ? 'text' : 'password'}
                {...register("rePassword")}
              />
              <button
                type="button"
                onClick={() => setShowRePassword(!showRePassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
              >
                {showRePassword ? (
                  <i className="fa-solid fa-eye-slash"></i>
                ) : (
                  <i className="fa-solid fa-eye"></i>
                )}
              </button>
            </div>
            {errors.rePassword && <p className="text-red-500 text-sm mt-1">{errors.rePassword.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-[#00298d] dark:bg-blue-600 hover:bg-[#002275] dark:hover:bg-blue-500 py-3 text-sm font-bold text-white shadow-md dark:shadow-blue-900/30 transition focus:outline-none cursor-pointer"
          >
            Create account
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/auth/login" className="font-bold text-[#00298d] dark:text-blue-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </section>
    </>
  )
}

