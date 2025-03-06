import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FcGoogle } from "react-icons/fc"
import { HiMail, HiUser } from "react-icons/hi"
import { RiLockPasswordLine } from "react-icons/ri"
import { authService } from "../../services/api/auth.service"
import toast from "react-hot-toast"

import ClientRegistrationForm from "./ClientRegistrationForm"
import PartnerRegistrationForm from "./PartnerRegistrationForm"
import { RegisterFormData } from "../../../types/auth"

export default function RegisterForm() {
  
  const navigate = useNavigate()
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "CLIENT",
    // Client-specific fields
    shippingAddress: "",
    billingAddress: "",
    phoneNumber: "",
    // Partner-specific fields
    companyName: "",
    businessType: "",
    taxId: "",
    commissionRate: 0
  })
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    try {
      // Validate inputs based on role
      if (formData.role === 'CLIENT') {
        if (!formData.shippingAddress) {
          toast.error("Shipping address is required")
          setIsLoading(false)
          return
        }
        if (!formData.phoneNumber) {
          toast.error("Phone number is required")
          setIsLoading(false)
          return
        }
      } else if (formData.role === 'PARTNER') {
        if (!formData.companyName) {
          toast.error("Company name is required")
          setIsLoading(false)
          return
        }
        if (!formData.businessType) {
          toast.error("Business type is required")
          setIsLoading(false)
          return
        }
        if (!formData.taxId) {
          toast.error("Tax ID is required")
          setIsLoading(false)
          return
        }
        if (formData.commissionRate <= 0) {
          toast.error("Commission rate must be greater than 0")
          setIsLoading(false)
          return
        }
      }
  
      // Call registration service
      const response = await authService.register(formData)
      
      // Show success toast
      toast.success("Registration successful!")
      
      // Redirect based on role
      if (formData.role === 'CLIENT') {
        navigate('/home')
      } else {
        navigate('/dashboard')
      }
    } catch (err: any) {
      // More detailed error handling
      console.error('Full registration error:', err);
  
      let errorMessage = "Failed to register. Please try again.";
  
      // Check for specific error responses
      if (err.response) {
        // Backend validation errors
        if (err.response.data) {
          if (typeof err.response.data === 'object') {
            // If it's an object of field errors
            const errors = err.response.data;
            errorMessage = Object.values(errors).filter(val => val !== undefined)[0] as string || errorMessage;
          } else {
            errorMessage = err.response.data.message || err.response.data || errorMessage;
          }
        }
        switch (err.response.status) {
          case 400:
            errorMessage = "Invalid input. Please check your details.";
            break;
          case 401:
            errorMessage = "Email already registered or unauthorized.";
            break;
          case 403:
            errorMessage = "You don't have permission to register.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
        }
      }
  
      // Set and display error
      setError(errorMessage)
      toast.error(errorMessage)
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      toast.error("Google sign up is not implemented yet")
    } catch (err) {
      toast.error("Failed to sign up with Google")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const processedValue = name === 'commissionRate' 
      ? parseFloat(value) 
      : value

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-50 to-pink-50">
      <div className="max-w-md w-full mx-4 my-2">
        <div className="bg-white rounded-2xl shadow-xl px-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Create an account</h1>
            <p className="text-gray-500">Join us and start creating amazing designs</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Google Sign Up Button */}
          <button
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center gap-3 p-2 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition duration-200 ease-in-out transform hover:scale-[1.01]"
          >
            <FcGoogle className="w-6 h-6 " />
            <span className="font-medium text-gray-600">
              Sign up with Google
            </span>
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                or sign up with email
              </span>
            </div>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-1">
              <label 
                htmlFor="role" 
                className="text-sm font-medium text-gray-700"
              >
                Account Type
              </label>
              <select
                id="role"
                name="role"
                required
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ease-in-out"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="CLIENT">Client</option>
                <option value="PARTNER">Partner</option>
              </select>
            </div>

            {/* Common Name Fields */}
            <div className="flex space-x-4">
              <div className="w-1/2 space-y-1">
                <label 
                  htmlFor="firstName" 
                  className="text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ease-in-out"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="w-1/2 space-y-1">
                <label 
                  htmlFor="lastName" 
                  className="text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ease-in-out"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label 
                htmlFor="email" 
                className="text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ease-in-out"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label 
                htmlFor="password" 
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <RiLockPasswordLine className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ease-in-out"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Role-Specific Fields */}
            {formData.role === 'CLIENT' ? (
              <ClientRegistrationForm 
                formData={formData}
                handleChange={handleChange}
              />
            ) : (
              <PartnerRegistrationForm 
                formData={formData}
                handleChange={handleChange}
              />
            )}

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label 
                htmlFor="terms" 
                className="ml-2 block text-sm text-gray-700"
              >
                I agree to the{" "}
                <Link 
                  to="/terms" 
                  className="text-purple-600 hover:text-purple-500"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link 
                  to="/privacy" 
                  className="text-purple-600 hover:text-purple-500"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white 
                ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                } 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 
                transition duration-200 ease-in-out transform hover:scale-[1.01]`}
            >
              {isLoading ? 'Creating Account...' : 'Create account'}
            </button>

            <div className="text-center">
              <Link 
                to="/login" 
                className="text-sm font-medium text-purple-600 hover:text-purple-500"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Protected by reCAPTCHA and subject to the</p>
          <div className="space-x-1">
            <Link 
              to="/privacy" 
              className="text-purple-600 hover:text-purple-500"
            >
              Privacy Policy
            </Link>
            <span>and</span>
            <Link 
              to="/terms" 
              className="text-purple-600 hover:text-purple-500"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}