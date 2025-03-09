import React from 'react'
import { FileText } from 'lucide-react'

interface ProfileBioSectionProps {
  bio: string | undefined
  isEditing: boolean
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export const ProfileBioSection: React.FC<ProfileBioSectionProps> = ({
  bio,
  isEditing,
  onChange
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center mb-4">
        <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg mr-4">
          <FileText className="text-purple-600 dark:text-purple-300" size={24} />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">About Me</h3>
      </div>
      
      {isEditing ? (
        <div className="mt-3">
          <textarea
            id="bio"
            name="bio"
            rows={4}
            className="block w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                      focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            value={bio || ''}
            onChange={onChange}
            placeholder="Tell us about yourself..."
          />
          <p className="text-xs text-gray-500 mt-2">
            Share a little about yourself, your interests, or your experience.
          </p>
        </div>
      ) : (
        <div className="mt-3 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-purple-500">
          {bio ? (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {bio}
            </p>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500">
              <span className="block mb-2">✏️</span>
              <p>No bio available yet</p>
              <p className="text-sm mt-1">Click edit to add your bio</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}