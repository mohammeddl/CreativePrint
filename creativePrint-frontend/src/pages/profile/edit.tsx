"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCurrentUser } from "../../store/slices/userSlice"
import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
import PersonalInfoForm from "../../components/profile/PersonalInfoForm"
import ChangePasswordForm from "../../components/profile/ChangePasswordForm"
import type { RootState } from "../../store/store"

export default function ProfileEditPage() {
  const dispatch = useDispatch()
  const { currentUser, loading, error } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    dispatch(fetchCurrentUser())
  }, [dispatch])

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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
            <PersonalInfoForm />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
            <ChangePasswordForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

