import React, { useEffect, useState } from 'react'
import { Camera, Edit, Save, X } from 'lucide-react'
import { User } from '../../types/user'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

interface ProfileHeaderProps {
  user: User
  isEditing: boolean
  previewImage: string | null
  onEditToggle: () => void
  onSubmit: () => void
  onCancel: () => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isEditing,
  previewImage,
  onEditToggle,
  onSubmit,
  onCancel,
  onFileChange
}) => {
  // Get profile picture from the profile state
  const { profile } = useSelector((state: RootState) => state.userProfile)
  const [avatarUrl, setAvatarUrl] = useState('/default-avatar.png')

  // Update avatar URL when profile or preview changes
  useEffect(() => {
    if (previewImage) {
      setAvatarUrl(previewImage)
    } else if (profile?.profilePicture) {
      setAvatarUrl(profile.profilePicture)
    } else {
      setAvatarUrl(user.avatar || '/default-avatar.png')
    }
  }, [previewImage, profile, user])

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img 
                src={avatarUrl} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={() => setAvatarUrl('/default-avatar.png')}
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-purple-500 text-white p-2 rounded-full cursor-pointer">
                  <Camera size={20} />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={onFileChange}
                  />
                </label>
              )}
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-white/80">{user.email}</p>
            <div className="mt-2 flex items-center space-x-2">
              <span className="bg-white/20 text-white text-xs font-medium px-2.5 py-0.5 rounded">
                {user.role}
              </span>
            </div>
          </div>
        </div>
        <div>
          {!isEditing ? (
            <button 
              onClick={onEditToggle}
              className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
            >
              <Edit size={24} />
            </button>
          ) : (
            <div className="flex space-x-2">
              <button 
                onClick={onSubmit}
                className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 transition-colors"
              >
                <Save size={24} />
              </button>
              <button 
                onClick={onCancel}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}