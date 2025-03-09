import React from 'react'
import { Globe, ExternalLink } from 'lucide-react'

interface ProfileWebsiteSectionProps {
  website: string | undefined
  isEditing: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const ProfileWebsiteSection: React.FC<ProfileWebsiteSectionProps> = ({
  website,
  isEditing,
  onChange
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center mb-4">
        <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg mr-4">
          <Globe className="text-blue-600 dark:text-blue-300" size={24} />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Website</h3>
      </div>
      
      {isEditing ? (
        <div className="mt-3">
          <div className="relative">
            <input
              type="url"
              id="website"
              name="website"
              className="block w-full pl-10 rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={website || ''}
              onChange={onChange}
              placeholder="https://www.example.com"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Share your personal website or portfolio
          </p>
        </div>
      ) : (
        <div className="mt-3 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-blue-500">
          {website ? (
            <a 
              href={website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors group"
            >
              <ExternalLink className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              <span className="underline underline-offset-2 decoration-2 decoration-blue-300 dark:decoration-blue-500">
                {website}
              </span>
              <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                Visit
              </span>
            </a>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500">
              <span className="block mb-2">🌐</span>
              <p>No website available yet</p>
              <p className="text-sm mt-1">Click edit to add your website</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}