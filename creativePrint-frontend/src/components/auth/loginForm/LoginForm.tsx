import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { HiMail } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { authService } from "../../services/api/auth.service";
import type { LoginFormData } from "../../../types/auth";
import { useAppDispatch } from "../../../hooks/redux";
import { loginUser } from "../../../store/slices/userSlice";

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const resultAction = await dispatch(loginUser(formData));
      if (loginUser.fulfilled.match(resultAction)) {
        const { role } = resultAction.payload;
        // Navigate based on role
        if (role === "ADMIN") navigate("/admin");
        else if (role === "CLIENT") navigate("/home");
        else if (role === "PARTNER") navigate("/dashboard");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to login. Please check your credentials."
      );
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // TODO: Implement Google OAuth
      console.log("Google login clicked");
    } catch (err) {
      setError("Failed to login with Google.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-50 to-pink-50'>
      <div className='max-w-md w-full mx-4'>
        <div className='bg-white rounded-2xl shadow-xl p-8 space-y-6'>
          <div className='text-center space-y-2'>
            <h1 className='text-3xl font-bold text-gray-900'>Welcome back</h1>
            <p className='text-gray-500'>Sign in to your account to continue</p>
          </div>

          {error && (
            <div className='bg-red-50 text-red-500 p-3 rounded-lg text-sm'>
              {error}
            </div>
          )}
          
          

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-1'>
              <label
                htmlFor='email'
                className='text-sm font-medium text-gray-700'>
                Email address
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <HiMail className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  id='email'
                  name='email'
                  type='email'
                  required
                  className='block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ease-in-out'
                  placeholder='you@example.com'
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className='space-y-1'>
              <label
                htmlFor='password'
                className='text-sm font-medium text-gray-700'>
                Password
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <RiLockPasswordLine className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  id='password'
                  name='password'
                  type='password'
                  required
                  className='block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ease-in-out'
                  placeholder='••••••••'
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  id='remember-me'
                  name='remember-me'
                  type='checkbox'
                  className='h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded'
                />
                <label
                  htmlFor='remember-me'
                  className='ml-2 block text-sm text-gray-700'>
                  Remember me
                </label>
              </div>

              
            </div>

            <button
              type='submit'
              className='w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-200 ease-in-out transform hover:scale-[1.01]'>
              Sign in
            </button>

            <div className='text-center'>
              <Link
                to='/register'
                className='text-sm font-medium text-purple-600 hover:text-purple-500'>
                Don't have an account? Sign up
              </Link>
            </div>
          </form>
        </div>

        <div className='mt-6 text-center text-sm text-gray-500'>
          <p>Protected by reCAPTCHA and subject to the</p>
          <div className='space-x-1'>
            <Link
              to='/privacy'
              className='text-purple-600 hover:text-purple-500'>
              Privacy Policy
            </Link>
            <span>and</span>
            <Link to='/terms' className='text-purple-600 hover:text-purple-500'>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
