"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, Upload } from "lucide-react"
import { fetchCurrentUser, updateProfile } from "../../store/slices/userSlice"
import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
import type { RootState } from "../../store/store"
import type { UpdateProfileData } from "../../types/user"

export default function ProfileEditPage() {
  const dispatch = useDispatch()
  const { currentUser, loading, error } = useSelector((state: RootState) => state.user)
  const [formData, setFormData] = useState<UpdateProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    avatar: "",
    themePreference: "light",
  })
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchCurrentUser())
  }, [dispatch])

  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        avatar: currentUser.avatar || "",
        themePreference: currentUser.themePreference,
      })
      setPreviewAvatar(currentUser.avatar || null)
    }
  }, [currentUser])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewAvatar(reader.result as string)
        setFormData({ ...formData, avatar: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(updateProfile(formData))
  }

  const toggleTheme = () => {
    setFormData({
      ...formData,
      themePreference: formData.themePreference === "light" ? "dark" : "light",
    })
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!currentUser) {
    return <div>User not found</div>
  }

  return (
    <div className={`min-h-screen flex flex-col ${formData.themePreference === "dark" ? "dark" : ""}`}>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
        >
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Edit Profile</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={previewAvatar || "/placeholder.svg"}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-purple-500 rounded-full p-2 cursor-pointer"
                  >
                    <Upload className="w-5 h-5 text-white" />
                  </label>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme Preference</span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <AnimatePresence initial={false} mode="wait">
                    {formData.themePreference === "light" ? (
                      <motion.div
                        key="sun"
                        initial={{ opacity: 0, rotate: -180 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 180 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Sun className="w-5 h-5 text-yellow-500" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ opacity: 0, rotate: 180 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: -180 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Moon className="w-5 h-5 text-blue-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Update Profile
              </motion.button>
            </form>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}

