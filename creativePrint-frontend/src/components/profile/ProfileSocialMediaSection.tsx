import React from 'react'
import { Share2, Twitter, Facebook, Instagram, Linkedin, Github, Dribbble, Youtube, Mail } from 'lucide-react'
import { socialMediaUtils } from '../../utils/profileValidation'

interface ProfileSocialMediaSectionProps {
  socialMediaLinks: string | undefined
  isEditing: boolean
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

// Social media platforms with their colors and icons
const socialPlatforms = [
  { name: 'Twitter', icon: Twitter, color: '#1DA1F2', bgColor: '#1DA1F233' },
  { name: 'Facebook', icon: Facebook, color: '#4267B2', bgColor: '#4267B233' },
  { name: 'Instagram', icon: Instagram, color: '#C13584', bgColor: '#C1358433' },
  { name: 'LinkedIn', icon: Linkedin, color: '#0077B5', bgColor: '#0077B533' },
  { name: 'GitHub', icon: Github, color: '#333', bgColor: '#33333322' },
  { name: 'Dribbble', icon: Dribbble, color: '#EA4C89', bgColor: '#EA4C8933' },
  { name: 'YouTube', icon: Youtube, color: '#FF0000', bgColor: '#FF000033' },
];

export const ProfileSocialMediaSection: React.FC<ProfileSocialMediaSectionProps> = ({
  socialMediaLinks,
  isEditing,
  onChange
}) => {
  // Helper function to parse links when not in editing mode
  const parseLinks = (links: string): string[] => {
    if (!links) return [];
    return links.split('\n').filter(link => link.trim() !== '');
  };

  // Parse social media links when not in editing mode
  const parsedLinks = socialMediaLinks ? parseLinks(socialMediaLinks) : [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center mb-4">
        <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg mr-4">
          <Share2 className="text-green-600 dark:text-green-300" size={24} />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Social Media</h3>
      </div>
      
      {isEditing ? (
        <div className="mt-3">
          <textarea
            id="socialMediaLinks"
            name="socialMediaLinks"
            rows={4}
            className="block w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                      focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            value={socialMediaLinks || ''}
            onChange={onChange}
            placeholder="Add your social media profile URLs (one per line)"
          />
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Examples:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {socialPlatforms.map(platform => (
                <div key={platform.name} className="flex items-center">
                  <platform.icon size={12} className="mr-1" style={{ color: platform.color }} />
                  <span>{platform.name}: https://{platform.name.toLowerCase()}.com/yourusername</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3">
          {parsedLinks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {parsedLinks.map((link, index) => {
                const platform = socialMediaUtils.getPlatform(link);
                const platformInfo = socialPlatforms.find(p => p.name === platform) || 
                                    { name: 'Website', icon: Mail, color: '#6B7280', bgColor: '#6B728022' };
                const Icon = platformInfo.icon;
                
                return (
                  <a
                    key={index}
                    href={link.startsWith('http') ? link : `https://${link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 rounded-lg transition-all duration-300 hover:shadow-md group"
                    style={{ backgroundColor: platformInfo.bgColor }}
                  >
                    <div className="mr-3 p-2 rounded-full transition-all duration-300" 
                         style={{ backgroundColor: platformInfo.color + '33' }}>
                      <Icon 
                        size={20} 
                        style={{ color: platformInfo.color }}
                        className="group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-sm font-medium" 
                            style={{ color: platformInfo.color }}>
                        {platformInfo.name}
                      </span>
                      <span className="text-xs text-gray-500 truncate max-w-[150px]">
                        {link.replace(/^https?:\/\/(www\.)?/, '')}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-green-500">
              <span className="block mb-2">📱</span>
              <p>No social media links available yet</p>
              <p className="text-sm mt-1">Click edit to add your social profiles</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}