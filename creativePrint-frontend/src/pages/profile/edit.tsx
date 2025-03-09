import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

import { RootState } from '../../store/store'
import { fetchUserProfile, updateUserProfile } from '../../store/slices/userProfileSlice'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import DebugInfo from '../../components/profile/DebugInfo'

// Import profile components
import { ProfileHeader } from '../../components/profile/ProfileHeader'
import { ProfileBioSection } from '../../components/profile/ProfileBioSection'
import { ProfileWebsiteSection } from '../../components/profile/ProfileWebsiteSection'
import { ProfileSocialMediaSection } from '../../components/profile/ProfileSocialMediaSection'

interface ProfileState {
  bio: string
  website: string
  socialMediaLinks: string
  profilePicture?: File | null
}

export default function ProfileEditPage() {
  const dispatch = useDispatch()
  const { currentUser, userId, loading: userLoading, isAuthenticated } = useSelector((state: RootState) => state.user)
  const { profile, loading: profileLoading, error } = useSelector((state: RootState) => state.userProfile)

  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<ProfileState>({
    bio: '',
    website: '',
    socialMediaLinks: '',
    profilePicture: null
  })
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  
  // Check if we need to get user ID from localStorage if it's not in Redux state
  const getUserId = () => {
    if (userId) return userId;
    if (currentUser?.id) return currentUser.id;
    
    // Fallback to localStorage
    const userDataStr = localStorage.getItem('user-current');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        return userData.userId;
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    return null;
  };

  // Create user data from local storage if not in Redux
  const getUserData = () => {
    if (currentUser) return currentUser;
    
    const userDataStr = localStorage.getItem('user-current');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        return {
          id: userData.userId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: userData.role,
          themePreference: 'light'
        };
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    return null;
  };

  // Fetch user profile when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      const actualUserId = getUserId();
      
      if (actualUserId && !profile && !profileLoading) {
        console.log("Fetching profile for user ID:", actualUserId);
        try {
          await dispatch(fetchUserProfile(actualUserId) as any);
        } catch (error) {
          console.error("Error fetching profile:", error);
          toast.error("Could not load profile");
        }
      }
    };
    
    fetchProfile();
  }, [currentUser, profile, profileLoading, dispatch]);

  // Update local state when profile data is fetched
  useEffect(() => {
    if (profile) {
      setProfileData({
        bio: profile.bio || '',
        website: profile.website || '',
        socialMediaLinks: profile.socialMediaLinks || '',
        profilePicture: null
      })
    }
  }, [profile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileData(prev => ({
        ...prev,
        profilePicture: file
      }))
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    const actualUserId = getUserId();
    
    if (!actualUserId) {
      toast.error('You must be logged in to update your profile')
      return
    }

    const formData = new FormData()
    formData.append('bio', profileData.bio)
    formData.append('website', profileData.website)
    formData.append('socialMediaLinks', profileData.socialMediaLinks)
    
    if (profileData.profilePicture) {
      // Use 'image' field name to match the backend's UserProfileRequestDTO
      formData.append('image', profileData.profilePicture)
    }

    try {
      await dispatch(updateUserProfile({
        userId: actualUserId,
        formData: formData
      }) as any).unwrap()
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Profile update failed', error)
      toast.error('Failed to update profile')
    }
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setPreviewImage(null)
    // Reset to original values
    if (profile) {
      setProfileData({
        bio: profile.bio || '',
        website: profile.website || '',
        socialMediaLinks: profile.socialMediaLinks || '',
        profilePicture: null
      })
    }
  }

  // Directly check local storage for token
  const token = localStorage.getItem('token');
  const actuallyAuthenticated = !!token;
  const userData = getUserData();

  if (userLoading || profileLoading) {
    return <div className="flex justify-center items-center h-screen">Loading profile...</div>;
  }

  if ((!isAuthenticated && !actuallyAuthenticated) || (!currentUser && !userData)) {
    return <div className="flex justify-center items-center h-screen">Please log in</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Error Loading Profile</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
        <DebugInfo />
      </div>
    );
  }

  // Use either Redux user data or localStorage user data
  const userToDisplay = userData || {
    id: getUserId() || "",
    firstName: "User",
    lastName: "",
    email: "",
    role: "USER"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Profile Header Component */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-6">
            <ProfileHeader 
              user={userToDisplay}
              isEditing={isEditing}
              previewImage={previewImage}
              onEditToggle={() => setIsEditing(true)}
              onSubmit={handleSubmit}
              onCancel={cancelEditing}
              onFileChange={handleFileChange}
            />
          </div>

          {/* Profile Details */}
          <div className="space-y-6">
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }} className="space-y-6">
              {/* Bio Section */}
              <ProfileBioSection 
                bio={profileData.bio}
                isEditing={isEditing}
                onChange={handleInputChange}
              />

              {/* Website Section */}
              <ProfileWebsiteSection 
                website={profileData.website}
                isEditing={isEditing}
                onChange={handleInputChange}
              />

              {/* Social Media Section */}
              <ProfileSocialMediaSection 
                socialMediaLinks={profileData.socialMediaLinks}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              
              {/* Edit mode buttons */}
              {isEditing && (
                <div className="flex justify-end space-x-4 mt-6">
                  <motion.button
                    type="button"
                    onClick={cancelEditing}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-3 rounded-lg border border-gray-300 text-gray-700 shadow-sm 
                              hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg
                              hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    Save Changes
                  </motion.button>
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
      <Footer />
      
      {/* Debug Component */}
      <DebugInfo />
    </div>
  )
}