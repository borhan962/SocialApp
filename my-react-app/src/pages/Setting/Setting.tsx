import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { AuthContext } from "../../context/AuthContext";
import { changePassword } from "../../Services/changePassword.services";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "../../Schema/changePassword.schema";
import { useNavigate } from "react-router-dom";

export default function Setting() {
  const auth = useContext(AuthContext);
  const userToken = auth?.userToken;
  const setToken = auth?.setToken;

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigator = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onTouched",
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    if (!userToken) {
      toast.error("You must be logged in to change your password.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await changePassword(userToken, {
        password: data.password,
        newPassword: data.newPassword,
      });

      toast.success(response?.message || "Password updated successfully! Please login with your new password.");
      reset();

      // Clear token from storage and AuthContext state
      localStorage.removeItem("token");
      if (setToken) {
        setToken(null);
      }

      // Redirect to login page
      navigator("/auth/login");
    } catch (error: any) {
      console.error("Change password error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to update password. Please check your current password.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Settings | Route Posts</title>
      </Helmet>

      <div className="max-w-xl w-full mx-auto py-8 px-4">
        {/* Change Password Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 shrink-0">
              <KeyRound className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Change Password
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Keep your account secure by using a strong password.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Current password */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                Current password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  {...register("password")}
                  className={`w-full px-3.5 py-2.5 pr-10 text-sm rounded-xl border ${
                    errors.password
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-200 dark:border-gray-700 focus:border-blue-400 focus:ring-blue-400"
                  } bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:ring-1 transition`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 cursor-pointer"
                  tabIndex={-1}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* New password */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                New password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  {...register("newPassword")}
                  className={`w-full px-3.5 py-2.5 pr-10 text-sm rounded-xl border ${
                    errors.newPassword
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-200 dark:border-gray-700 focus:border-blue-400 focus:ring-blue-400"
                  } bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:ring-1 transition`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 cursor-pointer"
                  tabIndex={-1}
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 mt-1.5 leading-normal">
                At least 8 characters with uppercase, lowercase, number, and special character.
              </p>
              {errors.newPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm new password */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                Confirm new password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  {...register("confirmPassword")}
                  className={`w-full px-3.5 py-2.5 pr-10 text-sm rounded-xl border ${
                    errors.confirmPassword
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-200 dark:border-gray-700 focus:border-blue-400 focus:ring-blue-400"
                  } bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:ring-1 transition`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating password...</span>
                  </>
                ) : (
                  <span>Update password</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
