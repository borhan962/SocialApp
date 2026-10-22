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
      <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4 text-center lg:hidden">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#00298d]">Route Posts</h1>
          <p className="mt-1 text-base font-medium leading-snug text-slate-700">
            Connect with friends and the world around you on Route Posts.
          </p>
        </div>

        {/* Tab switch */}
        <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          <Link
            to="/auth/login"
            className="rounded-lg py-2 text-center text-sm font-extrabold text-slate-600 transition hover:text-slate-800"
          >
            Login
          </Link>
          <button
            type="button"
            className="rounded-lg bg-white py-2 text-sm font-extrabold text-[#00298d] shadow-sm transition  "
          >
            Register
          </button>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900">Create a new account</h2>
        <p className="mt-1 text-sm text-slate-500">It is quick and easy.</p>

        <form onSubmit={handleSubmit(handleRegister)} className="mt-5 space-y-3.5">
          {/* Full Name */}
          <div>
            <div className="relative">
                <i className="fa-solid fa-user pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <input
                placeholder="Full name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#00298d] focus:bg-white"
                type="text"
                {...register("name")}
              />
            </div>
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Username (Optional) */}
          <div>
            <div className="relative">
               <i className="fa-solid fa-user pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <input
                placeholder="Username"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#00298d] focus:bg-white"
                type="text"
                {...register("username")}
              />
            </div>
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
          </div>

          {/* Email */}
          <div>
            <div className="relative">
                <i className="fa-regular fa-envelope pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <input
                placeholder="Email address"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#00298d] focus:bg-white"
                type="email"
                {...register("email")}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Gender */}
          <div>
            <div className="relative">
              <i className="fa-solid fa-venus-mars pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm z-50"></i>
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
                    <Select.Trigger className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition">
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        <ListBox.Item id="male" textValue="male">Male</ListBox.Item>
                        <ListBox.Item id="female" textValue="female">Female</ListBox.Item>
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
              <i className="fa-solid fa-calendar pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <input
                placeholder="Date of birth"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#00298d] focus:bg-white"
                type="date"
                {...register("dateOfBirth")}
              />
            </div>
            {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <i className="fa-solid fa-key pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <input
                placeholder="Password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-11 text-sm text-slate-800 outline-none transition focus:border-[#00298d] focus:bg-white"
                type={showPassword ? 'text' : 'password'}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
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
              <i className="fa-solid fa-key pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <input
                placeholder="Confirm password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-11 text-sm text-slate-800 outline-none transition focus:border-[#00298d] focus:bg-white"
                type={showRePassword ? 'text' : 'password'}
                {...register("rePassword")}
              />
              <button
                type="button"
                onClick={() => setShowRePassword(!showRePassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
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
            className="w-full rounded-xl bg-[#00298d] py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#002275] focus:outline-none"
          >
            Create account
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/auth/login" className="font-bold text-[#00298d] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </section>
    </>
  )
}

